import React from 'react'
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Calendar, Home, Inbox, Megaphone, Search, Settings, Wallet2 } from "lucide-react"
import Image from 'next/image'
import { useParams, usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useAuthContext } from '../provider'
import ProfileAvatar from './ProfileAvatar'
import CreditsDisplay from './CreditsDisplay'

const items = [
    {
        title: "Home",
        url: "/app",
        icon: Home,
    },
    {
        title: "Creative Tools",
        url: "/creative-ai-tools",
        icon: Inbox,
    },
    {
        title: "My Ads",
        url: "/my-ads",
        icon: Megaphone,
    },
    {
        title: "Upgrade",
        url: "/upgrade",
        icon: Wallet2,
    },

]

export function AppSidebar() {
    const path = usePathname();
    const { user } = useAuthContext();
    return (
        <Sidebar>
            <SidebarHeader>
                <div className='p-2'>
                        <Image src={'/cerova-logo2.png'} alt='logo'
                            width={100} height={100}
                            className='w-full h-full' />
                </div>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>

                    <SidebarGroupContent>
                        <SidebarMenu className='mt-5'>
                            {items.map((item, index) => (
                                // <SidebarMenuItem key={item.title} className='p-2'>
                                //     <SidebarMenuButton asChild className=''>
                                <a href={item.url} key={index} className={`p-2 text-lg flex gap-2 items-center
                                 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg
                                 ${path.includes(item.url) && 'bg-gray-100 dark:bg-zinc-800'}`}>
                                    <item.icon className='h-5 w-5' />
                                    <span>{item.title}</span>
                                </a>
                                //     </SidebarMenuButton>
                                // </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                {!user ? <Link href={'/login'} className='w-full'>
                    <Button className='w-full text-black bg-gradient-to-r from-[#CCFF02] to-[#02BCCC] font-bold hover:from-[#A6E200] hover:to-[#0299A3]'>Sign In</Button>
                </Link>
                    : <>
                        <CreditsDisplay />
                    </>}
                    <h2 className="p-2 text-gray-400 text-sm">
                        Copyright {" "}
                        <a
                            href="https://www.instagram.com/onepixleagency/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#CCFF02] hover:underline"
                        >
                            ©OnePixle
                        </a>
                    </h2>

            </SidebarFooter>
        </Sidebar>
    )
}