import React, { useState } from 'react';
import {Input} from './input'; // Adjust the path if needed
import {Popover} from './popover'; // Adjust the path if needed
import {Button} from './button'; // Assuming you have a button component
import {Badge} from './badge'; // Assuming you have a badge component
interface TagSearchProps {
    availableTags: string[];
    onTagsChange: (selectedTags: string[]) => void;
  }
  
  const TagSearch: React.FC<TagSearchProps> = ({ availableTags, onTagsChange }) => {
    const [query, setQuery] = useState('');
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [popoverOpen, setPopoverOpen] = useState(false);
  
    const filteredTags = availableTags.filter((tag) =>
      tag.toLowerCase().includes(query.toLowerCase())
    );
  
    const handleAddTag = (tag: string) => {
      if (!selectedTags.includes(tag)) {
        const updatedTags = [...selectedTags, tag];
        setSelectedTags(updatedTags);
        onTagsChange(updatedTags);
        setQuery('');
        setPopoverOpen(false);
      }
    };
  
    const handleRemoveTag = (tag: string) => {
      const updatedTags = selectedTags.filter((t) => t !== tag);
      setSelectedTags(updatedTags);
      onTagsChange(updatedTags);
    };
  
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setQuery(e.target.value);
      if (e.target.value) {
        setPopoverOpen(true);
      } else {
        setPopoverOpen(false);
      }
    };
  
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="flex flex-wrap gap-2 mb-4">
            <div className='flex space-x-[1rem]'>

            
          {selectedTags.map((tag) => (
            <Badge key={tag} className="flex items-center text-white rounded-xl font-head">
              {tag}
              <Button
                onClick={() => handleRemoveTag(tag)}
                className="text-[16px] text-gray-200 hover:text-gray-100 ml-[5px] w-1 h-10"
              >
                ×
              </Button>
            </Badge>
          ))}
          </div>
        </div>
  
        <div className="relative">
          <Input
            type="text"
            value={query}
            onChange={handleInputChange}
            placeholder="Search tags..."
            className="w-full"
            onFocus={() => setPopoverOpen(true)}
          />
  
          {popoverOpen && query && filteredTags.length > 0 && (
            <div className="absolute w-full border mt-1 rounded-md shadow-lg bg-white z-10">
              {filteredTags.map((tag) => (
                <Button
                  key={tag}
                  onClick={() => handleAddTag(tag)}
                  variant="ghost"
                  className="block w-full text-left px-4 py-2 hover:bg-gray-200"
                >
                  {tag}
                </Button>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };
  
  export default TagSearch;