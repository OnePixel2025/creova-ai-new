
// The following code is for a Next.js API route that handles product image generation using OpenAI.

// The code imports necessary libraries and Firebase configurations.
import { db } from "@/configs/firebaseConfig";
import { imagekit } from "@/lib/imagekit";
import { clientOpenAi } from "@/lib/openai";
import { replicate } from "@/lib/replicate";
import { collection, deleteDoc, doc, getDocs, query, setDoc, updateDoc, where } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

// PROMPT is a constant string defining the prompt for generating a product showcase image.
const PROMPT = `Create a vibrant product showcase image featuring a uploaded image
in the center, surrounded by dynamic splashes of liquid or relevant material that complement the product.
 Use a clean, colorful background to make the product stand out. Include subtle elements related to the product's flavor,
  ingredients, or theme floating around to add context and visual interest. 
  Ensure the product is sharp and in focus, with motion and energy conveyed through the splash effects ,
 Also give me image to video prompt for same in JSON format: {textToImage:'',imageToVideo:''}. Do not add any raw text or comment, Just give Json
`

// AVATAR_PROMPT is a constant string defining the prompt for generating a product showcase image with an avatar.
const AVATAR_PROMPT = `Create a professional product showcase image 
featuring the uploaded avatar naturally holding
 the uploaded product image in their hands. Make 
 the product the clear focal point of the scene. 
 Use a clean, colorful background that highlights the product.
  Include subtle floating elements related to the product’s flavor, 
  ingredients, or theme for added context, if relevant. Ensure both the avatar and product are sharp, well-lit, and in focus, 
conveying a polished and professional look.Also give me image to video prompt for same 
   in JSON format: {textToImage:'',imageToVideo:''} Do not add any raw text or comment, Just give Json`

// POST is an asynchronous function that handles the POST request.
export async function POST(req: NextRequest) {
    // It parses the form data from the request.
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const description = formData.get('description');
    const size = formData?.get('size');
    const userEmail = formData?.get('userEmail');
    const avatar = formData?.get('avatar') as string;
    const imageUrl = formData?.get('imageUrl') as string


    // It queries the 'users' collection in Firebase to find the user document based on the email.
    const userRef = collection(db, 'users');
    const q = query(userRef, where('email', '==', userEmail));
    const querySnapshot = await getDocs(q);
    const userDoc = querySnapshot.docs[0];
    const userInfo = userDoc.data();

    // Check if user has enough credits
    const creditsRequired = avatar?.length > 2 ? 5 : 2; // 5 for avatar, 2 for regular image
    if (userInfo.credits < creditsRequired) {
        return NextResponse.json({ error: 'Insufficient credits' }, { status: 400 });
    }


    // A unique document ID is created, and a new document is set in the 'user-ads' collection with a 'pending' status.
    const docId = Date.now().toString();
    await setDoc(doc(db, 'user-ads', docId), {
        userEmail: userEmail,
        status: 'pending',
        description: description,
        size: size,
        docId: docId,
        // Community fields
        userName: userInfo.displayName || userInfo.email?.split('@')[0] || 'Anonymous',
        userAvatar: userInfo.photoURL || null,
        category: 'other', // Default category, can be updated later
        style: 'modern', // Default style, can be updated later
        tags: [], // Empty tags array, can be populated later
        likes: 0,
        comments: 0,
        isPublic: true, // Make posts public by default for community
        createdAt: new Date()
    })

    try {
        // If an image URL is not provided, the uploaded file is converted to a base64 string and uploaded to ImageKit.
        let imageKitRef: any;
        if (!imageUrl) {
            const arrayBuffer = await file.arrayBuffer();
            const base64File = Buffer.from(arrayBuffer).toString('base64');

            imageKitRef = await imagekit.upload({
                file: base64File,
                fileName: Date.now() + ".png",
                isPublished: true
            });
        }



        // An API call is made to OpenAI's GPT-4o-mini model to generate a text prompt for image creation,
        // using either AVATAR_PROMPT or PROMPT based on whether an avatar is present.
        const response = await clientOpenAi.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: 'user',
                    content: [
                        {
                            type: 'text',
                            text: avatar?.length > 2 ? AVATAR_PROMPT : PROMPT
                        },
                        {
                            type: 'image_url',
                            image_url: {
                                url: imageUrl?.length > 0 ? imageUrl : imageKitRef.url
                            }
                        }
                    ]
                }
            ]
        });



        // The response text is parsed as JSON.
        let textOutput = response.choices[0]?.message?.content?.trim() || "";

        // Raw code fences are removed.
        textOutput = textOutput.replace("```json", '').replace('```', '').trim();
        let json = JSON.parse(textOutput);
        console.log("JSON", json)
        // Generate image using Google nano-banana from Replicate
        console.log('Generating image with nano-banana...');
        
        // Prepare image inputs - include both product image and avatar if available
        const imageInputs = [imageUrl?.length > 0 ? imageUrl : imageKitRef.url];
        if (avatar?.length > 2) {
            imageInputs.push(avatar);
            console.log('Including avatar image in nano-banana input:', avatar);
        }
        
        const input = {
            prompt: json?.textToImage,
            image_input: imageInputs
        };

        console.log('Nano-banana input:', {
            prompt: json?.textToImage,
            image_count: imageInputs.length,
            images: imageInputs
        });

        const output = await replicate.run("google/nano-banana", { input });
        console.log('Nano-banana output:', output);

        // Get the generated image URL
        const generatedImageUrl = Array.isArray(output) ? output[0] : output;
        console.log('Generated image URL:', generatedImageUrl);

        if (!generatedImageUrl) {
            throw new Error('Failed to generate image with nano-banana');
        }

        // Download the generated image from Replicate URL
        console.log('Downloading image from Replicate URL:', generatedImageUrl);
        const imageResponse = await fetch(generatedImageUrl);
        const imageBuffer = Buffer.from(await imageResponse.arrayBuffer());
        console.log('Image downloaded, buffer size:', imageBuffer.length);

        // The generated image is uploaded to ImageKit.
        console.log('Uploading to ImageKit...');
        let uploadResult;
        let finalImageUrl = generatedImageUrl; // Fallback to Replicate URL
        
        try {
            uploadResult = await imagekit.upload({
                file: imageBuffer,
                fileName: `generate-${Date.now()}.png`,
                isPublished: true,
                useUniqueFileName: true,
                folder: '/ai-generated-images/',
                tags: ['ai-generated', 'product-image'],
                customCoordinates: '',
                responseFields: 'all'
            })
            console.log('ImageKit upload result:', uploadResult);
            // Use high-quality URL transformation to preserve quality
            finalImageUrl = uploadResult.url + '?tr=w-auto,h-auto,q-100,f-auto';
        } catch (uploadError) {
            console.error('ImageKit upload failed:', uploadError);
            console.log('Using Replicate URL as fallback:', generatedImageUrl);
            // Continue with Replicate URL instead of throwing error
        }

        // The 'user-ads' document is updated with the final image URL, product image URL, 'completed' status, and the image-to-video prompt.
        await updateDoc(doc(db, 'user-ads', docId), {
            finalProductImageUrl: finalImageUrl,
            productImageUrl: imageUrl?.length > 0 ? imageUrl : imageKitRef.url,
            status: 'completed',
            imageToVideoPrompt: json?.imageToVideo // Save Image to Video prompt
        })

        // Deduct credits from user account
        await updateDoc(doc(db, 'users', userDoc.id), {
            credits: userInfo.credits - creditsRequired
        });

        // The URL of the generated image is returned in the response.
        return NextResponse.json(finalImageUrl);
    }
    // If an error occurs, the 'user-ads' document is deleted and an error response is returned.
    catch (e) {
        await deleteDoc(doc(db, 'user-ads', docId));
        console.log(e)
        return NextResponse.json({ error: 'Please Try Again' });

    }
}
