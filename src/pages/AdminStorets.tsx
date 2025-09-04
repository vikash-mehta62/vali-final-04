"use client"

import React, { useState, useEffect } from "react"
import Navbar from "@/components/layout/Navbar"
import Sidebar from "@/components/layout/Sidebar"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { Plus } from 'lucide-react'
import PageHeader from "@/components/shared/PageHeader"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog"
import StoreRegistration from "./StoreRegistration"
import { getAllMembersAPI, userWithOrderDetails } from "@/services2/operations/auth"
import StoreTable from "@/components/admin/StoreTable"
import StoreSearch from "@/components/admin/StoreSerach"
import { useSelector } from "react-redux"
import { RootState } from "@/redux/store"

const AdminStorets = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isGroupOpen, setIsGroupOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [allStores, setAllStores] = useState([])
  const [filteredStores, setFilteredStores] = useState([])
  const [searchActive, setSearchActive] = useState(false)
  const user = useSelector((state: RootState) => state.auth?.user ?? null)

  const fetchStores = async () => {
    setLoading(true)
    try {
      const data = await getAllMembersAPI()
      const filteredData = data.filter((store) => store.role === "store")

      const formattedData = filteredData.map(({ _id, ...rest }) => ({
        id: _id,
        ...rest,
      }))

      setAllStores(formattedData)
      setFilteredStores(formattedData)
    } catch (error) {
      console.error("Error fetching members:", error)
    } finally {
      setLoading(false)
    }
  }

  // Fetch groups on component mount
  useEffect(() => {
    fetchStores()
  }, [])

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const handleSearch = (query: string, field: string) => {
    if (!query.trim()) {
      setFilteredStores(allStores)
      setSearchActive(false)
      return
    }

    setSearchActive(true)
    const lowercaseQuery = query.toLowerCase()
    
    const filtered = allStores.filter((store) => {
      if (field === "all") {
        // Search across all searchable fields
        return (
          (store.email && store.email.toLowerCase().includes(lowercaseQuery)) ||
          (store.storeName && store.storeName.toLowerCase().includes(lowercaseQuery)) ||
          (store.ownerName && store.ownerName.toLowerCase().includes(lowercaseQuery)) ||
          (store.phone && store.phone.toLowerCase().includes(lowercaseQuery)) ||
          (store.city && store.city.toLowerCase().includes(lowercaseQuery)) ||
          (store.address && store.address.toLowerCase().includes(lowercaseQuery))
        )
      } else {
        // Search in specific field
        return store[field] && store[field].toLowerCase().includes(lowercaseQuery)
      }
    })

    setFilteredStores(filtered)
  }

  const resetSearch = () => {
    setFilteredStores(allStores)
    setSearchActive(false)
  }

  return (
    <div>
      <div className="flex h-screen overflow-hidden">
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        <div className="flex-1 flex flex-col overflow-hidden">
          <Navbar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />

          <main className="flex-1 overflow-y-auto bg-muted/30">
            <div className="page-container max-w-full px-4 py-4">
              <PageHeader
                title="Store Management"
                description="Manage stores, verify stores, and give permissions"
              >
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button onClick={() => setIsGroupOpen(true)}>
                    <Plus size={16} className="mr-2" />
                    Add Store
                  </Button>
                </div>
              </PageHeader>

              <Tabs defaultValue="orders" className="mt-6">
                <TabsContent value="orders">
                  <StoreSearch onSearch={handleSearch} onReset={resetSearch} />
                  
                  {searchActive && (
                    <div className="mb-4 px-1">
                      <p className="text-sm text-gray-600">
                        Found {filteredStores.length} {filteredStores.length === 1 ? 'store' : 'stores'}
                      </p>
                    </div>
                  )}
                  
                  <StoreTable
                    loading={loading}
                    groups={filteredStores}
                    fetchStores={fetchStores}
                  />
                </TabsContent>
              </Tabs>
            </div>
          </main>
        </div>
      </div>
      <Dialog open={isGroupOpen} onOpenChange={setIsGroupOpen}>
        <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              Add New Store
            </DialogTitle>
          </DialogHeader>
          <StoreRegistration
            setIsGroupOpen={(value: boolean) => setIsGroupOpen(value)}
            isEdit={false}
            groups={null}
            fetchStores={fetchStores}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default AdminStorets
