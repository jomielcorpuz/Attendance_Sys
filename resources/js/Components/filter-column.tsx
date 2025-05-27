import * as React from "react"
import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu"

import { Button } from "@/Components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu"
import { ChevronDown } from "lucide-react"

type Checked = DropdownMenuCheckboxItemProps["checked"]
interface FilterMenuCheckboxesProps {
  items: { label: string, checked: Checked, onCheckedChange: (Checked: Checked) => void }[]
}
export function FilterMenuCheckboxes({ items }: FilterMenuCheckboxesProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Filter <ChevronDown /></Button>

      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Select</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {items.map((item, index) => (
          <DropdownMenuCheckboxItem
            key={index}
            checked={item.checked}
            onCheckedChange={item.onCheckedChange}>
            {item.label}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
