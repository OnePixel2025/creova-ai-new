"use client"
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import React, { useEffect, useState } from 'react'
import PreviewResult, { PreviewProduct } from '../../creative-ai-tools/_components/PreviewResult';
import { useAuthContext } from '@/app/provider';
import { collection, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { db } from '@/configs/firebaseConfig';
import { Play } from 'lucide-react';
import Link from 'next/link';

function UsersAdsList() {
    const [adsList, setAdsList] = useState<PreviewProduct[]>([]);

    const { user } = useAuthContext();
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
            console.log('Firebase data fetched:', matchedDocs)
            console.log('User email:', user?.email)
            setAdsList(matchedDocs);
        })

        return () => unSub();

    }, [user?.email])

    return (
        <div>
            <h2 className='font-bold text-2xl mb-2 mt-5'>My Ads</h2>

            {adsList?.length == 0 &&
                <div className='p-5 border-dashed border-2 rounded-2xl flex flex-col items-center justify-center mt-6 gap-3'>
                    
                    <h2 className='text-xl'>You don't have any ads created</h2>
                    <Link href={user ? '/creative-ai-tools/product-images' : '/login'}>
                        <Button className='text-black bg-gradient-to-r from-[#CCFF02] to-[#02BCCC] font-bold hover:from-[#A6E200] hover:to-[#0299A3]'>Create New Ads</Button>
                    </Link>
                </div>
            }

            <div className='grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5'>
                {adsList.map((ads, index) => {
                    console.log('Rendering ad:', ads.finalProductImageUrl, 'Status:', ads.status);
                    return (
                        <div key={index}>
                            {ads?.status == 'completed' ? (
                                <div>
                                    <Image src={ads.finalProductImageUrl} alt={ads.finalProductImageUrl}
                                        width={400}
                                        height={400}
                                        className='w-full h-[250px] lg:h-[370px] object-contain rounded-xl'
                                        onError={(e) => console.error('Image failed to load:', ads.finalProductImageUrl, e)}
                                        onLoad={() => console.log('Image loaded successfully:', ads.finalProductImageUrl)}
                                    />
                                    <div className='flex items-center mt-2 justify-between'>
                                        <Link href={ads.finalProductImageUrl} target='_blank' >
                                            <Button className='' variant={'outline'}>View</Button>
                                        </Link>

                                        {ads?.videoUrl &&
                                            <Link href={ads.videoUrl} target='_blank' >
                                                <Button className='text-black'><Play /></Button></Link>}
                                    </div>
                                </div>
                            ) : (
                                <div className='flex flex-col items-center justify-center border rounded-xl h-[250px] lg:h-[370px] bg-zinc-800'>
                                    <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-white'></div>
                                    <h2 className='mt-2'>Generating...</h2>
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>


        </div>
    )
}

export default UsersAdsList