"use client"
import Image from "next/image"

import * as React from "react"
import { useMediaQuery } from "@/hooks/useMediaQuery"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ArrowDown } from "lucide-react"

type Options = {
  value: string
  label: string
  image?: string // Optional image property
}

interface ComboBoxResponsiveProps {
  options: Options[]
  widthDesktop: string
  initialSelection: string
  widthMobile: string
  showImages?: boolean // Optional prop to show images
}

export function ComboBoxResponsive({
  options,
  widthDesktop,
  initialSelection,
  widthMobile,
  showImages = false, // Default to false if not provided
}: ComboBoxResponsiveProps) {
  const [open, setOpen] = React.useState(false)
  const isDesktop = useMediaQuery("(min-width: 768px)")
  const [selectedOption, setSelectedOption] = React.useState<Options | null>(null)

  if (isDesktop) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className={`w-[${widthDesktop}] justify-center items-center font-head text-text`}>
            {selectedOption ? <>{selectedOption.label}</> : <>{initialSelection}</>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className={`w-[200px] p-0`} align="start">
          <OptionsList options={options} setOpen={setOpen} setSelectedOption={setSelectedOption} showImages={showImages} />
        </PopoverContent>
      </Popover>
    )
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
          <OptionsList options={options} setOpen={setOpen} setSelectedOption={setSelectedOption} showImages={showImages}/>
        </div>
      </DrawerContent>
    </Drawer>
  )
}

function OptionsList({
  options,
  setOpen,
  setSelectedOption,
  showImages,
}: {
  options: Options[]
  setOpen: (open: boolean) => void
  setSelectedOption: (option: Options | null) => void
  showImages: boolean
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
                setSelectedOption(
                  options.find((option) => option.value === value) || null
                )
                setOpen(false)
              }}
            >
              {showImages && option.image && (
                  <Image src={option.image} alt={option.label} width={24} height={24} className="w-6 h-6 mr-2 rounded-full" />
        
              )}
              {option.label}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  )
}
