// components/BioModal.tsx
'use client';

import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { updateUserBio } from '@/lib/api';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { FaQuoteLeft } from 'react-icons/fa';

interface BioModalProps {
    isOpen: boolean;
    onClose: () => void;
    onComplete: () => void;
}

export default function BioModal({ isOpen, onClose, onComplete }: BioModalProps) {
    const [bio, setBio] = useState('');
    const [loading, setLoading] = useState(false);
    const { refreshProfile } = useAuth();

    // Reset state when modal opens
    useEffect(() => {
        if (isOpen) {
            setBio('');
        }
    }, [isOpen]);

    const handleSave = async () => {
        if (!bio.trim()) {
            onComplete(); // If empty, just treat as skip or complete
            return;
        }

        setLoading(true);
        try {
            await updateUserBio(bio);
            toast.success('Bio updated successfully!');
            await refreshProfile();
            onComplete();
        } catch (error: any) {
            console.error('Error updating bio:', error);
            toast.error(error.response?.data?.message || 'Failed to update bio. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => {
            if (!open && !loading) {
                onClose();
            }
        }}>
            <DialogContent
                className="sm:max-w-md bg-white rounded-3xl p-8 border-none shadow-2xl"
                onPointerDownOutside={(e) => { if (loading) e.preventDefault(); }}
                onEscapeKeyDown={(e) => { if (loading) e.preventDefault(); }}
            >
                <DialogHeader className="text-center">
                    <DialogTitle className="text-2xl font-bold text-gray-900 border-b-2 border-blue-500 w-fit mx-auto pb-1 mb-2">
                        Tell Us More About Yourself
                    </DialogTitle>
                    <DialogDescription className="text-gray-600">
                        Share a brief bio with the community. You can also do this later.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col items-center justify-center py-6">
                    <div className="w-full relative">
                        <FaQuoteLeft className="absolute -top-3 -left-2 text-blue-100 text-4xl -z-10" />
                        <textarea
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            placeholder="I'm a traveler who loves exploring new places..."
                            className="w-full min-h-[120px] p-4 rounded-2xl border-2 border-gray-100 focus:border-blue-400 focus:ring-0 transition-all resize-none text-gray-700 bg-gray-50"
                            maxLength={500}
                        />
                        <div className="text-right text-xs text-gray-400 mt-2">
                            {bio.length}/500 characters
                        </div>
                    </div>
                </div>

                <DialogFooter className="flex sm:justify-between items-center gap-4">
                    <Button
                        variant="ghost"
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 hover:bg-transparent px-0"
                        disabled={loading}
                    >
                        Skip for now
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={loading}
                        className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-full px-8 py-2 font-bold hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg disabled:opacity-50"
                    >
                        {loading ? 'Saving...' : 'Finish'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
