import React, { useState } from 'react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { ICONS } from '../constants';
import { useMutation } from '@tanstack/react-query';
import { useApi } from '../hooks/useApi';
import { toast } from 'react-toastify';

const NewConvertsPage: React.FC = () => {
    const { apiClient } = useApi();

    const mutation = useMutation({
        mutationFn: (newConvert: any) => apiClient('/api/new-converts', 'POST', newConvert),
        onSuccess: () => {
            toast.success("Welcome to the family! We're excited to walk with you.");
        },
        onError: (error: Error) => {
            toast.error(`Submission failed: ${error.message}`);
        }
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());
        mutation.mutate(data, {
            onSuccess: () => {
                (e.target as HTMLFormElement).reset();
            }
        });
    }

  return (
    <div className="py-16 md:py-24 bg-brand-dark">
        <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto bg-brand-surface p-8 rounded-lg border border-brand-muted/50">
                <div className="text-center mb-8">
                    <img className="h-20 w-auto mx-auto" src="https://res.cloudinary.com/dn2mbmhmi/image/upload/v1755273222/Torch-logo_ithw3f.png" alt="Torch Fellowship" />
                    <h1 className="text-4xl font-serif font-bold text-brand-gold mt-4">Torch Fellowship International</h1>
                    <p className="text-lg text-brand-text-dark mt-2">New Converts Who Have Just Got Born Again Through Torch Fellowship</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-6">
                        <Input label="First Name" name="firstName" required />
                        <Input label="Last Name" name="lastName" required />
                    </div>
                    <div className="grid sm:grid-cols-2 gap-6">
                        <Input label="Area Code" name="areaCode" required />
                        <Input label="Phone Number" name="phoneNumber" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-brand-text-dark mb-1">Is your number registered on WhatsApp?</label>
                        <div className="flex items-center space-x-4">
                            <label><input type="radio" name="whatsApp" value="yes" className="mr-2" />Yes</label>
                            <label><input type="radio" name="whatsApp" value="no" className="mr-2" />No</label>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-brand-text-dark mb-1">If yes, would you consider being added to the ministry WhatsApp group?</label>
                        <div className="flex items-center space-x-4">
                            <label><input type="radio" name="whatsAppGroup" value="yes" className="mr-2" />Yes</label>
                            <label><input type="radio" name="whatsAppGroup" value="no" className="mr-2" />No</label>
                        </div>
                    </div>
                    <Input label="Email" name="email" type="email" required />
                    <Input label="Country" name="country" required />
                    <div>
                        <label className="block text-sm font-medium text-brand-text-dark mb-1">Choose Community</label>
                        <div className="flex items-center space-x-4">
                            <label><input type="checkbox" name="community" value="pheggos" className="mr-2" />PHEGGOS</label>
                            <label><input type="checkbox" name="community" value="lychnos" className="mr-2" />LYCHNOS</label>
                            <label><input type="checkbox" name="community" value="phos" className="mr-2" />PHOS</label>
                        </div>
                    </div>
                    <div>
                        <p className="text-sm text-brand-text-dark">Torch Fellowship International would like to hold and use your information for follow up and communication purposes.</p>
                        <div className="flex items-center space-x-4 mt-2">
                            <label><input type="radio" name="agree" value="yes" className="mr-2" />I AGREE with the Torch International fellowship for holding and using my information for the above purpose.</label>
                        </div>
                    </div>
                    <div className="text-center">
                        <p className="text-lg text-brand-text-dark">Welcome to the new family of Jesus Christ. We love you and we are ready to walk this journey with you.</p>
                        <p className="text-lg text-brand-text-dark mt-2">Ap. Davin Ssentongo.</p>
                    </div>
                    <Button type="submit" isLoading={mutation.isPending} className="w-full" size="lg">Submit</Button>
                </form>
            </div>
        </div>
    </div>
  );
};

export default NewConvertsPage;