"use client"
import { useState } from "react";
import { ArrowUp, FlameIcon, Heart, TrendingUp } from "lucide-react";

const categories = [
    {
        name: 'Hot',
        icon: FlameIcon
    },
    {
        name: 'Trending',
        icon: TrendingUp
    },
    {
        name: 'Top',
        icon: ArrowUp
    },
    {
        name: 'Favs',
        icon: Heart
    }
]

export default function CategoryList() {
    const [selectedCategory, setSelectedCategory] = useState('Hot');

    return (
        <ul className="flex flex-col space-y-[2rem]">
            {categories.map((category, index) => (
                <li
                    key={index}
                    onClick={() => setSelectedCategory(category.name)}
                    className={`flex space-x-[1rem] font-lato text-xl items-center cursor-pointer transition-all duration-200 ease-in-out ${
                        selectedCategory === category.name ? 'text-gray-900 font-bold' : 'text-gray-500'
                    }`}
                >
                    <category.icon />
                    <span>{category.name}</span>
                </li>
            ))}
        </ul>
    );
}
