import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User, Bell, Lock, UserPlus, EyeOff, MessageCircle, Tag, MessageSquare, RotateCcw, UserX, Type, Speaker, Eye, ThumbsUp } from 'lucide-react'; // Import additional icons as needed

const Sidebar = () => {
  const pathname = usePathname();

  const menuItems = [
    { name: 'Edit Profile', href: '/edit-profile', icon: <User /> },
    { name: 'Notifications', href: '/notifications', icon: <Bell /> },
    { name: 'Account Privacy', href: '/account-privacy', icon: <Lock /> },
    { name: 'Close Friends', href: '/close-friends', icon: <UserPlus /> },
    // Add more items as needed
  ];

  return (
    <div className="w-full h-screen p-6 border-r ">
      <div className="space-y-2">
        {menuItems.map((item) => (
          <Link key={item.name} href={item.href} className={`flex items-center py-4 px-3 rounded-md ${
              pathname === item.href ? 'bg-gray-500' : 'bg-transparent'
            } hover:bg-gray-500 transition-colors duration-150 ease-in-out`}>
            <div className="flex items-center w-full ">
              {item.icon}
              <span className="ml-3 font-lato text-2xl">{item.name}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
