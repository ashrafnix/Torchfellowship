import React from 'react';
import Button from '../components/ui/Button.tsx';
import Input from '../components/ui/Input.tsx';
import { ICONS } from '../constants.tsx';
import { useMutation } from '@tanstack/react-query';
import { useApi } from '../hooks/useApi.ts';
import { toast } from 'react-toastify';

const ContactPage: React.FC = () => {
    const { apiClient } = useApi();

    const mutation = useMutation({
        mutationFn: (newMessage: { name: string; email: string; subject: string; message: string; }) => 
            apiClient('/api/contact-messages', 'POST', newMessage),
        onSuccess: () => {
            toast.success("Message sent successfully! We'll be in touch soon.");
        },
        onError: (error: Error) => {
            toast.error(`Failed to send message: ${error.message}`);
        }
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries()) as { name: string; email: string; subject: string; message: string; };
        mutation.mutate(data, {
            onSuccess: () => {
                (e.target as HTMLFormElement).reset();
            }
        });
    }

  return (
    <div className="py-16 md:py-24">
        <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto">
                <h1 className="text-5xl md:text-6xl font-serif font-bold text-brand-gold">Contact Us</h1>
                <p className="mt-4 text-lg text-brand-text-dark">
                    We'd love to hear from you. Whether it's a question about our fellowship or a testimony, please don't hesitate to reach out.
                </p>
            </div>

            <div className="mt-16 grid lg:grid-cols-2 gap-12">
                <div className="bg-brand-surface p-8 rounded-lg border border-brand-muted/50">
                    <h2 className="text-3xl font-serif font-bold text-white mb-6">Send us a Message</h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid sm:grid-cols-2 gap-6">
                            <Input label="Your Name" name="name" required />
                            <Input label="Your Email" name="email" type="email" required />
                        </div>
                        <Input label="Subject" name="subject" required />
                        <div>
                             <textarea
                                name="message"
                                rows={6}
                                required
                                placeholder="Your Message"
                                className="w-full bg-brand-muted border border-transparent rounded-md p-4 text-brand-text placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-gold"
                            />
                        </div>
                        <Button type="submit" isLoading={mutation.isPending} className="w-full" size="lg">Send Message</Button>
                    </form>
                </div>

                <div className="space-y-8">
                    <div className="bg-brand-surface p-8 rounded-lg border border-brand-muted/50">
                        <h3 className="text-2xl font-serif font-bold text-white">Get in Touch</h3>
                         <address className="mt-4 space-y-4 text-brand-text-dark not-italic">
                            <p className="flex items-start"><strong className="w-20 text-brand-gold">Address:</strong><span>Light Grounds, Mutundwe, Uganda</span></p>
                            <p className="flex items-start"><strong className="w-20 text-brand-gold">Email:</strong><a href="mailto:torchfellowship@gmail.com" className="hover:text-brand-gold">torchfellowship@gmail.com</a></p>
                            <p className="flex items-start"><strong className="w-20 text-brand-gold">Phone:</strong><a href="tel:+256778436768" className="hover:text-brand-gold">+256 (778) 436-768</a></p>
                        </address>
                    </div>
                     <div className="bg-brand-surface p-8 rounded-lg border border-brand-muted/50">
                        <h3 className="text-2xl font-serif font-bold text-white">Service Times</h3>
                        <p className="mt-2 text-brand-text-dark">Join us for a powerful time of worship and the word.</p>
                         <div className="mt-4 font-semibold text-white">
                            <p>Tuesday Service: <span className="text-brand-gold">05:00 PM - 08:00 PM</span></p>
                         </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};

export default ContactPage;
