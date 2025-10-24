"use client"
import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, Crown, Zap, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function UpgradeSuccessPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-6">
            <Card className="max-w-2xl w-full text-center">
                <CardHeader className="pb-4">
                    <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4">
                        <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <CardTitle className="text-3xl font-bold text-green-600">
                        Payment Successful!
                    </CardTitle>
                    <CardDescription className="text-lg">
                        Welcome to Creative Guru Pro! Your account has been upgraded successfully.
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                    <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-6">
                        <div className="flex items-center justify-center mb-4">
                            <Crown className="w-6 h-6 text-purple-600 mr-2" />
                            <h3 className="text-xl font-semibold">Pro Plan Activated</h3>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300">
                            You now have access to unlimited AI generations, high-quality outputs, and priority support.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                            <Zap className="w-5 h-5 text-blue-600 mb-2" />
                            <h4 className="font-semibold">100 Generations</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                AI image generations this month
                            </p>
                        </div>
                        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                            <CheckCircle className="w-5 h-5 text-green-600 mb-2" />
                            <h4 className="font-semibold">High Quality</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                Premium image and video quality
                            </p>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <h4 className="font-semibold text-left">What's Next?</h4>
                        <div className="space-y-2 text-left">
                            <div className="flex items-center">
                                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                                <span className="text-sm">Start creating with unlimited generations</span>
                            </div>
                            <div className="flex items-center">
                                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                                <span className="text-sm">Access to avatar generation features</span>
                            </div>
                            <div className="flex items-center">
                                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                                <span className="text-sm">Create professional videos with AI</span>
                            </div>
                            <div className="flex items-center">
                                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                                <span className="text-sm">Priority customer support</span>
                            </div>
                        </div>
                    </div>
                </CardContent>

                <div className="p-6 pt-0">
                    <div className="flex flex-col sm:flex-row gap-3">
                        <Link href="/creative-ai-tools" className="flex-1">
                            <Button className="w-full">
                                Start Creating
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        </Link>
                        <Link href="/my-ads" className="flex-1">
                            <Button variant="outline" className="w-full">
                                View My Ads
                            </Button>
                        </Link>
                    </div>
                </div>
            </Card>
        </div>
    )
}


