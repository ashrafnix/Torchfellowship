'use client'

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useAuth } from '@/hooks/useAuth';
import { ICONS } from '@/src/constants';

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const searchParams = useSearchParams();
    const { user, login } = useAuth();
    
    const from = searchParams.get('from') || '/admin';

    React.useEffect(() => {
        if (user) router.replace(from);
    }, [user, router, from]);

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (loading) return; // prevent double-submit
        setLoading(true);
        setError(null);
        try {
            await login(email, password);
            router.replace(from);
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen relative flex flex-col items-center justify-center p-4 overflow-hidden">
             <div 
                className="absolute inset-0 animate-aurora z-0"
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
             <Link href="/" className="absolute top-6 left-6 text-brand-text-dark hover:text-white transition-colors z-10">&larr; Back to Home</Link>
            <div className="relative z-10 max-w-md w-full mx-auto p-8 md:p-10 bg-brand-surface/70 backdrop-blur-lg rounded-2xl shadow-2xl border border-brand-muted/50">
                <div className="text-center mb-8">
                    <img className="h-20 w-auto mx-auto" src="https://res.cloudinary.com/dn2mbmhmi/image/upload/v1755273222/Torch-logo_ithw3f.png" alt="Torch Fellowship" />
                    <h2 className="mt-6 text-3xl font-extrabold font-serif text-white [text-shadow:0_2px_4px_rgba(0,0,0,0.5)]">
                        Sign In
                    </h2>
                     <p className="mt-2 text-brand-text-dark">Access your account or the admin dashboard.</p>
                </div>
                <form className="space-y-6" onSubmit={handleLogin}>
                    <Input
                        id="email"
                        label="Email address"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <div className="relative">
                        <Input
                            id="password"
                            label="Password"
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            autoComplete="current-password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(v => !v)}
                            className="absolute right-3 top-9 text-gray-400 hover:text-white transition-colors"
                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                        >
                            {showPassword
                                ? <ICONS.EyeOff className="h-5 w-5" />
                                : <ICONS.Eye className="h-5 w-5" />
                            }
                        </button>
                    </div>
                    
                    {error && (
                        <div className="flex items-start gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 p-3 rounded-lg">
                            <ICONS.AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    <div className="pt-2">
                        <Button type="submit" className="w-full" size="lg" isLoading={loading} disabled={loading}>
                            {loading ? 'Signing in…' : 'Sign In'}
                        </Button>
                    </div>
                </form>

                <div className="text-center mt-6">
                    <p className="text-sm text-brand-text-dark">
                        Don't have an account?{' '}
                        <Link href="/register" className="font-medium text-brand-gold hover:underline">
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
