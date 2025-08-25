import React, { useState } from 'react';
import Button from '../components/ui/Button';
import { ICONS } from '../constants';

const GivePage: React.FC = () => {
    const [selectedAmount, setSelectedAmount] = useState<number | string>(25000);
    const [customAmount, setCustomAmount] = useState('');

    const presetAmounts = [10000, 25000, 50000, 100000, 250000, 500000];

    const handlePresetSelect = (amount: number) => {
        setSelectedAmount(amount);
        setCustomAmount('');
    };

    const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/,/g, '');
        if (/^\d*$/.test(value)) {
            setCustomAmount(value);
            setSelectedAmount('custom');
        }
    };
    
    const displayAmount = selectedAmount === 'custom' ? (Number(customAmount) || 0) : selectedAmount;

    return (
        <div className="animate-fadeInUp">
            <section className="relative py-32 text-center overflow-hidden bg-brand-dark">
                <div 
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url('https://res.cloudinary.com/dn2mbmhmi/image/upload/v1755273116/Give_abwfjj.png')` }}
                >
                </div>
                <div className="container mx-auto px-4 relative z-10">
                    <h1 className="text-5xl md:text-6xl font-serif font-extrabold tracking-tight text-brand-gold drop-shadow-lg">
                        Give
                    </h1>
                    <p className="mt-6 max-w-3xl mx-auto text-lg md:text-xl text-white drop-shadow-md">
                        "Each of you should give what you have decided in your heart to give, not reluctantly or under compulsion, for God loves a cheerful giver." - 2 Corinthians 9:7
                    </p>
                </div>
            </section>

            <div className="py-16 md:py-24 bg-brand-dark">
                <div className="container mx-auto px-4">
                    <div className="grid lg:grid-cols-5 gap-12">
                        <div className="lg:col-span-2 space-y-8">
                            <h2 className="text-3xl font-serif font-bold text-white">Why We Give</h2>
                            <div className="space-y-6">
                            <Reason title="Ministry Operations" description="Support our services, community programs, and operational needs." />
                            <Reason title="Community Outreach" description="Help those in need through charity, support, and local initiatives." />
                            <Reason title="Global Missions" description="Support missionaries and the planting of churches worldwide." />
                            </div>
                        </div>

                        <div className="lg:col-span-3 bg-brand-surface p-8 rounded-lg border border-brand-muted/50">
                            <h2 className="text-3xl font-serif font-bold text-white mb-6">Make a Donation</h2>
                            <div className="space-y-6">
                                <div>
                                    <label className="text-sm font-medium text-brand-text-dark">Select Amount (UGX)</label>
                                    <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-3">
                                        {presetAmounts.map(amount => (
                                            <button 
                                                key={amount} 
                                                onClick={() => handlePresetSelect(amount)}
                                                className={`px-4 py-3 rounded-md text-center font-semibold transition-all duration-200 ${selectedAmount === amount ? 'bg-brand-gold text-brand-dark ring-2 ring-brand-gold' : 'bg-brand-muted text-brand-text hover:bg-opacity-75'}`}
                                            >
                                                {amount.toLocaleString()}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <input
                                        type="text"
                                        value={customAmount ? Number(customAmount).toLocaleString() : ''}
                                        onChange={handleCustomAmountChange}
                                        onClick={() => setSelectedAmount('custom')}
                                        placeholder="Or Enter Custom Amount"
                                        className={`w-full bg-brand-muted border rounded-md p-4 text-brand-text placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-brand-gold transition-all ${selectedAmount === 'custom' ? 'ring-2 ring-brand-gold border-brand-gold' : 'border-transparent focus:ring-brand-gold'}`}
                                    />
                                </div>
                                <div className="space-y-4">
                                    <input type="text" placeholder="Full Name" className="w-full bg-brand-muted border border-transparent rounded-md p-4 text-brand-text placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-gold"/>
                                    <input type="email" placeholder="Email Address" className="w-full bg-brand-muted border border-transparent rounded-md p-4 text-brand-text placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-gold"/>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-white">Payment Method</h3>
                                    <div className="mt-2 flex gap-4">
                                        <Button variant="secondary" className="flex-1">MTN Mobile Money</Button>
                                        <Button variant="secondary" className="flex-1">Airtel Money</Button>
                                    </div>
                                </div>
                                <div className="pt-4">
                                    <Button size="lg" className="w-full">Donate UGX {displayAmount.toLocaleString()}</Button>
                                    <p className="text-xs text-center text-brand-text-dark mt-4">Your donation is secure and encrypted.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Reason: React.FC<{title: string, description: string}> = ({ title, description }) => (
    <div className="flex items-start space-x-4">
        <div className="flex-shrink-0 bg-brand-gold/10 text-brand-gold p-2 rounded-full">
            <ICONS.CheckCircle className="h-5 w-5" />
        </div>
        <div>
            <h3 className="font-semibold text-white">{title}</h3>
            <p className="text-brand-text-dark text-sm">{description}</p>
        </div>
    </div>
);


export default GivePage;