'use client';

import { useSelector } from 'react-redux';
import { RootState } from '@/app/store/store'; // Assuming you have a centralized store setup
import Sidebar from '@/components/editprofile/sidebar';
import { FormField } from '@/components/signup/formfield';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { UserRound } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

const EditProfilePage = () => {
  // Select user data from Redux
  const { userInfo } = useSelector((state: RootState) => state.user);

  // Form state populated with empty values initially
  const [formData, setFormData] = useState({
    fName: "",
    lName: "",
    username: "",
    email: "",
  });

  const [bio, setBio] = useState('');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Populate placeholders when userInfo changes
  useEffect(() => {
    if (userInfo) {
      setFormData({
        fName: '',
        lName: '',
        username: '',
        email: userInfo.email, // Email remains filled since it's disabled
      });
      setProfileImage(userInfo.profilePicture || null);
    }
  }, [userInfo]);

  // Handle input field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value,
    });
  };

  // Trigger file input click when "Change Photo" button is clicked
  const handlePhotoClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // Programmatically trigger the file input
    }
  };

  // Handle file selection and preview
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
    }
  };

  return (
    <div className="flex h-screen w-full">
      {/* Sidebar */}
      <div className='w-[30%] px-[2rem] pt-[6rem] pl-[1rem]'>
        <Sidebar />
      </div>
      
      <div className="justify-center w-[70%] p-[3rem] flex flex-col items-center">
        <div className='w-[60%]'>
          <div className="flex p-8 bg-white rounded-2xl justify-between items-center">
            <div className='flex w-full h-20 items-center'>
              <div className="mr-4 flex rounded-full h-28 w-28 border-2 border-gray-300 items-center justify-center overflow-hidden">
                {profileImage ? (
                  <img src={profileImage} alt="Profile" className="h-full w-full object-cover" />
                ) : (
                  <UserRound size={60} />
                )}
              </div>
              <div className='flex flex-col space-y-2'>
                <span className='font-head text-[20px] font-bold'>{formData.username || userInfo?.username}</span>
                <span className='font-lato text-[16px]'>{`${formData.fName || userInfo?.firstName} ${formData.lName || userInfo?.lastName}`}</span>
              </div>
            </div>
            <Button className="" onClick={handlePhotoClick}>Change Photo</Button>
            {/* Hidden file input */}
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>

          <form className='mt-5 grid grid-cols-1 gap-6 md:grid-cols-2 w-full'>
            <FormField
              id="fName"
              label="First Name"
              type="text"
              value={formData.fName}
              onChange={handleChange}
              placeholder={userInfo?.firstName || 'First Name'}
            />
            <FormField
              id="lName"
              label="Last Name"
              type="text"
              value={formData.lName}
              onChange={handleChange}
              placeholder={userInfo?.lastName || 'Last Name'}
            />
            <FormField
              id="username"
              label="Username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              placeholder={userInfo?.username || 'Username'}
            />
            <FormField
              id="email"
              label="Email"
              type="text"
              value={formData.email}
              onChange={handleChange}
              placeholder={userInfo?.email || 'Email'}
              disabled
            />

            <div className="grid grid-cols-1 md:col-span-2 w-full">
              <label className="block text-sm font-semibold mb-1">Bio</label>
              <Textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                maxLength={150}
                className="w-full"
                placeholder={bio || 'Bio'}
              />
            </div>
          </form>

          <div className="mt-6 w-full">
            <Button className='w-full'>Save Changes</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfilePage;
