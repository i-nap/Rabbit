import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, CircleMinus, UserCircle, X } from 'lucide-react';
import { useRouter, useParams,usePathname } from 'next/navigation';
import axios from 'axios';
import CommunityProfileHeader from './communityprofileheader';
// Assuming FormField is a custom component
import { FormField } from '@/components/signup/formfield';

export default function EditCommunity() {
  const [activeTab, setActiveTab] = useState('editProfile');
  const [communityData, setCommunityData] = useState<any>(null); // Original community data for placeholders
  const [members, setMembers] = useState<any[]>([]);
  const [loadingMembers, setLoadingMembers] = useState<boolean>(false);
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    logo: null,
    coverImage: null,
    tags: '',  // Initialize as a string
    links: ''  // Initialize as a string
  }); // Store community data for editing
  const { toast } = useToast();
  const router = useRouter();
  const { communityName } = useParams(); // Get community name from the URL
  const pathname = usePathname(); // Get current path

  const fetchCommunityData = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/community/${communityName}`);
      setCommunityData(response.data); // Store original community data// Pre-fill form data with community data
    } catch (error) {
      console.error("Failed to fetch community data:", error);
      toast({
        title: 'Error',
        description: 'Failed to load community data.',
        variant: 'destructive',
      });
    }
  };

  const fetchMembers = async () => {
    setLoadingMembers(true);
    try {
      const response = await axios.get(`http://localhost:8080/api/community/${communityName}/members`);
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
    if (confirm('Are you sure you want to remove this member?')) {
      try {
        await axios.delete(`http://localhost:8080/api/community/${communityName}/remove-member/${memberId}`);
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
    if (activeTab === 'editProfile' && communityName) {
      fetchCommunityData();
    }
    if (activeTab === 'members' && communityName) {
      fetchMembers();
    }
  }, [activeTab, communityName]);

  const handleSubmit = async () => {
    const submitData = new FormData();
    submitData.append('name', communityData.name); // Old community name
    submitData.append('newName', formData.name); // New community name
    submitData.append('description', formData.description);
    submitData.append('tags', formData.tags.split(',').map(tag => tag.trim()).join(','));  // Comma-separated string
    submitData.append('links', formData.links.split(' ').map(link => link.trim()).join(' '));  // Space-separated string
    if (formData.logo) submitData.append('logo', formData.logo);
    if (formData.coverImage) submitData.append('coverImage', formData.coverImage);
  
    try {
      setSubmitLoading(true);
      await axios.put('http://localhost:8080/api/community/edit', submitData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
  
      // Use the new name for navigation (soft refresh or full redirect to the new community page)
      if (formData.name) {
        router.push(`/b/${formData.name}/edit`); // Navigate to the new community name's page
      } else {
        // Fallback in case new name is not provided
        window.location.href = `/b/${communityData.name}/edit`;
      }
  
      toast({
        title: 'Community updated successfully!',
        description: 'Your community has been updated.',
      });
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
  

  const handleChange = (e: any) => {
    const { name, id, value, files } = e.target;
    const fieldName = name || id; // Use name or id as the field name

    if (files) {
      setFormData({
        ...formData,
        [fieldName]: files[0],
      });
    } else {
      setFormData({
        ...formData,
        [fieldName]: value,
      });
    }
  };

  return (
    <div className="flex flex-col w-full h-full pt-2">
      {/* Back Button */}
      <div className="mb-1">
        <Button
          variant="ghost"
          onClick={() => {
            // Check if formData.name is valid, otherwise use communityData.name
            const targetName = formData.name?.trim() ? formData.name : communityData.name;
            if (targetName) {
              router.push(`/b/${targetName}`);
            } else {
              // Optional: Handle the case where both names are invalid
              toast({
                title: "Error",
                description: "Community name is required.",
                variant: "destructive",
              });
            }
          }}
          className="flex items-center px-0"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-4 mb-6">
        <Button
          variant={activeTab === 'editProfile' ? 'default' : 'outline'}
          onClick={() => setActiveTab('editProfile')}
        >
          Edit Profile
        </Button>
        <Button
          variant={activeTab === 'members' ? 'default' : 'outline'}
          onClick={() => setActiveTab('members')}
        >
          Members
        </Button>
        <Button
          variant={activeTab === 'notifications' ? 'default' : 'outline'}
          onClick={() => setActiveTab('notifications')}
        >
          Notifications
        </Button>
      </div>

      {/* Scrollable Content */}
      <div className="grid place-items-center gap-4 overflow-y-auto hide-scrollbar h-[calc(100vh-200px)] px-2">
        {activeTab === 'editProfile' && communityData && (
          <>
            <CommunityProfileHeader
              communityName={communityData.name}
              showButtons={false}
            />
            <form className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-2 w-full">
              <div className="col-span-1">
                <FormField
                  id="name"
                  label="Community Name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder={communityData?.name}
                />
              </div>

              <div className="col-span-1">
                <label className="block text-sm font-semibold mb-1">Bio</label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder={communityData.description}
                />
              </div>

              <div className="col-span-1">
                <FormField
                  id="tags"
                  label="Tags"
                  type="text"
                  value={formData.tags}
                  onChange={handleChange}
                  placeholder="Enter tags, separated by commas"
                />
              </div>

              {/* Links Field */}
              <div className="col-span-1">
                <FormField
                  id="links"
                  label="Links"
                  type="text"
                  value={formData.links}
                  onChange={handleChange}
                  placeholder="Enter links, separated by spaces"
                />
              </div>

              <div className="col-span-1">
                <FormField
                  id="logo"
                  label="Logo"
                  type="file"
                  onChange={handleChange}
                  placeholder="Upload a logo"
                />
                {formData.logo && (
                  <div className="flex items-center space-x-2">
                    <span>{formData.logo.name}</span>
                    <button onClick={() => setFormData({ ...formData, logo: null })} className="text-red-500">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              <div className="col-span-1">
                <FormField
                  id="coverImage"
                  label="Cover Image"
                  type="file"
                  onChange={handleChange}
                  placeholder="Upload a cover image"
                />
                {formData.coverImage && (
                  <div className="flex items-center space-x-2">
                    <button onClick={() => setFormData({ ...formData, coverImage: null })} className="text-red-500">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </form>


            <Button onClick={handleSubmit} disabled={submitLoading} className="mt-6 w-full">
              {submitLoading ? 'Updating...' : 'Update Community'}
            </Button>
          </>
        )}

        {/* Members Tab */}
        {activeTab === 'members' && (
          <div className="w-full h-[calc(100vh-200px)]">
            <h2 className="text-xl font-bold mb-4">Members</h2>
            {loadingMembers ? (
              <p>Loading members...</p>
            ) : members.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {members.map((member) => (
                  <div key={member.id} className="py-4 flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                      <img src={member.profilePictureUrl || "https://via.placeholder.com/40"} alt="Profile" className="h-10 w-10 rounded-full" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{member.firstName} {member.lastName}</p>
                        <p className="text-sm text-gray-500">{member.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <UserCircle className="w-6 h-6 text-blue-500 cursor-pointer" onClick={() => alert('Member profile')} />
                      <CircleMinus className="w-6 h-6 text-red-500 cursor-pointer" onClick={() => handleRemoveMember(member.id)} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>No members found for this community.</p>
            )}
          </div>
        )}

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