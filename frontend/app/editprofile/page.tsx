'use client';

import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/app/store/store'; // Assuming you have a centralized store setup
import Sidebar from '@/components/editprofile/sidebar';
import { FormField } from '@/components/signup/formfield';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { UserRound } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios'; // Import axios for API requests
import { updateUserProfile } from '@/app/slices/userSlice';

const EditProfilePage = () => {
  // Select user data from Redux
  const { userInfo } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();

  // Form state populated with empty values initially
  const [formData, setFormData] = useState({
    fName: '',
    lName: '',
    username: '',
    email: '',
  });

  const [bio, setBio] = useState('');
  const [profileImage, setProfileImage] = useState<string | undefined>(undefined); // Changed to undefined to avoid null issues
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Populate placeholders when userInfo changes
  useEffect(() => {
    if (userInfo) {
      setFormData({
        fName: '',
        lName: '',
        username: '',
        email: userInfo.email || '', // Email remains filled since it's disabled
      });
      setProfileImage(userInfo.profilePicture || undefined); // If no profile picture, keep it undefined
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

  // Handle form submission
  const handleSubmit = async () => {
    if (!userInfo) {
      alert('User is not logged in.');
      return;
    }

    const formDataToSubmit = new FormData();
    formDataToSubmit.append('userId', userInfo?.userId.toString() || '');
    if (formData.fName) formDataToSubmit.append('firstName', formData.fName);
    if (formData.lName) formDataToSubmit.append('lastName', formData.lName);
    if (formData.username) formDataToSubmit.append('username', formData.username);
    formDataToSubmit.append('password', ''); // Placeholder for password
    if (fileInputRef.current?.files?.[0]) {
      formDataToSubmit.append('profilePicture', fileInputRef.current.files[0]); // Only one profile picture will be sent
    }

    try {
      const response = await axios.put('http://localhost:8080/api/profile/update', formDataToSubmit, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const newProfilePictureUrl = response.data.profilePictureUrl || profileImage;

      // Update Redux with new profile data
      dispatch(
        updateUserProfile({
          userId: userInfo.userId,
          username: formData.username || userInfo.username,
          firstName: formData.fName || userInfo.firstName,
          lastName: formData.lName || userInfo.lastName,
          email: userInfo.email, // Email doesn't change
          profilePicture: newProfilePictureUrl, // Use the new profile picture URL from the backend
          createdAt: userInfo.createdAt,
        })
      );

      // Update local state for profile image preview
      setProfileImage(newProfilePictureUrl);

      alert(response.data.message);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
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
      <div className="w-[30%] px-[2rem] pt-[6rem] pl-[1rem]">
        <Sidebar />
      </div>

      <div className="justify-center w-[70%] p-[3rem] flex flex-col items-center">
        <div className="w-[60%]">
          <div className="flex p-8 bg-white rounded-2xl justify-between items-center">
            <div className="flex w-full h-20 items-center">
              <div className="mr-4 flex rounded-full h-28 w-28 border-2 border-gray-300 items-center justify-center overflow-hidden">
                {profileImage ? (
                  <img src={profileImage} alt="Profile" className="h-full w-full object-cover" />
                ) : (
                  <UserRound size={60} />
                )}
              </div>
              <div className="flex flex-col space-y-2">
                <span className="font-head text-[20px] font-bold">
                  {formData.username || userInfo?.username}
                </span>
                <span className="font-lato text-[16px]">
                  {`${formData.fName || userInfo?.firstName} ${formData.lName || userInfo?.lastName}`}
                </span>
              </div>
            </div>
            <Button className="" onClick={handlePhotoClick}>
              Change Photo
            </Button>
            {/* Hidden file input */}
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>

          <form className="mt-5 grid grid-cols-1 gap-6 md:grid-cols-2 w-full">
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
                placeholder="Enter a short bio"
              />
            </div>
          </form>

          <div className="mt-6 w-full">
            <Button className="w-full" onClick={handleSubmit}>
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfilePage;
