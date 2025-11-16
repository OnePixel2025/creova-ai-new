"use client"
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import React, { useEffect, useState, useMemo } from 'react'
import { collection, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { db } from '@/configs/firebaseConfig';
import { Play } from 'lucide-react';
import Link from 'next/link';

type CommunityItem = {
    id: string;
    docId?: string;
    finalProductImageUrl: string;
    videoUrl?: string;
    userName: string;
    userAvatar?: string;
    status: string;
    avatar?: string;
    createdAt?: any;
}

type FilterType = 'all' | 'images' | 'videos';

function CommunityGallery() {
    const [items, setItems] = useState<CommunityItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState<FilterType>('all');
    const [videoErrors, setVideoErrors] = useState<Set<string>>(new Set());
    const [mounted, setMounted] = useState(false);

    // Handle client-side mounting to avoid hydration issues
    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted) return;
        
        // Fetch all completed user-ads (no userEmail filter)
        // Start with simpler query to avoid index requirement, then sort manually
        const q = query(
            collection(db, "user-ads"),
            where('status', '==', 'completed')
        );

        const unSub = onSnapshot(q, (querySnapshot) => {
            const matchedDocs: CommunityItem[] = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                // Only include items with valid image URLs
                if (data.finalProductImageUrl) {
                    matchedDocs.push({ id: doc.id, ...data } as CommunityItem);
                }
            });
            
            // Sort manually by docId or createdAt (newest first)
            matchedDocs.sort((a, b) => {
                // Use docId field if available (stored as Date.now().toString()), otherwise use document id or createdAt
                const aId = a.docId ? parseInt(a.docId) : (a.id ? parseInt(a.id) : (a.createdAt?.toMillis?.() || a.createdAt?.seconds * 1000 || 0));
                const bId = b.docId ? parseInt(b.docId) : (b.id ? parseInt(b.id) : (b.createdAt?.toMillis?.() || b.createdAt?.seconds * 1000 || 0));
                return bId - aId;
            });
            
            setItems(matchedDocs);
            setLoading(false);
        }, (error) => {
            console.error('Error fetching community items:', error);
            setLoading(false);
        });

        return () => unSub();
    }, [mounted]);

    // Determine item type and filter items
    const filteredItems = useMemo(() => {
        return items.filter(item => {
            if (activeFilter === 'all') return true;
            
            // Determine type: if videoUrl exists, it's a video
            // Else if avatar exists and has length > 2, it's an avatar
            // Otherwise it's an image
            const hasVideo = !!item.videoUrl;
            const hasAvatar = item.avatar && item.avatar.length > 2;
            
            if (activeFilter === 'videos') return hasVideo;
            if (activeFilter === 'images') return !hasVideo && !hasAvatar;
            
            return true;
        });
    }, [items, activeFilter]);

    const filters: { label: string; value: FilterType }[] = [
        { label: 'All', value: 'all' },
        { label: 'Images', value: 'images' },
        { label: 'Videos', value: 'videos' },
    ];

    // Prevent hydration mismatch by not rendering until mounted
    if (!mounted) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-[#CCFF02]'></div>
                <h2 className='mt-4 text-lg'>Loading community...</h2>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-[#CCFF02]'></div>
                <h2 className='mt-4 text-lg'>Loading community...</h2>
            </div>
        );
    }

    return (
        <div className="p-5">
            <h2 className='font-bold text-2xl mb-6'>Community Gallery</h2>

            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-2 mb-6">
                {filters.map((filter) => (
                    <Button
                        key={filter.value}
                        onClick={() => setActiveFilter(filter.value)}
                        variant={activeFilter === filter.value ? 'default' : 'outline'}
                        className={
                            activeFilter === filter.value
                                ? 'text-black bg-gradient-to-r from-[#CCFF02] to-[#02BCCC] font-bold hover:from-[#A6E200] hover:to-[#0299A3]'
                                : ''
                        }
                    >
                        {filter.label}
                    </Button>
                ))}
            </div>

            {/* Empty State */}
            {filteredItems.length === 0 && (
                <div className='p-5 border-dashed border-2 rounded-2xl flex flex-col items-center justify-center mt-6 gap-3'>
                    <h2 className='text-xl'>No {activeFilter === 'all' ? '' : activeFilter} content found</h2>
                    <p className='text-gray-500'>Check back later for community creations!</p>
                </div>
            )}

            {/* Gallery Grid */}
            <div className='grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5'>
                {filteredItems.map((item) => (
                    <div key={item.id} className="group">
                        <div className="relative w-full h-[250px] lg:h-[370px] rounded-xl overflow-hidden bg-zinc-800 border border-zinc-700">
                            {item.videoUrl && !videoErrors.has(item.id) ? (
                                <>
                                    <video
                                        src={item.videoUrl}
                                        className="w-full h-full object-contain"
                                        controls={false}
                                        muted
                                        loop
                                        playsInline
                                        onError={(e) => {
                                            console.error('Video failed to load:', item.videoUrl, e);
                                            setVideoErrors(prev => new Set(prev).add(item.id));
                                        }}
                                    />
                                    {/* Play icon overlay for videos */}
                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                        <div className="bg-black/50 rounded-full p-3">
                                            <Play className="h-8 w-8 text-white fill-white" />
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <Image
                                    src={item.finalProductImageUrl}
                                    alt={item.id}
                                    width={400}
                                    height={400}
                                    className='w-full h-full object-contain'
                                    onError={(e) => {
                                        console.error('Image failed to load:', item.finalProductImageUrl, e);
                                        const target = e.target as HTMLImageElement;
                                        target.style.display = 'none';
                                    }}
                                />
                            )}
                            
                            {/* Overlay with user info */}
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="flex items-center gap-2">
                                    {item.userAvatar ? (
                                        <Image
                                            src={item.userAvatar}
                                            alt={item.userName}
                                            width={24}
                                            height={24}
                                            className="rounded-full"
                                            unoptimized
                                        />
                                    ) : (
                                        <div className="w-6 h-6 rounded-full bg-[#CCFF02] flex items-center justify-center text-black text-xs font-bold">
                                            {item.userName?.charAt(0)?.toUpperCase() || 'U'}
                                        </div>
                                    )}
                                    <span className="text-white text-sm font-medium truncate">
                                        {item.userName || 'Anonymous'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className='flex items-center mt-2 justify-between gap-2'>
                            <Link href={item.videoUrl || item.finalProductImageUrl} target='_blank'>
                                <Button variant={'outline'} size="sm" className="flex-1">
                                    {item.videoUrl ? <><Play className="h-4 w-4 mr-1" /> Play</> : 'View'}
                                </Button>
                            </Link>
                            
                            {/* User name badge - always visible */}
                            <div className="flex items-center gap-1 text-sm text-gray-500 truncate">
                                {item.userAvatar ? (
                                    <Image
                                        src={item.userAvatar}
                                        alt={item.userName}
                                        width={20}
                                        height={20}
                                        className="rounded-full"
                                        unoptimized
                                    />
                                ) : (
                                    <div className="w-5 h-5 rounded-full bg-[#CCFF02] flex items-center justify-center text-black text-xs font-bold">
                                        {item.userName?.charAt(0)?.toUpperCase() || 'U'}
                                    </div>
                                )}
                                <span className="truncate max-w-[100px]">{item.userName || 'Anonymous'}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default CommunityGallery;

