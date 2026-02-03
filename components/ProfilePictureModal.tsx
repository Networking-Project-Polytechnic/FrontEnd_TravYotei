// components/ProfilePictureModal.tsx
'use client';

import { cloudinaryConfig } from '@/lib/cloudinary';
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { FaUser, FaCloudUploadAlt } from 'react-icons/fa';
import { updateProfileImage } from '@/lib/api';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';

interface ProfilePictureModalProps {
    isOpen: boolean;
    onClose: () => void;
    onComplete: () => void;
}

export default function ProfilePictureModal({ isOpen, onClose, onComplete }: ProfilePictureModalProps) {
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { refreshProfile: authRefreshProfile } = useAuth();

    // Reset state when modal opens/closes
    useEffect(() => {
        if (!isOpen) {
            setImageUrl(null);
            setUploading(false);
            setLoading(false);
        }
    }, [isOpen]);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validation
        if (file.size > 5 * 1024 * 1024) {
            toast.error('File is too large. Max size is 5MB.');
            return;
        }

        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
        if (!allowedTypes.includes(file.type)) {
            toast.error('Invalid file type. Please upload an image.');
            return;
        }

        await uploadToCloudinary(file);
    };

    const uploadToCloudinary = async (file: File) => {
        if (!cloudinaryConfig.cloudName || !cloudinaryConfig.uploadPreset) {
            toast.error('Upload configuration missing. Please contact support.');
            console.error('Missing Cloudinary config:', cloudinaryConfig);
            return;
        }

        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', cloudinaryConfig.uploadPreset);

        try {
            const response = await axios.post(
                `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/image/upload`,
                formData,
                {
                    headers: { 'Content-Type': 'multipart/form-data' },
                    onUploadProgress: (progressEvent) => {
                        const percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent.total || file.size));
                        console.log(`Upload progress: ${percentCompleted}%`);
                    },
                }
            );

            if (response.data.secure_url) {
                setImageUrl(response.data.secure_url);
                toast.success('Image uploaded successfully! Click "Continue" to save.');
            } else {
                throw new Error('No secure_url in response');
            }
        } catch (error: any) {
            console.error('Cloudinary upload error:', error);
            toast.error('Failed to upload image. Please try again.');
        } finally {
            setUploading(false);
            // Clear input so same file can be selected again if needed
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleSave = async () => {
        if (!imageUrl) return;

        setLoading(true);
        try {
            // Update profile image using JWT-protected endpoint
            await updateProfileImage(imageUrl);
            toast.success('Profile picture updated!');

            // Refresh user data from backend
            await authRefreshProfile();

            onComplete();
        } catch (error: any) {
            console.error('Error updating profile image:', error);

            if (error.response?.status === 401) {
                toast.error('Session expired. Please login again.');
                onClose();
            } else if (error.message === 'PROFILE_ENDPOINT_NOT_FOUND') {
                toast.success('Profile picture uploaded! The backend profile endpoint is not ready yet.');
                onComplete();
            } else {
                toast.error(error.response?.data?.message || 'Failed to update profile picture. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => {
            if (!open && !loading && !uploading) {
                onClose();
            }
        }}>
            <DialogContent
                className="sm:max-w-md bg-white rounded-3xl p-8 border-none shadow-2xl"
                onPointerDownOutside={(e) => { if (loading || uploading) e.preventDefault(); }}
                onEscapeKeyDown={(e) => { if (loading || uploading) e.preventDefault(); }}
            >
                <DialogHeader className="text-center">
                    <DialogTitle className="text-2xl font-bold text-gray-900 border-b-2 border-blue-500 w-fit mx-auto pb-1 mb-2">
                        Upload Profile Picture
                    </DialogTitle>
                    <DialogDescription className="text-gray-600">
                        Tell the world who you are! Select a photo or skip for now.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col items-center justify-center py-6">
                    <Avatar className="w-32 h-32 border-4 border-blue-100 shadow-lg mb-6">
                        {imageUrl ? (
                            <AvatarImage
                                src={imageUrl}
                                alt="Preview"
                                className="object-cover"
                                onError={() => {
                                    console.error('Failed to load preview image');
                                    toast.error('Failed to load image preview');
                                }}
                            />
                        ) : (
                            <AvatarFallback className="bg-gray-100 text-gray-400">
                                <FaUser className="text-5xl" />
                            </AvatarFallback>
                        )}
                    </Avatar>

                    <div className="text-center">
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept="image/*"
                            className="hidden"
                        />

                        <Button
                            onClick={triggerFileInput}
                            disabled={uploading || loading}
                            variant="outline"
                            type="button"
                            className={`rounded-full px-6 py-2 border-2 border-dashed ${uploading || loading ? 'border-gray-300 text-gray-400 cursor-not-allowed' : 'border-blue-500 text-blue-600 hover:bg-blue-50'} transition-all font-semibold flex items-center gap-2`}
                        >
                            <FaCloudUploadAlt />
                            {uploading ? 'Uploading...' :
                                imageUrl ? 'Change Photo' : 'Select Photo'}
                        </Button>

                        <p className="text-gray-500 text-sm mt-2">
                            Supports JPG, PNG, GIF, WebP (Max 5MB)
                        </p>
                    </div>
                </div>

                <DialogFooter className="flex sm:justify-between items-center gap-4">
                    <Button
                        variant="ghost"
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 hover:bg-transparent px-0"
                        disabled={loading || uploading}
                    >
                        Skip for now
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={!imageUrl || loading || uploading}
                        className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-full px-8 py-2 font-bold hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg disabled:opacity-50"
                    >
                        {loading ? 'Saving...' : 'Continue'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}