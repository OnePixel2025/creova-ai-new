"use client"
import { useAuthContext } from '@/app/provider'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const AiTools = [
    {
      name: 'Image Generation',
      desc: 'Generate high-quality, professional product images instantly with AI.',
      banner: '/product-image.png',
      path: '/creative-ai-tools/product-images',
      gradient: 'from-[#ffffff] to-[#CCFF02]'
    },
    {
      name: 'Video Generation',
      desc: 'Create engaging product showcase videos using AI.',
      banner: '/product-video.png',
      path: '/creative-ai-tools/product-video',
      gradient: 'from-[#CCFF02] to-[#02BCCC]'
    },
    {
      name: 'Products With Avatar',
      desc: 'Bring your products to life with AI avatars.',
      banner: '/product-avatar.png',
      path: '/creative-ai-tools/product-avatar',
      gradient: 'from-[#02BCCC] to-[#ffffff]'
    }
  ]
  

  

function AiToolList() {
    const { user } = useAuthContext();

    return (
        <div>
            <h2 className='font-bold text-2xl mb-2'>Creative AI Tools</h2>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3'>
                {AiTools.map((tool, index) => (
                    <div key={index} className={`grid grid-cols-1 lg:grid-cols-2 items-center justify-between 
                        p-7 rounded-2xl bg-gradient-to-r ${tool.gradient}`}>
                        <div>
                            <h2 className='font-bold text-2xl text-black'>{tool.name}</h2>
                            <p className='opacity-60 mt-2 text-black'>{tool.desc}</p>
                            <Link href={user ? tool.path : '/login'}>
                                <Button className='mt-4 text-white bg-black font-bold hover:bg-black/75'>Create Now</Button>
                            </Link>
                        </div>
                        <Image src={tool.banner} alt={tool.name}
                            width={300}
                            height={300}
                            className="w-[200px]"
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default AiToolList