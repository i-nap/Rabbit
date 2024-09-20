import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { CircleMinus, UserCircle, X } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import axios from 'axios';

export default function EditCommunity() {
    const [activeTab, setActiveTab] = useState('editProfile'); // State to manage active tab
    const [editableCommunityName, setEditableCommunityName] = useState<string>(''); // For edit profile
    const [description, setDescription] = useState<string>(''); // For edit profile
    const [logo, setLogo] = useState<File | null>(null); // For edit profile
    const [coverImage, setCoverImage] = useState<File | null>(null); // For edit profile
    const [members, setMembers] = useState<any[]>([]); // State to store fetched members
    const [loadingMembers, setLoadingMembers] = useState<boolean>(false); // State to manage loading state
    const [submitLoading, setSubmitLoading] = useState<boolean>(false); // Loading state for form submission

    const { toast } = useToast();
    const router = useRouter();
    const { communityName } = useParams(); // Get community name from the URL

    const handleRemoveLogo = () => setLogo(null);
    const handleRemoveCoverImage = () => setCoverImage(null);

    const fetchMembers = async () => {
        console.log("Running fetchMembers for community:", communityName);
        setLoadingMembers(true);
        try {
            const response = await axios.get(`http://localhost:8080/api/community/${communityName}/members`);
            console.log(response.data);
            setMembers(response.data);
        } catch (error) {
            console.error("Failed to fetch members:", error);
            toast({
                title: 'Error',
                description: 'Failed to load community members.',
                variant: 'destructive',
            });
        } finally {
            setLoadingMembers(false);
        }
    };

    const handleRemoveMember = async (memberId: number) => {
        // Confirm dialog to ensure the user wants to remove the member
        if (confirm('Are you sure you want to remove this member?')) {
          try {
            console.log(`Removing member with ID:`+ memberId);
            console.log(`From community: ${communityName}`);
            // Call your API to remove the member
            await axios.delete(`http://localhost:8080/api/community/${communityName}/remove-member/${memberId}`);
            // Refresh members list
            fetchMembers();
            toast({
              title: 'Member Removed',
              description: 'The member has been successfully removed.',
            });
          } catch (error) {
            toast({
              title: 'Error',
              description: 'Failed to remove the member.',
              variant: 'destructive',
            });
          }
        }
      };
    

    useEffect(() => {
        if (activeTab === 'members' && communityName) {
            fetchMembers();
        }
    }, [activeTab, communityName]);

    const handleSubmit = async () => {
        if (!editableCommunityName) {
            toast({
                title: 'Error',
                description: 'Community name is required!',
                variant: 'destructive',
            });
            return;
        }

        const formData = new FormData();
        formData.append('name', editableCommunityName);
        formData.append('description', description);
        if (logo) formData.append('logo', logo);
        if (coverImage) formData.append('coverImage', coverImage);

        try {
            setSubmitLoading(true);
            await axios.put('/api/community/edit', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            toast({
                title: 'Community updated successfully!',
                description: 'Your community has been updated.',
            });
            router.push('/communities');
        } catch (error) {
            console.error(error);
            toast({
                title: 'Error',
                description: 'Failed to update community. Please try again.',
                variant: 'destructive',
            });
        } finally {
            setSubmitLoading(false);
        }
    };

    return (
        <div className="flex flex-col w-full h-full pt-32 p-[3rem]">
            <h1 className="text-3xl font-bold mb-6">Edit Community</h1>

            {/* Tabs */}
            <div className="flex space-x-4 mb-6">
                <Button
                    className={`px-4 py-2 rounded ${activeTab === 'editProfile' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    onClick={() => setActiveTab('editProfile')}
                >
                    Edit Profile
                </Button>
                <Button
                    className={`px-4 py-2 rounded ${activeTab === 'members' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    onClick={() => setActiveTab('members')}
                >
                    Members
                </Button>
                <Button
                    className={`px-4 py-2 rounded ${activeTab === 'notifications' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    onClick={() => setActiveTab('notifications')}
                >
                    Notifications
                </Button>
            </div>

            {/* Tab Content */}
            <div className="grid gap-4">
                {activeTab === 'editProfile' && (
                    <>
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="communityName">Community Name</Label>
                            <Input
                                id="communityName"
                                value={editableCommunityName}
                                onChange={(e) => setEditableCommunityName(e.target.value)}
                                placeholder="Enter community name"
                                required
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Describe your community"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <Label>Logo</Label>
                            {logo ? (
                                <div className="flex items-center space-x-2">
                                    <span>{logo.name}</span>
                                    <button onClick={handleRemoveLogo} className="text-red-500">
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ) : (
                                <Input type="file" onChange={(e) => setLogo(e.target.files?.[0] || null)} />
                            )}
                        </div>

                        <div className="flex flex-col gap-2">
                            <Label>Cover Image</Label>
                            {coverImage ? (
                                <div className="flex items-center space-x-2">
                                    <span>{coverImage.name}</span>
                                    <button onClick={handleRemoveCoverImage} className="text-red-500">
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ) : (
                                <Input type="file" onChange={(e) => setCoverImage(e.target.files?.[0] || null)} />
                            )}
                        </div>

                        <Button onClick={handleSubmit} disabled={submitLoading}>
                            {submitLoading ? 'Updating...' : 'Update Community'}
                        </Button>
                    </>
                )}
                {/* Members Tab */}
                {activeTab === 'members' && (
                    <div className="w-full">
                        <h2 className="text-xl font-bold mb-4">Members</h2>
                        {loadingMembers ? (
                            <p>Loading members...</p>) : members.length > 0 ? (<div className="divide-y divide-gray-200"> {members.map((member) => (<div key={member.id} className="py-4 flex justify-between items-center"> <div className="flex items-center space-x-4"> <img src={member.profilePictureUrl || "https://via.placeholder.com/40"} alt="Profile" className="h-10 w-10 rounded-full" /> 
                            <div> 
                                <p className="text-sm font-medium text-gray-900">{member.firstName} {member.lastName}</p>
                                 <p className="text-sm text-gray-500">{member.email}</p> 
                                 </div> 
                                 </div> 
                                 <div className="flex items-center space-x-2"> 
                                 <UserCircle className="w-6 h-6 text-blue-500 cursor-pointer" onClick={() => alert('Member profile')} /> 
                                 <CircleMinus className="w-6 h-6 text-red-500 cursor-pointer" onClick={() => handleRemoveMember(member.id)} /> 
                                 </div> 
                                 </div>))} 
                                 </div>) : (<p>No members found for this community.</p>)} </div>)}


                {/* Notifications Tab */}
                {activeTab === 'notifications' && (
                    <div>
                        <h2 className="text-xl font-bold mb-4">Notifications</h2>
                        <p>This section will display notifications related to the community.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
