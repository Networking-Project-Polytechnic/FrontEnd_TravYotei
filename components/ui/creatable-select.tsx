"use client"

import * as React from "react"
import { Check, ChevronsUpDown, Plus } from "lucide-react"

import { cn } from "@/lib/utils"
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
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

export interface Option {
    value: string
    label: string
}

interface CreatableSelectProps {
    options: Option[]
    value?: string
    onChange: (value: string) => void
    onCreate: (value: string) => void
    placeholder?: string
    searchPlaceholder?: string
    emptyMessage?: string
    isLoading?: boolean
}

export function CreatableSelect({
    options,
    value,
    onChange,
    onCreate,
    placeholder = "Select option...",
    searchPlaceholder = "Search...",
    emptyMessage = "No option found.",
    isLoading = false,
}: CreatableSelectProps) {
    const [open, setOpen] = React.useState(false)
    const [inputValue, setInputValue] = React.useState("")

    const selectedOption = options.find((option) => option.value === value)

    const handleCreate = () => {
        if (inputValue.trim()) {
            onCreate(inputValue.trim())
            setOpen(false)
            setInputValue("")
        }
    }

    // Filter options based on input value if needed, but Command does it automatically.
    // We check if the exact input value exists clearly to show/hide "Create"
    const exactMatch = options.some(
        (option) => option.label.toLowerCase() === inputValue.toLowerCase()
    )

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between"
                >
                    {selectedOption ? selectedOption.label : placeholder}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
                <Command>
                    <CommandInput
                        placeholder={searchPlaceholder}
                        onValueChange={setInputValue}
                    />
                    <CommandList>
                        <CommandEmpty className="py-2 px-2 text-sm">
                            {!inputValue ? (
                                emptyMessage
                            ) : (
                                <div className="flex flex-col gap-2">
                                    <p className="text-muted-foreground">"{inputValue}" not found.</p>
                                    {!exactMatch && (
                                        <Button
                                            variant="secondary"
                                            size="sm"
                                            className="w-full justify-start gap-1"
                                            onClick={handleCreate}
                                        >
                                            <Plus className="h-4 w-4" />
                                            Create "{inputValue}"
                                        </Button>
                                    )}
                                </div>
                            )}
                        </CommandEmpty>
                        <CommandGroup>
                            {options.map((option) => (
                                <CommandItem
                                    key={option.value}
                                    value={option.label} // Use label for search
                                    onSelect={(currentValue) => {
                                        // Command returns the lowercased value, we need to map back to ID or just assume label matches if unique
                                        // Better: find the option by label (since value is label here)
                                        const opt = options.find(
                                            (o) => o.label.toLowerCase() === currentValue.toLowerCase()
                                        )
                                        if (opt) {
                                            onChange(opt.value)
                                            setOpen(false)
                                        }
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            value === option.value ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    {option.label}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
