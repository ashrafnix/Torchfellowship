import React, { useState, useRef, useEffect } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
const { NavLink, Link, useLocation } = ReactRouterDOM as any;
import { useAuth } from '../../hooks/useAuth';
import { ICONS } from '../../constants';

const MobileNavLink: React.FC<{ to: string; children: React.ReactNode; closeMenu: () => void; }> = ({ to, children, closeMenu }) => {
    const activeLinkClass = 'text-brand-gold bg-brand-muted/50 border-l-4 border-brand-gold';
    const inactiveLinkClass = 'text-brand-text hover:bg-brand-muted/30 hover:text-white border-l-4 border-transparent';

    return (
        <NavLink
            to={to}
            onClick={closeMenu}
            className={({ isActive }: { isActive: boolean}) => `block px-4 py-3 text-base font-medium transition-all duration-200 font-sans border rounded-lg ${isActive ? activeLinkClass : inactiveLinkClass} hover:border-brand-muted`}
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
    const [mobileSearchQuery, setMobileSearchQuery] = useState('');
    const [activeSection, setActiveSection] = useState<'main' | 'about' | 'community' | 'getInvolved'>('main');
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

    const closeMobileMenu = () => {
        setMobileMenuOpen(false);
        setMobileSearchQuery('');
        setActiveSection('main');
    };

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
                <div className="md:hidden fixed inset-0 bg-black/95 backdrop-blur-md z-50 animate-fadeIn" role="dialog" aria-modal="true">
                    {/* Mobile Header */}
                    <div className="flex items-center justify-between p-4 border-b border-brand-muted/30">
                        <div className="flex items-center space-x-3">
                            <img className="h-8 w-auto" src="https://res.cloudinary.com/dn2mbmhmi/image/upload/v1755273222/Torch-logo_ithw3f.png" alt="Torch Fellowship" />
                            <span className="text-white text-lg font-serif font-bold">Torch Fellowship</span>
                        </div>
                        <button 
                            onClick={closeMobileMenu} 
                            className="p-2 rounded-full hover:bg-brand-muted/30 transition-colors" 
                            aria-label="Close menu"
                        >
                            <ICONS.X className="h-6 w-6 text-brand-text-dark hover:text-white transition-colors" />
                        </button>
                    </div>

                    {/* User Info Section */}
                    {user && (
                        <div className="p-4 border-b border-brand-muted/30">
                            <div className="flex items-center space-x-3 mb-3">
                                <div className="relative">
                                    {user?.avatarUrl ? (
                                        <img 
                                            src={user.avatarUrl} 
                                            alt="profile" 
                                            className="h-12 w-12 rounded-full object-cover border-2 border-brand-gold/30" 
                                        />
                                    ) : (
                                        <div className="h-12 w-12 bg-gradient-to-br from-brand-gold to-yellow-500 rounded-full flex items-center justify-center">
                                            <span className="text-brand-dark font-bold text-lg">
                                                {user.fullName?.charAt(0).toUpperCase() || 'U'}
                                            </span>
                                        </div>
                                    )}
                                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-black"></div>
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-white font-sans font-semibold">{user.fullName || 'User'}</h3>
                                    <p className="text-brand-text-dark text-sm font-sans">{user.email}</p>
                                    {isAdmin && (
                                        <span className="inline-flex items-center px-2 py-0.5 text-xs font-sans font-medium bg-blue-500/20 text-blue-400 rounded-full border border-blue-500/30 mt-1">
                                            Admin
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="flex space-x-2">
                                <Link 
                                    to="/profile"
                                    onClick={closeMobileMenu}
                                    className="flex-1 flex items-center justify-center px-3 py-2 bg-brand-muted/50 hover:bg-brand-muted rounded-lg text-sm font-sans font-medium text-brand-text-dark hover:text-white transition-all"
                                >
                                    Profile
                                </Link>
                                <button 
                                    onClick={() => { logout(); closeMobileMenu(); }}
                                    className="flex items-center justify-center px-3 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-sm font-sans font-medium text-red-400 hover:text-red-300 transition-all"
                                >
                                    Sign Out
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Search Section */}
                    <div className="p-4 border-b border-brand-muted/30">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search pages..."
                                value={mobileSearchQuery}
                                onChange={(e) => setMobileSearchQuery(e.target.value)}
                                className="w-full px-4 py-3 bg-brand-muted/30 border border-brand-muted rounded-xl text-white placeholder-brand-text-dark focus:outline-none focus:ring-2 focus:ring-brand-gold/50 focus:border-brand-gold transition-all font-sans"
                            />
                            {mobileSearchQuery && (
                                <button
                                    onClick={() => setMobileSearchQuery('')}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-brand-text-dark hover:text-white text-lg"
                                >
                                    ×
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Navigation Content */}
                    <div className="flex-1 overflow-y-auto admin-scroll">
                        {activeSection === 'main' ? (
                            <div className="p-4 space-y-2">
                                {/* Quick Actions */}
                                <div className="mb-6">
                                    <h3 className="text-brand-gold font-serif font-semibold mb-3 text-sm uppercase tracking-wide">Quick Actions</h3>
                                    <div className="grid grid-cols-2 gap-3">
                                        <Link 
                                            to="/prayer"
                                            onClick={closeMobileMenu}
                                            className="flex items-center justify-center p-4 bg-gradient-to-br from-blue-500/20 to-purple-500/20 hover:from-blue-500/30 hover:to-purple-500/30 rounded-xl border border-blue-500/30 transition-all"
                                        >
                                            <span className="text-white text-sm font-sans font-medium">Prayer</span>
                                        </Link>
                                        <Link 
                                            to="/give"
                                            onClick={closeMobileMenu}
                                            className="flex items-center justify-center p-4 bg-gradient-to-br from-green-500/20 to-emerald-500/20 hover:from-green-500/30 hover:to-emerald-500/30 rounded-xl border border-green-500/30 transition-all"
                                        >
                                            <span className="text-white text-sm font-sans font-medium">Give</span>
                                        </Link>
                                    </div>
                                </div>

                                {/* Main Navigation */}
                                <div className="space-y-1">
                                    <MobileNavLink to="/" closeMenu={closeMobileMenu}>Home</MobileNavLink>
                                    <MobileNavLink to="/teachings" closeMenu={closeMobileMenu}>Teachings</MobileNavLink>
                                    
                                    {/* Section Buttons */}
                                    <button
                                        onClick={() => setActiveSection('about')}
                                        className="w-full flex items-center justify-between px-4 py-3 rounded-lg text-base font-sans font-medium text-brand-text hover:bg-brand-muted/50 hover:text-white transition-all duration-200 border border-transparent hover:border-brand-muted"
                                    >
                                        <span>About Us</span>
                                        <span className="text-brand-text-dark text-sm">→</span>
                                    </button>
                                    
                                    <button
                                        onClick={() => setActiveSection('community')}
                                        className="w-full flex items-center justify-between px-4 py-3 rounded-lg text-base font-sans font-medium text-brand-text hover:bg-brand-muted/50 hover:text-white transition-all duration-200 border border-transparent hover:border-brand-muted"
                                    >
                                        <span>Community</span>
                                        <span className="text-brand-text-dark text-sm">→</span>
                                    </button>
                                    
                                    <button
                                        onClick={() => setActiveSection('getInvolved')}
                                        className="w-full flex items-center justify-between px-4 py-3 rounded-lg text-base font-sans font-medium text-brand-text hover:bg-brand-muted/50 hover:text-white transition-all duration-200 border border-transparent hover:border-brand-muted"
                                    >
                                        <span>Get Involved</span>
                                        <span className="text-brand-text-dark text-sm">→</span>
                                    </button>
                                </div>

                                {/* User Actions */}
                                {!user && (
                                    <div className="mt-6 pt-4 border-t border-brand-muted/30">
                                        <MobileNavLink to="/login" closeMenu={closeMobileMenu}>Sign In</MobileNavLink>
                                        <MobileNavLink to="/register" closeMenu={closeMobileMenu}>Register</MobileNavLink>
                                    </div>
                                )}
                                
                                {user && (
                                    <div className="mt-6 pt-4 border-t border-brand-muted/30">
                                        <MobileNavLink to="/chat" closeMenu={closeMobileMenu}>Chat</MobileNavLink>
                                        {isAdmin && <MobileNavLink to="/admin" closeMenu={closeMobileMenu}>Admin Panel</MobileNavLink>}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="p-4">
                                {/* Back Button */}
                                <button
                                    onClick={() => setActiveSection('main')}
                                    className="flex items-center mb-4 text-brand-gold hover:text-white transition-colors"
                                >
                                    <span className="text-sm mr-2">←</span>
                                    <span className="font-sans font-medium">Back to Main</span>
                                </button>

                                {/* Section Content */}
                                {activeSection === 'about' && (
                                    <div className="space-y-1">
                                        <h3 className="text-brand-gold font-semibold mb-3 text-lg font-serif">About Us</h3>
                                        <MobileNavLink to="/about" closeMenu={closeMobileMenu}>About</MobileNavLink>
                                        <MobileNavLink to="/leadership" closeMenu={closeMobileMenu}>Leadership Philosophy</MobileNavLink>
                                        <MobileNavLink to="/leaders" closeMenu={closeMobileMenu}>Our Leaders</MobileNavLink>
                                        <MobileNavLink to="/ministries" closeMenu={closeMobileMenu}>Ministries</MobileNavLink>
                                        <MobileNavLink to="/torch-kids" closeMenu={closeMobileMenu}>Torch Kids</MobileNavLink>
                                    </div>
                                )}

                                {activeSection === 'community' && (
                                    <div className="space-y-1">
                                        <h3 className="text-brand-gold font-semibold mb-3 text-lg font-serif">Community</h3>
                                        <MobileNavLink to="/events" closeMenu={closeMobileMenu}>Events</MobileNavLink>
                                        <MobileNavLink to="/blog" closeMenu={closeMobileMenu}>Blog</MobileNavLink>
                                        <MobileNavLink to="/prayer" closeMenu={closeMobileMenu}>Prayer</MobileNavLink>
                                        <MobileNavLink to="/light-campuses" closeMenu={closeMobileMenu}>Light Campuses</MobileNavLink>
                                        <MobileNavLink to="/testimonies" closeMenu={closeMobileMenu}>Testimonies</MobileNavLink>
                                    </div>
                                )}

                                {activeSection === 'getInvolved' && (
                                    <div className="space-y-1">
                                        <h3 className="text-brand-gold font-semibold mb-3 text-lg font-serif">Get Involved</h3>
                                        <MobileNavLink to="/serve" closeMenu={closeMobileMenu}>Serve</MobileNavLink>
                                        <MobileNavLink to="/give" closeMenu={closeMobileMenu}>Give</MobileNavLink>
                                        <MobileNavLink to="/contact" closeMenu={closeMobileMenu}>Contact</MobileNavLink>
                                        <MobileNavLink to="/new-converts" closeMenu={closeMobileMenu}>New Converts</MobileNavLink>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="p-4 border-t border-brand-muted/30">
                        <div className="text-center text-brand-text-dark text-sm font-sans">
                            <p>© 2024 Torch Fellowship</p>
                            <p className="text-xs mt-1">Spreading light & love</p>
                        </div>
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