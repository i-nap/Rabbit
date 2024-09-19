import { FC } from 'react';

const Footer: FC = () => {
  return (
    <footer className="text-gray-500 py-4 font-lato">
      <div className=" flex flex-col items-center space-y-2">
        <div className="flex flex-wrap justify-center space-x-4 text-sm">
          <a href="#" className="hover:text-gray-800 transition-colors duration-200">
            About
          </a>
          <a href="#" className="hover:text-gray-800 transition-colors duration-200">
            Help
          </a>
          <a href="#" className="hover:text-gray-800 transition-colors duration-200">
            Jobs
          </a>
          <a href="#" className="hover:text-gray-800 transition-colors duration-200">
            Privacy
          </a>
          <a href="#" className="hover:text-gray-800 transition-colors duration-200">
            Terms
          </a>
          
        </div>
        <div className="text-xs text-gray-400 mt-2">
          © 2024 Rabbit. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
