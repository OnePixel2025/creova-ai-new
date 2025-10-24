import { db } from "@/configs/firebaseConfig";
import { imagekit } from "@/lib/imagekit";
import { replicate } from "@/lib/replicate";
import { collection, doc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const { imageUrl, imageToVideoPromot, uid, docId, userEmail } = await req.json();

    // Get user info and check credits
    const userRef = collection(db, 'users');
    const q = query(userRef, where('email', '==', userEmail));
    const querySnapshot = await getDocs(q);
    const userDoc = querySnapshot.docs[0];
    const userInfo = userDoc.data();

    // Check if user has enough credits (4 for video generation)
    const creditsRequired = 4;
    if (userInfo.credits < creditsRequired) {
        return NextResponse.json({ error: 'Insufficient credits' }, { status: 400 });
    }

    const input = {
        image: imageUrl,
        prompt: imageToVideoPromot
    };

    await updateDoc(doc(db, 'user-ads', docId), {
        imageToVideoStatus: 'pending',
    })

    console.log('Generating video with Google Veo-3-fast...');
    console.log('Video input:', input);
    
    const output = await replicate.run("google/veo-3-fast", { input });

    console.log('Veo-3-fast output:', output);

    // Get the generated video URL
    const videoUrl = Array.isArray(output) ? output[0] : output;
    console.log('Generated video URL:', videoUrl);

    if (!videoUrl) {
        throw new Error('Failed to generate video with Veo-3-fast');
    }

    //Save to Imagekit
    console.log('Downloading video from Veo-3-fast URL:', videoUrl);
    const resp = await fetch(videoUrl);
    const videoBuffer = Buffer.from(await resp.arrayBuffer());

    const uploadResult = await imagekit.upload({
        file: videoBuffer,
        fileName: `veo_video_${Date.now()}.mp4`,
        isPublished: true,
        useUniqueFileName: true,
        folder: '/ai-generated-videos/',
        tags: ['ai-generated', 'product-video', 'veo-3'],
        customCoordinates: '',
        responseFields: 'all'
    })

    // Use high-quality URL transformation for videos
    const highQualityVideoUrl = uploadResult.url + '?tr=q-100,f-auto';
    
    await updateDoc(doc(db, 'user-ads', docId), {
        imageToVideoStatus: 'completed',
        videoUrl: highQualityVideoUrl
    })

    // Deduct credits from user account
    await updateDoc(doc(db, 'users', userDoc.id), {
        credits: userInfo.credits - creditsRequired
    });

    //@ts-ignore
    return NextResponse.json(highQualityVideoUrl);
    //Save Video to Cloud
}