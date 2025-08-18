
import React, { useState } from 'react';
import Button from '../components/ui/Button.tsx';
import Input from '../components/ui/Input.tsx';
import { ICONS } from '../constants.tsx';

const CommunitiesPage: React.FC = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Simulate a network request
        setTimeout(() => {
            setIsSubmitting(false);
            setSubmitStatus('success');
            (e.target as HTMLFormElement).reset();
        }, 1500);
    }

  return (
    <div className="animate-fadeInUp">
        {/* Hero Section */}
        <section className="relative py-32 text-center overflow-hidden bg-brand-surface">
            <div 
            className="absolute inset-0 opacity-20 animate-aurora"
            style={{
                backgroundImage: `
                radial-gradient(at 21% 33%, hsl(204.00, 70%, 20%) 0px, transparent 50%),
                radial-gradient(at 79% 30%, hsl(38.82, 100%, 20%) 0px, transparent 50%),
                radial-gradient(at 22% 85%, hsl(20.00, 70%, 30%) 0px, transparent 50%),
                radial-gradient(at 84% 86%, hsl(210.00, 50%, 15%) 0px, transparent 50%)
                `,
                backgroundColor: 'hsl(210, 40%, 2%)'
            }}
            ></div>
            <div className="container mx-auto px-4 relative z-10">
            <h1 className="text-5xl md:text-7xl font-serif font-extrabold tracking-tight text-brand-gold">
                Light Communities
            </h1>
            <p className="mt-6 max-w-3xl mx-auto text-lg md:text-xl text-brand-text-dark">
                Don't do life alone. Our Light Communities are small groups designed for you to grow in faith, build authentic relationships, and live out the Gospel together.
            </p>
            </div>
        </section>

        {/* Why Join Section */}
        <section className="py-24 bg-brand-dark">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16 max-w-3xl mx-auto">
                    <h2 className="text-4xl font-serif font-bold text-white">Why Join a Community?</h2>
                    <p className="mt-3 text-brand-text-dark">Experience the power of biblical community where you can be known, loved, and challenged.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <BenefitCard 
                        icon={<ICONS.Users className="h-8 w-8 text-brand-gold"/>} 
                        title="Deeper Connection" 
                        description="Move from rows to circles. Build meaningful friendships that extend beyond our Tuesday services." 
                    />
                    <BenefitCard 
                        icon={<ICONS.BookOpen className="h-8 w-8 text-brand-gold"/>} 
                        title="Spiritual Growth" 
                        description="Discuss teachings, study Scripture, and pray for one another in a safe and supportive environment." 
                    />
                    <BenefitCard 
                        icon={<ICONS.Heart className="h-8 w-8 text-brand-gold"/>} 
                        title="Shared Life" 
                        description="Celebrate victories, carry burdens, and practice the 'one another' commands of the New Testament." 
                    />
                </div>
            </div>
        </section>

        {/* Get Connected Form */}
        <section className="py-24 bg-brand-surface">
            <div className="container mx-auto px-4">
                 <div className="max-w-2xl mx-auto bg-brand-dark p-8 rounded-lg border border-brand-muted/50">
                    <h2 className="text-3xl font-serif font-bold text-white mb-2 text-center">Get Connected</h2>
                    <p className="text-center text-brand-text-dark mb-6">Ready to take the next step? Fill out the form below and we'll help you find the right community.</p>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <Input label="Your Name" name="name" required />
                        <Input label="Your Email" name="email" type="email" required />
                        <div>
                             <textarea
                                name="message"
                                rows={4}
                                placeholder="Tell us a bit about yourself (optional)"
                                className="w-full bg-brand-muted border border-transparent rounded-md p-4 text-brand-text placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-gold"
                            />
                        </div>
                        <Button type="submit" isLoading={isSubmitting} className="w-full" size="lg">I'm Interested!</Button>
                        {submitStatus === 'success' && <p className="text-green-400 text-center">Thanks for reaching out! We'll be in touch soon with more details.</p>}
                        {submitStatus === 'error' && <p className="text-red-400 text-center">Something went wrong. Please try again later.</p>}
                    </form>
                </div>
            </div>
        </section>
    </div>
  );
};


interface BenefitCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
}

const BenefitCard: React.FC<BenefitCardProps> = ({ icon, title, description }) => (
    <div className="bg-brand-surface p-8 rounded-lg text-center border border-brand-muted/50 transition-all duration-300 transform hover:-translate-y-2 hover:border-brand-gold/30">
        <div className="inline-block p-4 bg-brand-muted rounded-full mb-4">
            {icon}
        </div>
        <h3 className="text-xl font-serif font-bold text-white">{title}</h3>
        <p className="mt-2 text-brand-text-dark text-sm">{description}</p>
    </div>
);


export default CommunitiesPage;
