import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User, Bell, Lock, UserPlus } from 'lucide-react'; // Import additional icons as needed

const Sidebar = () => {
  const pathname = usePathname();

  const menuItems = [
    { name: 'Edit Profile', href: '/editprofile', icon: <User /> },
    { name: 'Notifications', href: '/notifications', icon: <Bell /> },
    { name: 'Security', href: '/security', icon: <Lock /> },
    { name: 'Close Friends', href: '/close-friends', icon: <UserPlus /> },
  ];

  // Default to 'Edit Profile' if the current path does not match any item
  const isDefaultSelected = !menuItems.some(item => item.href === pathname);

  return (
    <div className="w-full h-screen p-6 border-r">
      <div className="space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`flex items-center py-4 px-3 rounded-md ${
              (pathname === item.href || (isDefaultSelected && item.href === '/edit-profile')) 
                ? 'bg-gray-500' 
                : 'bg-transparent'
            } hover:bg-gray-500 transition-colors duration-150 ease-in-out`}
          >
            <div className="flex items-center w-full">
              {item.icon}
              <span className="ml-3 font-lato text-xl">{item.name}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
