'use client'
// app/search/page.tsx
import SideBarLeft from "@/components/sidebar-left";
import axios from 'axios';
import { useSearchParams} from 'next/navigation'; // Make sure to import Link from Next.js
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from "next/link";

interface Community {
  id: number;
  name: string;
  description: string;
  logoUrl: string;
  memberCount: number; // Assuming you have member count data available
  onlineCount: number;  // Assuming you track online users
}

export default function SearchPage() {
  const [communities, setCommunities] = useState<Community[]>([]);
  const searchParams = useSearchParams();
  const keyword = searchParams.get('keyword') || '';

  useEffect(() => {
    // Fetch search results from the backend
    const fetchCommunities = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/community/search?keyword=${encodeURIComponent(keyword)}`);
        setCommunities(response.data);
      } catch (error) {
        console.error('Error fetching communities:', error);
      }
    };

    if (keyword) {
      fetchCommunities();
    }
  }, [keyword]);

  const [selectedCategory, setSelectedCategory] = useState<string>("Trending");

  // Handler for changing category, passed to SideBarLeft
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  return (
    <div className="flex w-full h-screen">
      <div className="w-[18%] h-full fixed left-0 top-0">
        <SideBarLeft selectedCategory={selectedCategory} onCategoryChange={handleCategoryChange} />
      </div>
      <div className="pt-32 w-[75%] ml-[18%] pl-[3rem] h-full overflow-y-auto hide-scrollbar space-y-[2rem]">
        {communities.length > 0 ? (
          communities.map((community) => (
            <Link key={community.id} href={`/b/${community.name}`} className="flex items-center space-x-4 bg-white p-4 rounded-lg shadow-md cursor-pointer">
              {/* Logo */}
              <div className="flex-none w-10 h-10">
                <Image
                  src={community.logoUrl || '/logo.svg'} // Fallback to default logo if not provided
                  alt={community.name}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              </div>
              {/* Name, description, member and online count */}
              <div className="flex-grow">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-bold">{community.name}</h2>
                </div>
                <p className="text-sm text-gray-500">{community.description}</p>
              </div>
            </Link>
          ))
        ) : (
          <p>No communities found for "{keyword}"</p>
        )}
      </div>
    </div>
  );
}
