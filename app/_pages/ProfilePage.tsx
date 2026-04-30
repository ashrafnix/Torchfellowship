'use client'

import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { ICONS } from '@/src/constants';
import { uploadImage } from '@/services/uploadService';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { getApiUrl } from '@/lib/api';

const ProfilePage: React.FC = () => {
  const { user, reloadUser } = useAuth();
  
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [avatarPreview, setAvatarPreview] = useState<string | null>(user?.avatarUrl || null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const mutation = useMutation({
      mutationFn: async (payload: { fullName: string; avatarUrl: string | null; }) => {
        const response = await fetch(getApiUrl('/api/profile/me'), {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(payload)
        });
        if (!response.ok) {
             const errorData = await response.json();
            throw new Error(errorData.message || "Failed to update profile");
        }
        return response.json();
      },
      onSuccess: async () => {
          await reloadUser();
          toast.success('Profile updated successfully!');
          setAvatarFile(null);
      },
      onError: (error: Error) => {
          toast.error(`Update failed: ${error.message}`);
      }
  });

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        toast.error('Image file is too large. Please use a file under 2MB.');
        return;
      }
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    let finalAvatarUrl = user?.avatarUrl || null;

    if (avatarFile) {
        try {
            finalAvatarUrl = await uploadImage(avatarFile, 'avatars');
        } catch (uploadError) {
            toast.error((uploadError as Error).message);
            return;
        }
    }
    
    mutation.mutate({ fullName, avatarUrl: finalAvatarUrl });
  };

  if (!user) {
    return null; // or a loading/error state
  }

  return (
    <div className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto bg-brand-surface p-8 rounded-lg border border-brand-muted/50">
          <h1 className="text-4xl font-serif font-bold text-brand-gold text-center">My Profile</h1>
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <img
                  src={avatarPreview || `https://ui-avatars.com/api/?name=${user.fullName || user.email}&background=2B2F36&color=EAEAEA&size=128`}
                  alt="Profile"
                  className="h-24 w-24 rounded-full object-cover border-2 border-brand-muted"
                />
                 <label htmlFor="avatar-upload" className="absolute -bottom-1 -right-1 bg-brand-gold text-brand-dark p-1.5 rounded-full cursor-pointer hover:bg-brand-gold-dark transition-colors">
                    <ICONS.Edit className="w-4 h-4" />
                    <input id="avatar-upload" type="file" className="sr-only" accept="image/png, image/jpeg" onChange={handleAvatarChange} aria-label="Upload new profile picture" />
                </label>
              </div>
              <div className="flex-grow">
                 <p className="text-2xl font-bold text-white">{user.fullName}</p>
                 <p className="text-md text-brand-text-dark">{user.email}</p>
                 <span className="mt-1 inline-block px-2 py-1 text-xs font-semibold rounded-full bg-brand-gold/20 text-brand-gold">
                    {user.role}
                 </span>
              </div>
            </div>
            
            <Input
              label="Full Name"
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />

            <div className="pt-2">
              <Button type="submit" isLoading={mutation.isPending} className="w-full" size="lg">
                Save Changes
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
