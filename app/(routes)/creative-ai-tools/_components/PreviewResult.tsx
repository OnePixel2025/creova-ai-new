import { useAuthContext } from '@/app/provider'
import { Button } from '@/components/ui/button';
import { db } from '@/configs/firebaseConfig';
import axios from 'axios';
import { collection, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { Download, Loader2Icon, LoaderCircle, Play, Sparkles } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'

export type PreviewProduct = {
    id: string,
    finalProductImageUrl: string,
    productImageUrl: string,
    description: string,
    size: string,
    status: string,
    imageToVideoStatus: string,
    videoUrl: string
}

function PreviewResult({ }) {

    const { user, refreshUserData } = useAuthContext();
    const [productList, setProductList] = useState<PreviewProduct[]>();
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        if (!user?.email) return;
        const q = query(collection(db, "user-ads"),
            where('userEmail', '==', user?.email),
            orderBy('docId', 'desc'))

        const unSub = onSnapshot(q, (querySnapshot) => {
            const matchedDocs: any = [];
            querySnapshot.forEach((doc) => {
                matchedDocs.push({ id: doc.id, ...doc.data() });
            })
            console.log(matchedDocs)
            setProductList(matchedDocs);
        })

        return () => unSub();

    }, [user?.email])

    const DownloadImage = async (imageUrl: string) => {
        const result = await fetch(imageUrl);
        const blob = await result.blob();
        const blobUrl = window.URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = blobUrl;

        a.setAttribute('download', 'tubeguruji');
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(blobUrl);

    }



    const GenerateVideo = async (config: any) => {
        setLoading(true);
        try {
            const result = await axios.post('/api/generate-product-video', {
                imageUrl: config?.finalProductImageUrl,
                imageToVideoPromot: config?.imageToVideoPrompt,
                uid: user?.uid,
                docId: config?.id,
                userEmail: user?.email
            });
            console.log(result.data);
            // Refresh user data to update credits display
            await refreshUserData();
        } catch (error: any) {
            console.error('Video generation failed:', error);
            if (error.response?.data?.error === 'Insufficient credits') {
                alert('Insufficient credits! Please buy more credits to generate videos.');
            } else {
                alert('An error occurred. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    }


    return (
        <div className='p-5 rounded-2xl border'>
            <h2 className="font-bold text-2xl">Generated Result</h2>

            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4 h-[90vh] overflow-auto'>
                {productList?.map((product, index) => (
                    <div key={index} className="w-full">
                        {product?.status == 'completed' ?
                            <div className="w-full">
                                <Image src={product.finalProductImageUrl}
                                    alt={product.id}
                                    width={500}
                                    height={500}
                                    className='w-full h-[200px] sm:h-[220px] md:h-[250px] object-contain rounded-lg'
                                />
                                <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center mt-2 gap-2'>
                                    <div className='flex items-center gap-1 flex-wrap'>
                                        <Button 
                                            variant={'ghost'} 
                                            size="sm"
                                            onClick={() => DownloadImage(product.finalProductImageUrl)}
                                            className="h-8 w-8 p-0"
                                        > 
                                            <Download className="h-4 w-4" /> 
                                        </Button>
                                        <Link href={product.finalProductImageUrl} target='_blank'>
                                            <Button variant={'ghost'} size="sm" className="h-8 px-2 text-xs">
                                                View
                                            </Button>
                                        </Link>
                                        {product?.videoUrl && <Link href={product?.videoUrl} target='_blank'>
                                            <Button variant={'ghost'} size="sm" className="h-8 w-8 p-0">
                                                <Play className="h-4 w-4" />
                                            </Button>
                                        </Link>}
                                    </div>

                                    {!product?.videoUrl && (
                                        <Button 
                                            className='text-black bg-gradient-to-r from-[#CCFF02] to-[#02BCCC] font-bold hover:from-[#A6E200] hover:to-[#0299A3] text-xs h-8 px-2 min-w-fit'
                                            disabled={product?.imageToVideoStatus == 'pending'}
                                            onClick={() => GenerateVideo(product)}
                                        >
                                            {product?.imageToVideoStatus == 'pending' ? (
                                                <LoaderCircle className='animate-spin h-3 w-3' />
                                            ) : (
                                                <Sparkles className="h-3 w-3" />
                                            )} 
                                            <span>Animate</span>
                                        </Button>
                                    )}
                                </div>
                            </div>
                            : <div className='flex flex-col items-center justify-center border rounded-xl
                             h-[200px] sm:h-[220px] md:h-[250px] w-full
                            bg-zinc-800'>
                                <Loader2Icon className='animate-spin h-6 w-6 sm:h-8 sm:w-8' />
                                <h2 className="text-sm sm:text-base mt-2">Generating...</h2>

                            </div>}

                    </div>
                ))}
            </div>
        </div>
    )
}

export default PreviewResult