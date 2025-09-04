"use client"

import { useState } from "react"
import { Search, X } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface StoreSearchProps {
  onSearch: (query: string, field: string) => void
  onReset: () => void
}

const StoreSearch = ({ onSearch, onReset }: StoreSearchProps) => {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchField, setSearchField] = useState("all")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(searchQuery, searchField)
  }

  const handleReset = () => {
    setSearchQuery("")
    setSearchField("all")
    onReset()
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
      <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            type="text"
            placeholder="Search stores..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 w-full"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X size={16} />
            </button>
          )}
        </div>
        
        <Select value={searchField} onValueChange={setSearchField}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Search by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Fields</SelectItem>
            <SelectItem value="email">Email</SelectItem>
            <SelectItem value="storeName">Store Name</SelectItem>
            <SelectItem value="ownerName">Owner Name</SelectItem>
            <SelectItem value="phone">Phone</SelectItem>
            <SelectItem value="city">City</SelectItem>
            <SelectItem value="address">Address</SelectItem>
          </SelectContent>
        </Select>
        
        <div className="flex gap-2">
          <Button type="submit" className="w-full md:w-auto">
            Search
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            onClick={handleReset}
            className="w-full md:w-auto"
          >
            Reset
          </Button>
        </div>
      </form>
    </div>
  )
}

export default StoreSearch
