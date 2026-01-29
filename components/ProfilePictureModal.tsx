'use client';

import React, { useState } from 'react';
import { CldUploadWidget } from 'next-cloudinary';
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

interface ProfilePictureModalProps {
    isOpen: boolean;
    onClose: () => void;
    onComplete: () => void;
}

export default function ProfilePictureModal({ isOpen, onClose, onComplete }: ProfilePictureModalProps) {
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleUploadSuccess = (result: any) => {
        if (result.info && result.info.secure_url) {
            setImageUrl(result.info.secure_url);
            toast.success('Image uploaded successfully!');
        }
    };

    const handleSave = async () => {
        if (!imageUrl) return;

        setLoading(true);
        try {
            await updateProfileImage(imageUrl);
            toast.success('Profile picture updated!');
            onComplete();
        } catch (error: any) {
            console.error('Error updating profile image:', error);
            toast.error(error.response?.data?.message || 'Failed to update profile picture. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-md bg-white rounded-3xl p-8 border-none shadow-2xl">
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
                            <AvatarImage src={imageUrl} alt="Preview" className="object-cover" />
                        ) : (
                            <AvatarFallback className="bg-gray-100 text-gray-400">
                                <FaUser className="text-5xl" />
                            </AvatarFallback>
                        )}
                    </Avatar>

                    <CldUploadWidget
                        uploadPreset="ml_default" // The user should check if they have a different preset
                        onSuccess={handleUploadSuccess}
                    >
                        {({ open }) => {
                            return (
                                <Button
                                    onClick={() => open()}
                                    variant="outline"
                                    className="rounded-full px-6 py-2 border-2 border-dashed border-blue-500 text-blue-600 hover:bg-blue-50 transition-all font-semibold flex items-center gap-2"
                                >
                                    <FaCloudUploadAlt />
                                    {imageUrl ? 'Change Photo' : 'Select Photo'}
                                </Button>
                            );
                        }}
                    </CldUploadWidget>
                </div>

                <DialogFooter className="flex sm:justify-between items-center gap-4">
                    <Button
                        variant="ghost"
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 hover:bg-transparent px-0"
                    >
                        Skip for now
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={!imageUrl || loading}
                        className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-full px-8 py-2 font-bold hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg disabled:opacity-50"
                    >
                        {loading ? 'Saving...' : 'Continue'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
