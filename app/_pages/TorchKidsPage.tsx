'use client'

import React from 'react';
import { ICONS } from '@/src/constants';
import type { TorchKidsContent } from '@/lib/types';
import { useQuery } from '@tanstack/react-query';
import { useApi } from '@/hooks/useApi';

const defaultTorchKidsContent: TorchKidsContent = {
    heroTitle: "Welcome to Torch Kids",
    heroSubtitle: "A fun, safe, and engaging environment for your children to grow in their faith.",
    aboutText: "The Torch Kids environment is designed specifically for children, offering a welcoming and safe space filled with activities to foster a disciple-making journey. We engage children in live worship, skit lessons, videos, interactive Biblical learning, and prayer.",
    safetyText: "Your child's safety is our top priority. Our environment is monitored by security cameras, and all our staff members and volunteers undergo thorough background checks before serving.",
    experienceText: "We provide a unique worship experience tailored for elementary students, instilling the love of God in their hearts within our specially themed sanctuary.",
    groupsText: "To ensure the best experience, our program is divided into distinct age groups. This allows us to provide a tailored and age-appropriate environment for every child, from toddlers to pre-teens."
};

const TorchKidsPage: React.FC = () => {
    const { apiClient } = useApi();

    const { data: content } = useQuery<TorchKidsContent>({
        queryKey: ['torchKidsContent'],
        queryFn: () => apiClient('/api/torch-kids', 'GET'),
        initialData: defaultTorchKidsContent,
    });

    return (
        <div className="animate-fadeInUp">
            {/* Hero Section */}
            <section className="relative py-32 text-center overflow-hidden bg-brand-dark">
                <div 
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url('https://res.cloudinary.com/dn2mbmhmi/image/upload/v1755286773/kids_-worship_u6hkul.png')` }}
                >
                    <div className="absolute inset-0 bg-brand-dark/70 backdrop-blur-sm"></div>
                </div>
                <div className="container mx-auto px-4 relative z-10">
                    <h1 className="text-5xl md:text-7xl font-serif font-extrabold tracking-tight text-brand-gold">
                        {content.heroTitle}
                    </h1>
                    <p className="mt-6 max-w-3xl mx-auto text-lg md:text-xl text-brand-text-dark">
                        {content.heroSubtitle}
                    </p>
                </div>
            </section>
            
            {/* Content Sections */}
            <section className="py-24 bg-brand-surface">
                <div className="container mx-auto px-4 max-w-5xl space-y-20">
                    <InfoSection
                        icon={<ICONS.Child className="h-10 w-10 text-brand-gold" />}
                        title="A Place to Flourish"
                        text={content.aboutText}
                    />
                     <InfoSection
                        icon={<ICONS.Shield className="h-10 w-10 text-brand-gold" />}
                        title="Safety is Our Priority"
                        text={content.safetyText}
                        image="https://res.cloudinary.com/dn2mbmhmi/image/upload/v1755498877/torch-kids-2_zrvh8l.png"
                        imagePosition="right"
                    />
                    <InfoSection
                        icon={<ICONS.Heart className="h-10 w-10 text-brand-gold" />}
                        title="A Unique Worship Experience"
                        text={content.experienceText}
                    />
                    <InfoSection
                        icon={<ICONS.Users className="h-10 w-10 text-brand-gold" />}
                        title="Tailored Age Groups"
                        text={content.groupsText}
                        image="https://res.cloudinary.com/dn2mbmhmi/image/upload/v1755286764/groups_lwbuw7.png"
                        imagePosition="right"
                    />
                </div>
            </section>
        </div>
    );
};

interface InfoSectionProps {
    icon: React.ReactNode;
    title: string;
    text: string;
    image?: string;
    imagePosition?: 'left' | 'right';
}

const InfoSection: React.FC<InfoSectionProps> = ({ icon, title, text, image, imagePosition = 'left' }) => {
    return (
        <div className={`grid md:grid-cols-2 gap-12 items-center`}>
            <div className={`space-y-4 ${imagePosition === 'right' ? 'md:order-1' : 'md:order-2'}`}>
                <div className="flex items-center space-x-4">
                    {icon}
                    <h2 className="text-3xl font-serif font-bold text-white">{title}</h2>
                </div>
                <p className="text-brand-text-dark whitespace-pre-wrap leading-relaxed">{text}</p>
            </div>
            <div className={`${imagePosition === 'right' ? 'md:order-2' : 'md:order-1'}`}>
                {image && <img src={image} alt={title} className="rounded-lg shadow-2xl w-full h-auto object-cover" />}
            </div>
        </div>
    );
}

export default TorchKidsPage;
