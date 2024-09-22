import React from "react";
import { TrendingUp, Heart, Newspaper } from "lucide-react";

interface CategoryListProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const categories = [
  { name: 'Trending', icon: TrendingUp },
  { name: 'Most Liked', icon: Heart },
  { name: 'New', icon: Newspaper },
];

const CategoryList: React.FC<CategoryListProps> = ({ selectedCategory, onCategoryChange }) => {
  return (
    <ul className="flex flex-col space-y-[1rem]">
      {categories.map((category, index) => (
        <li
          key={index}
          onClick={() => onCategoryChange(category.name)}
          className={`flex space-x-[1rem] font-lato text-[16px] items-center cursor-pointer transition-all duration-200 ease-in-out ${
            selectedCategory === category.name ? "text-gray-900 font-bold" : "text-gray-500"
          }`}
        >
          <category.icon />
          <span>{category.name}</span>
        </li>
      ))}
    </ul>
  );
};

export default CategoryList;
