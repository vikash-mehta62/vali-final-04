import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Filter,
  Plus,
  MoreHorizontal,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Send,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { getAllTeamCrmAPI } from "@/services2/operations/crm";
import {
  createTaskCrmAPI,
  getAllTaskCrmAPI,
  deleteTaskCrmAPI,
  updateTaskCrmAPI,
} from "@/services2/operations/task";

// Sample data
// const mockTasks = [
//   {
//     id: "1",
//     title: "Follow up with Acme Corp",
//     description: "Call John Smith regarding their latest order",
//     priority: "medium",
//     status: "pending",
//     progress: 0,
//     assignedTo: "Maria Rodriguez",
//     dueDate: "2024-06-15",
//     createdAt: "2024-05-27",
//     relatedTo: "contact",
//     relatedId: "1",
//     relatedName: "John Smith",
//   },
//   {
//     id: "2",
//     title: "Prepare quote for Tech Innovations",
//     description: "Create a detailed quote for their upcoming event",
//     priority: "high",
//     status: "in-progress",
//     progress: 50,
//     assignedTo: "John Davis",
//     dueDate: "2024-06-02",
//     createdAt: "2024-05-26",
//     relatedTo: "contact",
//     relatedId: "2",
//     relatedName: "Sarah Johnson",
//   },
//   {
//     id: "3",
//     title: "Deliver emergency order to City Retail",
//     description: "Urgent delivery required for weekend event",
//     priority: "urgent",
//     status: "pending",
//     progress: 0,
//     assignedTo: "David Chen",
//     dueDate: "2024-05-31",
//     createdAt: "2024-05-28",
//     relatedTo: "contact",
//     relatedId: "4",
//     relatedName: "Lisa Brown",
//   },
//   {
//     id: "4",
//     title: "Update inventory records",
//     description: "Reconcile inventory after recent deliveries",
//     priority: "low",
//     status: "completed",
//     progress: 100,
//     assignedTo: "Robert Kim",
//     dueDate: "2024-05-25",
//     createdAt: "2024-05-20",
//     relatedTo: "internal",
//     relatedId: "",
//     relatedName: "",
//   },
//   {
//     id: "5",
//     title: "Schedule delivery for Global Solutions",
//     description: "Coordinate with logistics for next week delivery",
//     priority: "medium",
//     status: "in-progress",
//     progress: 25,
//     assignedTo: "Maria Rodriguez",
//     dueDate: "2024-06-10",
//     createdAt: "2024-05-25",
//     relatedTo: "contact",
//     relatedId: "3",
//     relatedName: "Michael Wong",
//   },
// ];

export const TaskForm = ({ task, onSubmit, onCancel, memberId }: any) => {
  const [formData, setFormData] = useState({
    id: task?.id || "",
    title: task?.title || "",
    description: task?.description || "",
    priority: task?.priority || "medium",
    status: task?.status || "pending",
    progress: task?.progress || 0,
    assignedTo: task?.assignedTo || memberId || "",
    dueDate: task?.dueDate || "",
    relatedTo: task?.relatedTo || "internal",
    relatedId: task?.relatedId || "",
    relatedName: task?.relatedName || "",
  });

  const [teamMembers, setTeamMembers] = useState([]);

  useEffect(() => {
    const fetchTeamAll = async () => {
      try {
        const res = await getAllTeamCrmAPI();
        if (res && Array.isArray(res)) {
          // _id ko id me map karna
          const formattedData = res.map((member) => ({
            ...member,
            id: member._id, // _id ko id me convert karna
          }));

          setTeamMembers(formattedData); // setTeamMembers me save karna
        }
      } catch (error) {
        console.error("Error fetching team data:", error);
      }
    };

    fetchTeamAll(); // Function ko call karna zaroori hai
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="title" className="block text-sm font-medium">
          Task Title
        </label>
        <Input
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="description" className="block text-sm font-medium">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          className="w-full px-3 py-2 border rounded-md"
          value={formData.description}
          onChange={handleChange}
        ></textarea>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="priority" className="block text-sm font-medium">
            Priority
          </label>
          <Select
            value={formData.priority}
            onValueChange={(value) => handleSelectChange("priority", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="urgent">Urgent</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label htmlFor="status" className="block text-sm font-medium">
            Status
          </label>
          <Select
            value={formData.status}
            onValueChange={(value) => handleSelectChange("status", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label htmlFor="assignedTo" className="block text-sm font-medium">
            Assigned To
          </label>
          <Select
            value={formData.assignedTo}
            onValueChange={(value) => handleSelectChange("assignedTo", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select team member" />
            </SelectTrigger>
            <SelectContent>
              {teamMembers.map((member) => (
                <SelectItem key={member.id} value={member.id}>
                  {member.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label htmlFor="dueDate" className="block text-sm font-medium">
            Due Date
          </label>
          <Input
            id="dueDate"
            name="dueDate"
            type="date"
            value={formData.dueDate}
            onChange={handleChange}
            required
          />
        </div>

        {formData.status === "in-progress" && (
          <div className="space-y-2 md:col-span-2">
            <label htmlFor="progress" className="block text-sm font-medium">
              Progress ({formData.progress}%)
            </label>
            <Input
              id="progress"
              name="progress"
              type="range"
              min="0"
              max="100"
              value={formData.progress}
              onChange={handleChange}
            />
          </div>
        )}
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">{task ? "Update Task" : "Create Task"}</Button>
      </div>
    </form>
  );
};

const UrgentDispatchForm = ({ onSubmit, onCancel }: any) => {
  const [formData, setFormData] = useState({
    title: "Urgent Dispatch",
    teamMember: "",
    destination: "",
    description: "",
    contactName: "",
    contactPhone: "",
    estimatedTime: "",
  });
  const [teamMembers, setTeamMembers] = useState([]);

  useEffect(() => {
    const fetchTeamAll = async () => {
      try {
        const res = await getAllTeamCrmAPI();
        if (res && Array.isArray(res)) {
          // _id ko id me map karna
          const formattedData = res.map((member) => ({
            ...member,
            id: member._id, // _id ko id me convert karna
          }));

          setTeamMembers(formattedData); // setTeamMembers me save karna
        }
      } catch (error) {
        console.error("Error fetching team data:", error);
      }
    };

    fetchTeamAll(); // Function ko call karna zaroori hai
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Create task object with urgent priority
    const urgentTask = {
      id: "",
      title: `${formData.title}: ${formData.destination}`,
      description: formData.description,
      priority: "urgent",
      status: "pending",
      progress: 0,
      assignedTo: formData.teamMember,
      dueDate: new Date().toISOString().split("T")[0], // Today
      relatedTo: "urgent-dispatch",
      relatedId: "",
      relatedName: formData.contactName,
      contactPhone: formData.contactPhone,
      estimatedTime: formData.estimatedTime,
    };

    onSubmit(urgentTask);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-yellow-50 p-4 rounded-md border border-yellow-200 mb-4">
        <div className="flex items-center text-yellow-800 mb-2">
          <AlertTriangle className="h-5 w-5 mr-2" />
          <h3 className="font-medium">Urgent Dispatch Request</h3>
        </div>
        <p className="text-sm text-yellow-700">
          This will create a high-priority task and immediately notify the
          assigned team member.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="teamMember" className="block text-sm font-medium">
            Team Member to Dispatch
          </label>
          <Select
            value={formData.teamMember}
            onValueChange={(value) => handleSelectChange("teamMember", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select team member" />
            </SelectTrigger>
            <SelectContent>
              {teamMembers.length > 0 &&
                teamMembers?.map((member) => (
                  <SelectItem key={member.id} value={member.name}>
                    {member.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label htmlFor="destination" className="block text-sm font-medium">
            Destination
          </label>
          <Input
            id="destination"
            name="destination"
            value={formData.destination}
            onChange={handleChange}
            placeholder="Enter location"
            required
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <label htmlFor="description" className="block text-sm font-medium">
            Task Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            className="w-full px-3 py-2 border rounded-md"
            value={formData.description}
            placeholder="What needs to be done?"
            onChange={handleChange}
            required
          ></textarea>
        </div>

        <div className="space-y-2">
          <label htmlFor="contactName" className="block text-sm font-medium">
            Contact Person
          </label>
          <Input
            id="contactName"
            name="contactName"
            value={formData.contactName}
            onChange={handleChange}
            placeholder="Name of contact at destination"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="contactPhone" className="block text-sm font-medium">
            Contact Phone
          </label>
          <Input
            id="contactPhone"
            name="contactPhone"
            value={formData.contactPhone}
            onChange={handleChange}
            placeholder="Phone number"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="estimatedTime" className="block text-sm font-medium">
            Estimated Time Needed
          </label>
          <Input
            id="estimatedTime"
            name="estimatedTime"
            value={formData.estimatedTime}
            onChange={handleChange}
            placeholder="e.g. 2 hours"
          />
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" className="bg-yellow-600 hover:bg-yellow-700">
          <Send className="mr-2 h-4 w-4" />
          Dispatch Now
        </Button>
      </div>
    </form>
  );
};

const TasksManager = () => {
  const [tasks, setTasks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [isUrgentDialogOpen, setIsUrgentDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<any>(null);
  const { toast } = useToast();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredTasks = tasks.filter((task) => {
    const searchTerms = searchQuery.toLowerCase();
    const matchesSearch =
      task.title.toLowerCase().includes(searchTerms) ||
      task.description.toLowerCase().includes(searchTerms) ||
      task.assignedTo.toLowerCase().includes(searchTerms);
    if (activeTab === "all") return matchesSearch;
    if (activeTab === "pending")
      return matchesSearch && task.status === "pending";
    if (activeTab === "in-progress")
      return matchesSearch && task.status === "in-progress";
    if (activeTab === "completed")
      return matchesSearch && task.status === "completed";
    if (activeTab === "urgent")
      return matchesSearch && task.priority === "urgent";
    return false;
  });

  const handleAddEditTask = async (data: any) => {
    if (data.id) {
      await updateTaskCrmAPI(data.id, data);
      setTasks((prev) =>
        prev.map((task) => (task.id === data.id ? data : task))
      );
      fetchTask();
      setIsTaskDialogOpen(false);
      setIsUrgentDialogOpen(false);
      setEditingTask(null);
      fetchTask();

      // toast({
      //   title: "Task updated",
      //   description: `"${data.title}" has been updated successfully.`,
      // });
    } else {
      // const newTask = {
      //   ...data,
      //   id: String(tasks.length + 1),
      //   createdAt: new Date().toISOString().split("T")[0],
      // };
      // console.log(newTask);
      const response = await createTaskCrmAPI(data);
      if (response) {
        setIsTaskDialogOpen(false);
        setIsUrgentDialogOpen(false);
        setEditingTask(null);
        fetchTask();
      }
    }
  };

  const handleEdit = (task: any) => {
    setEditingTask(task);
    setIsTaskDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    await deleteTaskCrmAPI(id);
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const handleMarkComplete = async (id: string) => {
    try {
      const completedTask = tasks.find((task) => task.id === id);
      if (!completedTask) return;

      // Call API to update task as completed
      await updateTaskCrmAPI(id, {
        ...completedTask,
        status: "completed",
        progress: 100,
      });

      // Update local state
      setTasks((prev) =>
        prev.map((task) =>
          task.id === id
            ? { ...task, status: "completed", progress: 100 }
            : task
        )
      );

      toast({
        title: "Task completed",
        description: `"${completedTask.title}" has been marked as completed.`,
      });

      // Fetch updated tasks
      fetchTask();
    } catch (error) {
      console.error("Error marking task as complete:", error);
      toast({
        title: "Error",
        description: "Failed to mark the task as completed.",
        variant: "destructive",
      });
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "low":
        return "bg-blue-100 text-blue-800";
      case "medium":
        return "bg-green-100 text-green-800";
      case "high":
        return "bg-orange-100 text-orange-800";
      case "urgent":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4 text-blue-500" />;
      case "in-progress":
        return (
          <div className="h-4 w-4 rounded-full border-2 border-green-500 border-r-transparent animate-spin" />
        );
      case "completed":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      default:
        return null;
    }
  };

  const fetchTask = async () => {
    const response = await getAllTaskCrmAPI();
    if (response) {
      const updatedTasks = response.map((task) => ({
        ...task,
        id: task._id,
      }));
      setTasks(updatedTasks);
    }
  };

  useEffect(() => {
    fetchTask();
  }, []);
  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row gap-4 sm:items-center justify-between pb-2">
        <CardTitle>Tasks Management</CardTitle>
        <div className="flex gap-2">
          <Dialog
            open={isUrgentDialogOpen}
            onOpenChange={setIsUrgentDialogOpen}
          >
            <DialogTrigger asChild>
              {/* <Button variant="destructive">
                <Send className="mr-2 h-4 w-4" />
                Urgent Dispatch
              </Button> */}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
              <DialogHeader>
                <DialogTitle>Urgent Dispatch</DialogTitle>
              </DialogHeader>
              <UrgentDispatchForm
                onSubmit={handleAddEditTask}
                onCancel={() => setIsUrgentDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>

          <Dialog open={isTaskDialogOpen} onOpenChange={setIsTaskDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditingTask(null)}>
                <Plus className="mr-2 h-4 w-4" />
                New Task
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
              <DialogHeader>
                <DialogTitle>
                  {editingTask ? "Edit Task" : "Create Task"}
                </DialogTitle>
              </DialogHeader>
              <TaskForm
                task={editingTask}
                onSubmit={handleAddEditTask}
                onCancel={() => setIsTaskDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex flex-col sm:flex-row gap-4 mb-4 items-start">
            <TabsList className="mb-2 sm:mb-0">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="in-progress">In Progress</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="urgent">Urgent</TabsTrigger>
            </TabsList>

            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tasks..."
                className="pl-8"
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>

            <Button variant="outline" className="shrink-0">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
          </div>

          <TabsContent value="all" className="mt-0">
            <TasksTable
              tasks={tasks}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onMarkComplete={handleMarkComplete}
              getPriorityColor={getPriorityColor}
              getStatusIcon={getStatusIcon}
            />
          </TabsContent>

          <TabsContent value="pending" className="mt-0">
            <TasksTable
              tasks={filteredTasks}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onMarkComplete={handleMarkComplete}
              getPriorityColor={getPriorityColor}
              getStatusIcon={getStatusIcon}
            />
          </TabsContent>

          <TabsContent value="in-progress" className="mt-0">
            <TasksTable
              tasks={filteredTasks}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onMarkComplete={handleMarkComplete}
              getPriorityColor={getPriorityColor}
              getStatusIcon={getStatusIcon}
            />
          </TabsContent>

          <TabsContent value="completed" className="mt-0">
            <TasksTable
              tasks={filteredTasks}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onMarkComplete={handleMarkComplete}
              getPriorityColor={getPriorityColor}
              getStatusIcon={getStatusIcon}
            />
          </TabsContent>

          <TabsContent value="urgent" className="mt-0">
            <TasksTable
              tasks={filteredTasks}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onMarkComplete={handleMarkComplete}
              getPriorityColor={getPriorityColor}
              getStatusIcon={getStatusIcon}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

const TasksTable = ({
  tasks,
  onEdit,
  onDelete,
  onMarkComplete,
  getPriorityColor,
  getStatusIcon,
}: any) => {
  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-b ">
            <TableHead className=" text-center">Task</TableHead>
            <TableHead className=" text-center">Description</TableHead>
            <TableHead className=" text-center hidden md:table-cell">
              Assigned To
            </TableHead>
            <TableHead className=" text-center hidden md:table-cell">
              Due Date
            </TableHead>
            <TableHead className=" text-center hidden md:table-cell">
              Status
            </TableHead>
            <TableHead className=" text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={6}
                className="text-center h-32 text-muted-foreground"
              >
                No tasks found
              </TableCell>
            </TableRow>
          ) : (
            tasks.map((task: any) => (
              <TableRow key={task.id} className="border-b align-middle">
                <TableCell className="align-middle">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{task.title}</span>
                    <Badge
                      className={`text-xs ${getPriorityColor(task.priority)}`}
                    >
                      {task.priority}
                    </Badge>
                  </div>
                  {task.status === "in-progress" && (
                    <Progress
                      value={task.progress}
                      className="h-1 mt-1 w-full"
                    />
                  )}
                </TableCell>
                <TableCell className="align-middle">
                  <p className="text-sm text-muted-foreground truncate">
                    {task.description}
                  </p>
                </TableCell>
                <TableCell className="align-middle hidden md:table-cell truncate">
                  {task?.assignedTo?.name}
                </TableCell>
                <TableCell className="align-middle hidden md:table-cell">
                  {new Date(task.dueDate).toLocaleDateString()}
                </TableCell>
                <TableCell className="align-middle hidden md:table-cell">
                  <div className="flex items-center gap-1">
                    {getStatusIcon(task.status)}
                    <span className="capitalize">
                      {task.status.replace("-", " ")}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="align-middle text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {task.status !== "completed" && (
                        <DropdownMenuItem
                          onClick={() => onMarkComplete(task.id)}
                        >
                          <CheckCircle2 className="mr-2 h-4 w-4" />
                          Mark as Complete
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem onClick={() => onEdit(task)}>
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => onDelete(task.id)}
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default TasksManager;
