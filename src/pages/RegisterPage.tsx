

import React, { useState } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
const { useNavigate, Navigate, Link } = ReactRouterDOM as any;
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { useAuth } from '../hooks/useAuth';
import { getApiUrl } from '../config/api';

const RegisterPage: React.FC = () => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const { user, login } = useAuth();

    if (user) {
        return <Navigate to="/" replace />;
    }

    const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(getApiUrl('/api/auth/register'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fullName, email, password }),
            });
            
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Registration failed');
            }
            
            // After successful registration, log the user in to set the context
            await login(email, password);
            navigate('/');

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
             <Link to="/" className="absolute top-6 left-6 text-brand-text-dark hover:text-white transition-colors z-10">&larr; Back to Home</Link>
            <div className="relative z-10 max-w-md w-full mx-auto p-8 md:p-10 bg-brand-surface/70 backdrop-blur-lg rounded-2xl shadow-2xl border border-brand-muted/50">
                <div className="text-center mb-8">
                    <img className="h-20 w-auto mx-auto" src="https://res.cloudinary.com/dn2mbmhmi/image/upload/v1755273222/Torch-logo_ithw3f.png" alt="Torch Fellowship" />
                    <h2 className="mt-6 text-3xl font-extrabold font-serif text-white [text-shadow:0_2px_4px_rgba(0,0,0,0.5)]">
                        Create an Account
                    </h2>
                     <p className="mt-2 text-brand-text-dark">Join the community.</p>
                </div>
                <form className="space-y-6" onSubmit={handleRegister}>
                    <Input
                        id="fullName"
                        label="Full Name"
                        name="fullName"
                        type="text"
                        autoComplete="name"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                    />
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
                    <Input
                        id="password"
                        label="Password"
                        name="password"
                        type="password"
                        autoComplete="new-password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    
                    {error && <p className="text-red-500 text-sm text-center bg-red-500/10 p-3 rounded-md">{error}</p>}

                    <div className="pt-2">
                        <Button type="submit" className="w-full" size="lg" isLoading={loading}>
                            Create Account
                        </Button>
                    </div>
                </form>
                 <div className="text-center mt-6">
                    <p className="text-sm text-brand-text-dark">
                        Already have an account?{' '}
                        <Link to="/login" className="font-medium text-brand-gold hover:underline">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;