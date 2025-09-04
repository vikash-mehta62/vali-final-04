import { useEffect, useState } from "react";
import Sidebar from "../layout/Sidebar";
import Navbar from "../layout/Navbar";
import { useNavigate } from "react-router-dom";
import OrdersTable from "@/components/orders/OrdersTable";
import OrderManagementTabs from "@/components/orders/OrderManagementTabs";
import PageHeader from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Plus } from "lucide-react";
import { orders } from "@/lib/data";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import AddMemeber from "./AddMemeber";
import AddMember from "./AddMemeber";
import MembersTable from "./MemberTable";
import { getAllMembersAPI } from "@/services2/operations/auth";

interface Member {
  id: number;
  name?: string;
  phone: string;
  email: string;
  isOrder: boolean;
  isProduct: boolean;
}

const Member = () => {
  const [isMemberOpen, setIsMemberOpen] = useState(false);
  const navigate = useNavigate();

  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  useEffect(() => {
    fetchMembers();
  }, []);
  
  const fetchMembers = async () => {
    setLoading(true);
    try {
      const data = await getAllMembersAPI();
      console.log(data);

      // Filter members with role "member"
      const filteredData = data.filter((member) => member.role === "member");

      const formattedData = filteredData.map(({ _id, ...rest }) => ({
        id: _id,
        ...rest,
      }));

      setMembers(formattedData);
    } catch (error) {
      console.error("Error fetching members:", error);
    } finally {
      setLoading(false);
    }
  };
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  const handleNewOrder = () => {
    navigate("/orders/new");
  };
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar isOpen={isSidebarOpen} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />

        <main className="flex-1 overflow-y-auto bg-muted/30">
          <div className="page-container">
            <PageHeader
              title="Member Management"
              description="Manage member, verify user , and give permission"
            >
              <div className="flex flex-col sm:flex-row gap-2">
                <Button onClick={() => setIsMemberOpen(true)}>
                  <Plus size={16} className="mr-2" />
                  Add Member
                </Button>
              </div>
            </PageHeader>

            <Tabs defaultValue="orders" className="mt-6">
              <TabsContent value="orders">
                <MembersTable
                  loading={loading}
                  members={members}
                  fetchMembers={fetchMembers}
                />
              </TabsContent>

              <TabsContent value="advanced">
                <OrderManagementTabs />
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>

      <Dialog open={isMemberOpen} onOpenChange={setIsMemberOpen}>
        <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              Add New Member
            </DialogTitle>
          </DialogHeader>
          <AddMember
            setIsMemberOpen={setIsMemberOpen}
            fetchMembers={fetchMembers}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Member;
