"use client";
import Image from "next/image";
import * as React from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ArrowDown } from "lucide-react";

type Options = {
  value: string;
  label: string;
  image?: string; // Optional image property
};

interface ComboBoxResponsiveProps {
  options: Options[];
  widthDesktop: string;
  initialSelection: string;
  widthMobile: string;
  showImages?: boolean; // Optional prop to show images
  onSelectionChange: (value: string) => void; // Added this prop to handle selection change
}

export function ComboBoxResponsive({
  options,
  widthDesktop,
  initialSelection,
  widthMobile,
  showImages = false, // Default to false if not provided
  onSelectionChange, // Now expecting this prop
}: ComboBoxResponsiveProps) {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [selectedOption, setSelectedOption] = React.useState<Options | null>(null);

  const handleSelectionChange = (option: Options | null) => {
    setSelectedOption(option);
    onSelectionChange(option?.value || ""); // Call the parent prop with selected value
  };

  if (isDesktop) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className={`w-[${widthDesktop}] justify-center items-center font-head text-text`}>
            {selectedOption ? <>{selectedOption.label}</> : <>{initialSelection}</>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className={`w-[200px] p-0`} align="start">
          <OptionsList
            options={options}
            setOpen={setOpen}
            setSelectedOption={handleSelectionChange}
            showImages={showImages}
          />
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline" className={`w-[${widthMobile}] justify-center`}>
          {selectedOption ? <>{selectedOption.label}</> : <>{initialSelection}</>}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mt-4 border-t ">
          <OptionsList
            options={options}
            setOpen={setOpen}
            setSelectedOption={handleSelectionChange}
            showImages={showImages}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
}

function OptionsList({
  options,
  setOpen,
  setSelectedOption,
  showImages,
}: {
  options: Options[];
  setOpen: (open: boolean) => void;
  setSelectedOption: (option: Options | null) => void;
  showImages: boolean;
}) {
  return (
    <Command>
      <CommandInput placeholder="Filter options..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup>
          {options.map((option) => (
            <CommandItem
              key={option.value}
              value={option.value}
              onSelect={(value) => {
                const selectedOption = options.find((option) => option.value === value) || null;
                setSelectedOption(selectedOption);
                setOpen(false);
              }}
            >
              {showImages && option.image && (
                <Image
                  src={option.image}
                  alt={option.label}
                  width={24}
                  height={24}
                  className="w-6 h-6 mr-2 rounded-full"
                />
              )}
              {option.label}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
