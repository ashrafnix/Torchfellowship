import React, { useState, useRef, useEffect } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
const { NavLink, Link, useLocation } = ReactRouterDOM as any;
import { useAuth } from '../../hooks/useAuth';
import { ICONS } from '../../constants';

const MobileNavLink: React.FC<{ to: string; children: React.ReactNode; closeMenu: () => void; }> = ({ to, children, closeMenu }) => {
    const activeLinkClass = 'text-brand-gold bg-brand-muted';
    const inactiveLinkClass = 'text-brand-text hover:bg-brand-muted';

    return (
        <NavLink
            to={to}
            onClick={closeMenu}
            className={({ isActive }: { isActive: boolean}) => `block px-4 py-3 rounded-md text-lg font-medium transition-colors duration-200 ${isActive ? activeLinkClass : inactiveLinkClass}`}
        >
            {children}
        </NavLink>
    );
};

// New Dropdown Component
interface DropdownLink {
    to: string;
    text: string;
}

interface DropdownProps {
    title: string;
    links: DropdownLink[];
}

const Dropdown: React.FC<DropdownProps> = ({ title, links }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const location = useLocation();

    const activeLinkClass = 'text-brand-gold';
    const inactiveLinkClass = 'text-brand-text-dark hover:text-brand-gold';
    const linkClasses = `px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 relative after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:w-0 after:h-0.5 after:bg-brand-gold after:transition-all after:duration-300 hover:after:w-1/2 hover:after:left-1/4`;

    const isRouteActive = links.some(link => location.pathname === link.to);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(prev => !prev)}
                className={`${linkClasses} ${isRouteActive ? activeLinkClass + " after:w-1/2 after:left-1/4" : inactiveLinkClass} flex items-center`}
            >
                {title}
                <ICONS.ChevronDown className={`ml-1 h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <div className="origin-top-right absolute left-0 mt-2 w-56 rounded-md shadow-lg py-1 bg-brand-surface ring-1 ring-black ring-opacity-5 focus:outline-none z-10 animate-fadeInDropdown">
                    {links.map(link => (
                        <Link key={link.to} to={link.to} onClick={() => setIsOpen(false)} className="block px-4 py-2 text-sm text-brand-text-dark hover:bg-brand-muted hover:text-white w-full text-left">
                            {link.text}
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

const Header: React.FC = () => {
    const { user, logout, isAdmin } = useAuth();
    const [isProfileOpen, setProfileOpen] = useState(false);
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
    const profileRef = useRef<HTMLDivElement>(null);

    const activeLinkClass = 'text-brand-gold';
    const inactiveLinkClass = 'text-brand-text-dark hover:text-brand-gold';
    const linkClasses = `px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 relative after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:w-0 after:h-0.5 after:bg-brand-gold after:transition-all after:duration-300 hover:after:w-1/2 hover:after:left-1/4`;

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
                setProfileOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [profileRef]);

    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isMobileMenuOpen]);

    const closeMobileMenu = () => setMobileMenuOpen(false);

    return (
        <>
            <header className="bg-brand-dark/60 backdrop-blur-xl sticky top-0 z-40 border-b border-brand-surface/50">
                <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20">
                        <Link to="/" className="flex-shrink-0 flex items-center space-x-3" onClick={() => { closeMobileMenu(); }}>
                            <img className="h-12 w-auto" src="https://res.cloudinary.com/dn2mbmhmi/image/upload/v1755273222/Torch-logo_ithw3f.png" alt="Torch Fellowship" />
                            <span className="text-white text-2xl font-serif font-bold">Torch Fellowship</span>
                        </Link>
                        
                        <div className="hidden md:flex items-center space-x-1">
                            <NavLink to="/" className={({ isActive }: { isActive: boolean}) => `${linkClasses} ${isActive ? activeLinkClass + " after:w-1/2 after:left-1/4" : inactiveLinkClass}`} end>Home</NavLink>
                            <Dropdown title="About Us" links={[
                                { to: "/about", text: "About" },
                                { to: "/leadership", text: "Leadership" },
                                { to: "/leaders", text: "Our Leaders" },
                                { to: "/ministries", text: "Ministries" },
                                { to: "/torch-kids", text: "Torch Kids" },
                            ]} />
                            <NavLink to="/teachings" className={({ isActive }: { isActive: boolean}) => `${linkClasses} ${isActive ? activeLinkClass + " after:w-1/2 after:left-1/4" : inactiveLinkClass}`}>Teachings</NavLink>
                            <Dropdown title="Community" links={[
                                { to: "/events", text: "Events" },
                                { to: "/blog", text: "Blog" },
                                { to: "/prayer", text: "Prayer" },
                                { to: "/light-campuses", text: "Light Campuses" },
                                { to: "/testimonies", text: "Testimonies" },
                            ]} />
                            <Dropdown title="Get Involved" links={[
                                { to: "/serve", text: "Serve" },
                                { to: "/give", text: "Give" },
                                { to: "/contact", text: "Contact" },
                                { to: "/new-converts", text: "New Converts" },
                            ]} />
                        </div>

                        <div className="flex items-center space-x-4">
                            <div className="relative" ref={profileRef}>
                                <button onClick={() => setProfileOpen(!isProfileOpen)} className="p-1.5 bg-brand-surface rounded-full text-brand-text-dark hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-dark focus:ring-brand-gold">
                                    <span className="sr-only">View profile</span>
                                    {user?.avatarUrl ? <img src={user.avatarUrl} alt="profile" className="h-7 w-7 rounded-full object-cover" /> : <ICONS.User className="h-7 w-7"/>}
                                </button>
                                {isProfileOpen && (
                                    <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg py-1 bg-brand-surface ring-1 ring-black ring-opacity-5 focus:outline-none animate-fadeInDropdown">
                                        {user ? (
                                            <>
                                                <div className="px-4 py-3 border-b border-brand-muted">
                                                    <p className="text-sm font-semibold text-white truncate">{user.fullName || 'User'}</p>
                                                    <p className="text-xs text-brand-text-dark truncate">{user.email}</p>
                                                </div>
                                                <Link to="/profile" onClick={() => setProfileOpen(false)} className="flex items-center px-4 py-2 text-sm text-brand-text-dark hover:bg-brand-muted hover:text-white w-full text-left"><ICONS.User className="mr-3 h-5 w-5" /> Profile</Link>
                                                {isAdmin && (
                                                    <Link to="/admin" onClick={() => setProfileOpen(false)} className="flex items-center px-4 py-2 text-sm text-brand-text-dark hover:bg-brand-muted hover:text-white w-full text-left"><ICONS.Settings className="mr-3 h-5 w-5" /> Admin Panel</Link>
                                                )}
                                                {user && (
                                                    <Link to="/chat" onClick={() => setProfileOpen(false)} className="flex items-center px-4 py-2 text-sm text-brand-text-dark hover:bg-brand-muted hover:text-white w-full text-left"><ICONS.MessageSquare className="mr-3 h-5 w-5" /> Chat</Link>
                                                )}
                                                <button onClick={() => { logout(); setProfileOpen(false); }} className="flex items-center px-4 py-2 text-sm text-brand-text-dark hover:bg-brand-muted hover:text-white w-full text-left"><ICONS.LogOut className="mr-3 h-5 w-5" /> Sign Out</button>
                                            </>
                                        ) : (
                                            <Link to="/login" onClick={() => setProfileOpen(false)} className="block px-4 py-2 text-sm text-brand-text-dark hover:bg-brand-muted hover:text-white w-full text-left">Sign In</Link>
                                        )}
                                    </div>
                                )}
                            </div>
                            
                            <div className="md:hidden">
                                <button
                                    onClick={() => setMobileMenuOpen(true)}
                                    className="p-2 bg-brand-surface rounded-md text-brand-text-dark hover:text-white focus:outline-none"
                                    aria-label="Open menu"
                                >
                                    <ICONS.Menu className="h-6 w-6" />
                                </button>
                            </div>
                        </div>
                    </div>
                </nav>
            </header>

            {isMobileMenuOpen && (
                <div className="md:hidden fixed inset-0 bg-brand-dark z-50 animate-fadeIn" role="dialog" aria-modal="true">
                    <div className="absolute top-5 right-4">
                        <button onClick={closeMobileMenu} className="p-2" aria-label="Close menu"><ICONS.X className="h-8 w-8 text-brand-text-dark" /></button>
                    </div>
                    <div className="pt-24 pb-8 px-6 h-full overflow-y-auto admin-scroll">
                        <nav className="flex flex-col space-y-2">
                            <MobileNavLink to="/" closeMenu={closeMobileMenu}>Home</MobileNavLink>
                            <MobileNavLink to="/about" closeMenu={closeMobileMenu}>About Us</MobileNavLink>
                            <MobileNavLink to="/teachings" closeMenu={closeMobileMenu}>Teachings</MobileNavLink>
                            <MobileNavLink to="/events" closeMenu={closeMobileMenu}>Events</MobileNavLink>
                            <MobileNavLink to="/blog" closeMenu={closeMobileMenu}>Blog</MobileNavLink>
                            <MobileNavLink to="/leadership" closeMenu={closeMobileMenu}>Leadership Philosophy</MobileNavLink>
                            <MobileNavLink to="/leaders" closeMenu={closeMobileMenu}>Our Leaders</MobileNavLink>
                            <MobileNavLink to="/prayer" closeMenu={closeMobileMenu}>Prayer</MobileNavLink>
                            <MobileNavLink to="/light-campuses" closeMenu={closeMobileMenu}>Light Campuses</MobileNavLink>
                            <MobileNavLink to="/testimonies" closeMenu={closeMobileMenu}>Testimonies</MobileNavLink>
                            <MobileNavLink to="/ministries" closeMenu={closeMobileMenu}>Ministries</MobileNavLink>
                            <MobileNavLink to="/torch-kids" closeMenu={closeMobileMenu}>Torch Kids</MobileNavLink>
                            <MobileNavLink to="/serve" closeMenu={closeMobileMenu}>Serve</MobileNavLink>
                            <MobileNavLink to="/give" closeMenu={closeMobileMenu}>Give</MobileNavLink>
                            <MobileNavLink to="/contact" closeMenu={closeMobileMenu}>Contact</MobileNavLink>
                            
                            <div className="border-t border-brand-muted my-4 !mt-6"></div>

                            {user && (
                                <>
                                    <MobileNavLink to="/chat" closeMenu={closeMobileMenu}>Chat</MobileNavLink>
                                    {isAdmin && <MobileNavLink to="/admin" closeMenu={closeMobileMenu}>Admin Panel</MobileNavLink>}
                                </>
                            )}
                        </nav>
                    </div>
                </div>
            )}
            <style>{`
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                .animate-fadeIn { animation: fadeIn 0.2s ease-out forwards; }
                @keyframes fadeInDropdown {
                  from { opacity: 0; transform: translateY(-10px); }
                  to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeInDropdown { animation: fadeInDropdown 0.2s ease-out forwards; }
            `}</style>
        </>
    );
};

export default Header;