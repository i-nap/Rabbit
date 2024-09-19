// components/Search.js
import { SearchIcon } from 'lucide-react';
import { useState } from 'react';

const Search = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleFormClick = (event: React.MouseEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    setIsOpen(false);
  };

  return (
    <div className="flex items-center justify-center">
      <form
        className={`relative transition-all duration-1000 ease-in-out ${
          isOpen ? 'w-80' : 'w-12'
        } h-12 bg-transparent rounded-full border-4 border-transparent flex items-center px-2`}
        onClick={handleFormClick}
        onMouseLeave={handleMouseLeave}
      >
        <input
          type="search"
          placeholder="Search here ..."
          className={`bg-white absolute top-0 left-0 h-full w-full px-4 py-2 outline-none border-0 rounded-full text-lg ${
            isOpen ? 'block' : 'hidden'
          }`}
        />
        <SearchIcon
          className={`transition-all duration-200 ease-in-out p-0 m-0 ${
            isOpen ? 'text-white' : 'text-[#07051a]'
          } w-10 h-10 flex items-end justify-center rounded-full hover:text-gray-500`}
        />
      </form>
    </div>
  );
};

export default Search;
