
import React from 'react';
import * as ReactRouterDOM from 'react-router-dom';
const { Link } = ReactRouterDOM as any;
import Button from '../ui/Button';
import Input from '../ui/Input';

const Footer: React.FC = () => {
    return (
        <footer className="bg-brand-dark border-t border-brand-surface/50 mt-24">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    {/* Column 1: About */}
                    <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                           <img className="h-12 w-auto" src="https://res.cloudinary.com/dn2mbmhmi/image/upload/v1755273222/Torch-logo_ithw3f.png" alt="Torch Fellowship" />
                            <span className="text-white text-2xl font-serif font-bold">Torch Fellowship</span>
                        </div>
                        <p className="text-brand-text-dark text-sm">
                            Igniting hearts, transforming lives, and building communities through the love of Christ.
                        </p>
                    </div>

                    {/* Column 2: Quick Links */}
                    <div>
                        <h3 className="text-lg font-serif font-bold text-white">QUICK LINKS</h3>
                        <ul className="mt-4 space-y-2 text-sm">
                            <li><Link to="/about" className="text-brand-text-dark hover:text-brand-gold transition-colors">About Us</Link></li>
                            <li><Link to="/leadership" className="text-brand-text-dark hover:text-brand-gold transition-colors">Leadership</Link></li>
                            <li><Link to="/light-campuses" className="text-brand-text-dark hover:text-brand-gold transition-colors">Light Campuses</Link></li>
                            <li><Link to="/blog" className="text-brand-text-dark hover:text-brand-gold transition-colors">Blog</Link></li>
                            <li><Link to="/teachings" className="text-brand-text-dark hover:text-brand-gold transition-colors">Teachings</Link></li>
                            <li><Link to="/events" className="text-brand-text-dark hover:text-brand-gold transition-colors">Events</Link></li>
                            <li><Link to="/prayer" className="text-brand-text-dark hover:text-brand-gold transition-colors">Prayer Wall</Link></li>
                            <li><Link to="/testimonies" className="text-brand-text-dark hover:text-brand-gold transition-colors">Testimonies</Link></li>
                            <li><Link to="/ministries" className="text-brand-text-dark hover:text-brand-gold transition-colors">Ministries</Link></li>
                            <li><Link to="/serve" className="text-brand-text-dark hover:text-brand-gold transition-colors">Serve</Link></li>
                            <li><Link to="/give" className="text-brand-text-dark hover:text-brand-gold transition-colors">Give</Link></li>
                            <li><Link to="/contact" className="text-brand-text-dark hover:text-brand-gold transition-colors">Contact</Link></li>
                        </ul>
                    </div>

                    {/* Column 3: Contact Us */}
                     <div>
                        <h3 className="text-lg font-serif font-bold text-white">CONTACT US</h3>
                        <address className="mt-4 space-y-3 text-sm text-brand-text-dark not-italic">
                            <p>Light Grounds, Mutundwe, Uganda</p>
                            <p><a href="mailto:torchfellowship@gmail.com" className="hover:text-brand-gold transition-colors">torchfellowship@gmail.com</a></p>
                            <p><a href="tel:+256778436768" className="hover:text-brand-gold transition-colors">+256 (778) 436-768</a></p>
                        </address>
                    </div>

                    {/* Column 4: Newsletter */}
                    <div>
                        <h3 className="text-lg font-serif font-bold text-white">NEWSLETTER</h3>
                        <p className="mt-4 text-sm text-brand-text-dark">Subscribe for updates and spiritual insights.</p>
                        <form className="mt-4 flex flex-col sm:flex-row gap-2">
                            <Input label="Email" type="email" required className="flex-grow"/>
                            <Button type="submit" variant="primary" size="md" className="flex-shrink-0 h-[58px]">Subscribe</Button>
                        </form>
                    </div>
                </div>

                <div className="mt-16 pt-8 border-t border-brand-surface/50 text-center text-brand-text-dark text-sm">
                    <p>&copy; {new Date().getFullYear()} Torch Fellowship. All Rights Reserved. A new thing is happening.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;