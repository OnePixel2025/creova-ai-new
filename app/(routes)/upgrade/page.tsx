"use client"
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Check, Crown, Zap, Star, CreditCard, Shield, Clock, ChevronDown, ChevronUp } from 'lucide-react'
import { useAuthContext } from '@/app/provider'
import { useRouter } from 'next/navigation'

// Badge component inline to avoid import issues
const Badge = ({ children, className, ...props }: { children: React.ReactNode; className?: string; [key: string]: any }) => (
    <div className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors ${className || ''}`} {...props}>
        {children}
    </div>
)

const pricingPlans = [
    {
        name: "Starter",
        price: "Free",
        description: "Perfect for trying out our AI tools",
        features: [
            "20 Credits",
            "Basic image quality",
            "Standard support",
            "Cloud storage",
            "Unlimitied downloads"
        ],
        limitations: [
            "Limited to 5 generations",
            "Basic quality only",
            "No priority support"
        ],
        popular: false,
        buttonText: "Current Plan",
        buttonVariant: "outline" as const,
        disabled: true
    },
    {
        name: "Pro",
        price: "$19",
        period: "/month",
        description: "For creators who need more power",
        features: [
            "50 Credits",
            "High-quality images",
            "Priority support",
            "Commercial license",
            "Cloud storage",
            "Unlimitied downloads"
        ],
        popular: true,
        buttonText: "Upgrade to Pro",
        buttonVariant: "default" as const,
        disabled: false
    },
    {
        name: "Enterprise",
        price: "$99",
        period: "/month",
        description: "For teams and businesses",
        features: [
            "200 Credits",
            "Ultra-high quality images",
            "Dedicated support",
            "Custom integrations",
            "Cloud storage",
            "Unlimitied downloads"
        ],
        popular: false,
        buttonText: "Contact Sales",
        buttonVariant: "outline" as const,
        disabled: false
    }
]

const paymentMethods = [
    { name: "Credit Card", icon: CreditCard, id: "card" },
    { name: "PayPal", icon: Shield, id: "paypal" },
    { name: "Stripe", icon: Star, id: "stripe" }
]

const faqData = [
    {
        id: "change-plans",
        question: "Can I change plans anytime?",
        answer: "Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately and you'll be charged or credited the difference on a prorated basis."
    },
    {
        id: "payment-methods",
        question: "What payment methods do you accept?",
        answer: "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers for Enterprise plans. All payments are processed securely through our payment partners."
    },
    {
        id: "free-trial",
        question: "Is there a free trial?",
        answer: "Yes! All paid plans come with a 7-day free trial. No credit card required to start. You can cancel anytime during the trial period without being charged."
    },
    {
        id: "refunds",
        question: "Do you offer refunds?",
        answer: "We offer a 30-day money-back guarantee for all paid plans. If you're not satisfied with our service, contact our support team for a full refund within 30 days of your purchase."
    },
    {
        id: "billing",
        question: "How does billing work?",
        answer: "Billing is monthly or annually depending on your plan. You'll be charged automatically on your renewal date. You can view your billing history and update payment methods in your account settings."
    },
    {
        id: "support",
        question: "What kind of support do you provide?",
        answer: "Pro users get priority email support with 24-hour response time. Enterprise users get dedicated support with phone and chat options. All users have access to our comprehensive knowledge base."
    }
]

export default function UpgradePage() {
    const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
    const [selectedPayment, setSelectedPayment] = useState("card")
    const [isProcessing, setIsProcessing] = useState(false)
    const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null)
    const { user } = useAuthContext()
    const router = useRouter()

    const handleUpgrade = async (planName: string) => {
        if (!user) {
            router.push('/login')
            return
        }

        setIsProcessing(true)
        
        // Simulate payment processing
        setTimeout(() => {
            setIsProcessing(false)
            // Here you would integrate with your payment provider
            console.log(`Processing payment for ${planName} plan`)
            // Redirect to success page or show success message
        }, 2000)
    }

    const toggleFAQ = (faqId: string) => {
        setExpandedFAQ(expandedFAQ === faqId ? null : faqId)
    }

    return (
        <div className="min-h-screen p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        Choose Your Plan
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                        Unlock the full potential of AI-powered content creation with our flexible pricing plans
                    </p>
                </div>

                {/* Pricing Cards */}
                <div className="grid md:grid-cols-3 gap-8 mb-12">
                    {pricingPlans.map((plan, index) => (
                        <Card 
                            key={plan.name} 
                            className={`relative transition-all duration-300 hover:scale-105 ${
                                plan.popular 
                                    ? 'border-[#CCFF02] shadow-xl scale-105' 
                                    : 'border-gray-200 dark:border-gray-700'
                            }`}
                        >
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                    <Badge className="bg-[#CCFF02] text-black px-4 py-1">
                                        <Crown className="w-4 h-4 mr-1" />
                                        Most Popular
                                    </Badge>
                                </div>
                            )}
                            
                            <CardHeader className="text-center pb-4">
                                <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                                <div className="mt-4">
                                    <span className="text-4xl font-bold">{plan.price}</span>
                                    {plan.period && (
                                        <span className="text-gray-500 dark:text-gray-400">{plan.period}</span>
                                    )}
                                </div>
                                <CardDescription className="mt-2">{plan.description}</CardDescription>
                            </CardHeader>

                            <CardContent>
                                <ul className="space-y-3">
                                    {plan.features.map((feature, featureIndex) => (
                                        <li key={featureIndex} className="flex items-center">
                                            <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                                            <span className="text-sm">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>

                            <CardFooter>
                                <Button
                                    className="w-full text-black bg-gradient-to-r from-[#CCFF02] to-[#02BCCC] font-bold hover:from-[#A6E200] hover:to-[#0299A3]"
                                    variant={plan.buttonVariant}
                                    disabled={plan.disabled || isProcessing}
                                    onClick={() => handleUpgrade(plan.name)}
                                >
                                    {isProcessing ? (
                                        <>
                                            <Clock className="w-4 h-4 mr-2 animate-spin" />
                                            Processing...
                                        </>
                                    ) : (
                                        plan.buttonText
                                    )}
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>

                {/* FAQ Section */}
                <div className="mt-16">
                    <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
                    <div className="max-w-4xl mx-auto space-y-4">
                        {faqData.map((faq, index) => {
                            const isExpanded = expandedFAQ === faq.id
                            return (
                                <Card 
                                    key={faq.id} 
                                    className={`transition-all duration-300 cursor-pointer ${
                                        isExpanded 
                                            ? 'border-[#CCFF02] shadow-lg' 
                                            : 'border-gray-200 dark:border-gray-700 hover:shadow-md'
                                    }`}
                                    onClick={() => toggleFAQ(faq.id)}
                                >
                                    <CardHeader className="pb-4">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-lg font-semibold text-left">{faq.question}</h3>
                                            <div className="p-2">
                                                {isExpanded ? (
                                                    <ChevronUp className="w-5 h-5 text-gray-500" />
                                                ) : (
                                                    <ChevronDown className="w-5 h-5 text-gray-500" />
                                                )}
                                            </div>
                                        </div>
                                    </CardHeader>

                                    {isExpanded && (
                                        <CardContent className="pt-0">
                                            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                                                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                                    {faq.answer}
                                                </p>
                                            </div>
                                        </CardContent>
                                    )}
                                </Card>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}
