

import React from 'react';
import * as ReactRouterDOM from 'react-router-dom';
const { Link } = ReactRouterDOM as any;
import { ICONS } from '../constants';
import Button from '../components/ui/Button';

const LeadershipPage: React.FC = () => {
    return (
        <div className="animate-fadeInUp">
            {/* Hero Section */}
            <section className="relative py-32 text-center overflow-hidden bg-brand-surface">
                <div 
                    className="absolute inset-0 opacity-20 animate-aurora"
                    style={{ backgroundImage: `
                        radial-gradient(at 21% 33%, hsl(204.00, 70%, 20%) 0px, transparent 50%),
                        radial-gradient(at 79% 30%, hsl(38.82, 100%, 20%) 0px, transparent 50%)
                    `}}
                ></div>
                <div className="container mx-auto px-4 relative z-10">
                    <h1 className="text-5xl md:text-7xl font-serif font-extrabold tracking-tight text-brand-gold">
                        Our Philosophy of Leadership
                    </h1>
                    <p className="mt-6 max-w-3xl mx-auto text-lg md:text-xl text-brand-text-dark">
                        "The greatest among you shall be your servant." - Matthew 23:11
                    </p>
                </div>
            </section>

            {/* Core Principles Section */}
            <section className="py-24 bg-brand-dark">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16 max-w-3xl mx-auto">
                        <h2 className="text-4xl font-serif font-bold text-white">Guiding Principles</h2>
                        <p className="mt-3 text-brand-text-dark">Our approach to leadership is rooted in biblical truth, with the goal of building up the church and glorifying God.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <PrincipleCard 
                            icon={<ICONS.Heart className="h-8 w-8 text-brand-gold"/>}
                            title="Servant Leadership"
                            description="Following the example of Jesus, our leaders are called to serve, not to be served. They lead with humility, integrity, and a deep love for the people."
                        />
                        <PrincipleCard 
                            icon={<ICONS.Shield className="h-8 w-8 text-brand-gold"/>}
                            title="Biblical Eldership"
                            description="We are led by a team of qualified elders who provide spiritual oversight, teach the Word, and protect the flock from false doctrine."
                        />
                        <PrincipleCard 
                            icon={<ICONS.Users className="h-8 w-8 text-brand-gold"/>}
                            title="Equipping the Saints"
                            description="The primary role of leadership is not to do all the work of ministry, but to equip every member to use their gifts to serve the body of Christ (Ephesians 4:11-12)."
                        />
                    </div>
                </div>
            </section>
            
            {/* Leadership Structure Section */}
            <section className="py-24 bg-brand-surface">
                <div className="container mx-auto px-4 max-w-5xl">
                    <div className="text-center mb-12">
                         <h2 className="text-4xl font-serif font-bold text-white">Our Structure</h2>
                         <p className="mt-3 text-brand-text-dark">A simple structure designed for health and growth.</p>
                    </div>
                    <div className="grid md:grid-cols-2 gap-8 items-center">
                        <div>
                             <img src="https://res.cloudinary.com/dn2mbmhmi/image/upload/v1755273222/Torch-logo_ithw3f.png" alt="Torch Fellowship Logo" className="w-full h-auto max-w-xs mx-auto opacity-10" />
                        </div>
                        <div className="space-y-6">
                            <h3 className="text-2xl font-serif text-white">Christ as the Head</h3>
                            <p className="text-brand-text-dark">Jesus Christ is the ultimate head and Senior Pastor of Torch Fellowship. All leadership is submitted to His authority and guided by His Word and Spirit.</p>
                            <h3 className="text-2xl font-serif text-white mt-4">Team Leadership</h3>
                            <p className="text-brand-text-dark">Our leadership operates in teams. Elders provide overall direction and spiritual care, while Deacons and Ministry Team Leaders oversee specific areas of service, empowering our community to thrive.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 bg-brand-dark">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-4xl font-serif font-bold text-white">Get Involved</h2>
                    <p className="mt-4 text-lg text-brand-text-dark max-w-2xl mx-auto">
                        Leadership at Torch is about service. Learn more about our leaders or find a place to use your own gifts.
                    </p>
                    <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-4">
                        <Button size="lg" variant="primary" as={Link} to="/leaders">Meet Our Leaders</Button>
                        <Button size="lg" variant="secondary" as={Link} to="/serve">Find a Place to Serve</Button>
                    </div>
                </div>
            </section>
        </div>
    );
};

const PrincipleCard: React.FC<{icon: React.ReactNode, title: string, description: string}> = ({ icon, title, description }) => (
    <div className="bg-brand-surface p-8 rounded-lg text-center border border-brand-muted/50 transition-all duration-300 transform hover:-translate-y-2 hover:border-brand-gold/30">
        <div className="inline-block p-4 bg-brand-muted rounded-full mb-4">
            {icon}
        </div>
        <h3 className="text-xl font-serif font-bold text-white">{title}</h3>
        <p className="mt-2 text-brand-text-dark text-sm">{description}</p>
    </div>
);

export default LeadershipPage;