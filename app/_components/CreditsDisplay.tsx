"use client"
import React from 'react'
import { useAuthContext } from '../provider'
import { Button } from '@/components/ui/button'
import { Diamond } from 'lucide-react'
import Link from 'next/link'

export default function CreditsDisplay() {
  const { user, userData } = useAuthContext();

  if (!user || !userData) {
    return null;
  }

  return (
    <div className="bg-black rounded-lg p-4 mb-4">
      <div className="flex items-center gap-2 mb-3">
        <Diamond className="h-5 w-5 text-white" />
        <span className="text-white font-medium">
          {userData.credits || 0} Credits Left
        </span>
      </div>
      <Link href="/upgrade" className="w-full">
        <Button 
          className="w-full bg-gradient-to-r from-[#CCFF02] to-[#02BCCC] text-black font-bold hover:from-[#A6E200] hover:to-[#0299A3] transition-all duration-200"
        >
          Buy More Credits
        </Button>
      </Link>
    </div>
  );
}
