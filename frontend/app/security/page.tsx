'use client';
import Sidebar from "@/components/editprofile/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import axios from "axios";
import { useSelector } from 'react-redux';
import { RootState } from '@/app/store/store';
export default function SecurityPage() {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
    });
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false); // To disable the button while processing
    const { userInfo } = useSelector((state: RootState) => state.user);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handlePasswordChange = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (formData.newPassword !== formData.confirmNewPassword) {
            toast({
                title: 'Error',
                description: 'New password does not match confirmation.',
                variant: 'destructive',
            });
            return;
        }

        setIsSubmitting(true); // Disable button while processing

        try {
            const response = await axios.post('http://localhost:8080/api/auth/change-password', {
                email: userInfo?.email, // Send the email from userInfo
            currentPassword: formData.currentPassword,
                newPassword: formData.newPassword,
            });

            if (response.status === 200) {
                toast({
                    title: 'Success',
                    description: 'Your password has been successfully changed.',
                });

                // Reset fields
                setFormData({
                    currentPassword: '',
                    newPassword: '',
                    confirmNewPassword: ''
                });
            }
        } catch (error: any) {
            toast({
                title: 'Error',
                description: error?.response?.data?.message || 'Password change failed. Please try again.',
                variant: 'destructive'
            });
        } finally {
            setIsSubmitting(false); // Re-enable the button
        }
    }

    
    return (
        <div className="flex h-screen w-full bg-gray-50">
            {/* Sidebar */}
            <div className="w-[30%] px-[2rem] pt-[6rem] pl-[1rem]">
                <Sidebar />
            </div>

        <div className="flex w-full items-center justify-center">

     
            {/* Form Section */}
            <div className='flex items-center justify-center w-[700px]'>
                <form onSubmit={handlePasswordChange} className="bg-white p-8 shadow rounded-lg w-full">
                    <h1 className="text-xl font-semibold mb-4">Change Password</h1>
                    
                    <div className="mb-4">
                        <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">Current Password</label>
                        <Input
                            id="currentPassword"
                            name="currentPassword"
                            type="password"
                            value={formData.currentPassword}
                            onChange={handleChange}
                            required
                            className="mt-1"
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">New Password</label>
                        <Input
                            id="newPassword"
                            name="newPassword"
                            type="password"
                            value={formData.newPassword}
                            onChange={handleChange}
                            required
                            className="mt-1"
                        />
                    </div>

                    <div className="mb-6">
                        <label htmlFor="confirmNewPassword" className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                        <Input
                            id="confirmNewPassword"
                            name="confirmNewPassword"
                            type="password"
                            value={formData.confirmNewPassword}
                            onChange={handleChange}
                            required
                            className="mt-1"
                        />
                    </div>

                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? 'Processing...' : 'Change Password'}
                    </Button>                </form>
            </div>

            </div>
        </div>
    );
}
