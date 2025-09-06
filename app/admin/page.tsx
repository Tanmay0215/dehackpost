"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Plus,
  Edit,
  Trash2,
  Users,
  Trophy,
  Code,
  Search,
  RefreshCw,
} from "lucide-react";
import { useAuth } from "@/lib/auth/useAuth";
import { IHackathon } from "@/lib/models/hackathon";
import { UserProfile } from "@/lib/auth/types";
import { IProject } from "@/lib/models/project";
import { isSystemAdminAddress } from "@/lib/admin/utils";

interface ApiResponse<T> {
  [key: string]: T[];
}

export default function AdminDashboard() {
  const { user, isAuthenticated } = useAuth();
  const [hackathons, setHackathons] = useState<IHackathon[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [projects, setProjects] = useState<IProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTab, setSelectedTab] = useState("hackathons");
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminCheckLoading, setAdminCheckLoading] = useState(true);

  // Dialog states
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [editingType, setEditingType] = useState<
    "hackathon" | "user" | "project"
  >("hackathon");

  useEffect(() => {
    if (isAuthenticated && user?.address) {
      // Check if user is system admin
      const adminStatus = isSystemAdminAddress(user.address);
      setIsAdmin(adminStatus);
      setAdminCheckLoading(false);

      if (adminStatus) {
        fetchAllData();
      }
    } else {
      setAdminCheckLoading(false);
    }
  }, [isAuthenticated, user]);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([fetchHackathons(), fetchUsers(), fetchProjects()]);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setLoading(false);
  };

  const fetchHackathons = async () => {
    try {
      const response = await fetch("/api/admin/hackathons");
      if (response.ok) {
        const data: ApiResponse<IHackathon> = await response.json();
        setHackathons(data.hackathons || []);
      }
    } catch (error) {
      console.error("Error fetching hackathons:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/admin/users");
      if (response.ok) {
        const data: ApiResponse<UserProfile> = await response.json();
        setUsers(data.users || []);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await fetch("/api/admin/projects");
      if (response.ok) {
        const data: ApiResponse<IProject> = await response.json();
        setProjects(data.projects || []);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  const handleEdit = (item: any, type: "hackathon" | "user" | "project") => {
    setEditingItem({ ...item });
    setEditingType(type);
    setEditDialogOpen(true);
  };

  const handleSave = async () => {
    try {
      // Validate required fields
      if (editingType === "hackathon") {
        if (!editingItem.name?.trim()) {
          alert("Hackathon name is required");
          return;
        }
        if (!editingItem.description?.trim()) {
          alert("Hackathon description is required");
          return;
        }
        if (!editingItem.creator?.trim()) {
          alert("Creator address is required");
          return;
        }
      } else if (editingType === "user") {
        if (!editingItem.address?.trim()) {
          alert("User address is required");
          return;
        }
      } else if (editingType === "project") {
        if (!editingItem.title?.trim()) {
          alert("Project title is required");
          return;
        }
        if (!editingItem.hackathonId?.trim()) {
          alert("Hackathon ID is required");
          return;
        }
      }

      let url = "";
      let method = "PUT";
      let itemToSave = { ...editingItem };

      // Check if this is a new item (no ID) or existing item
      const isNewItem = !editingItem.id && !editingItem.address;

      if (editingType === "hackathon") {
        if (isNewItem) {
          // Generate a unique ID for new hackathons
          itemToSave.id = `hackathon-${Date.now()}-${Math.random()
            .toString(36)
            .substr(2, 9)}`;
          url = `/api/admin/hackathons`;
          method = "POST";
        } else {
          url = `/api/admin/hackathons/${editingItem.id}`;
        }
      } else if (editingType === "user") {
        if (isNewItem) {
          url = `/api/admin/users`;
          method = "POST";
        } else {
          url = `/api/admin/users/${editingItem.address}`;
        }
      } else {
        if (isNewItem) {
          // Generate a unique ID for new projects
          itemToSave.id = `project-${Date.now()}-${Math.random()
            .toString(36)
            .substr(2, 9)}`;
          url = `/api/admin/projects`;
          method = "POST";
        } else {
          url = `/api/admin/projects/${editingItem.id}`;
        }
      }

      // Add default values for required fields if creating new hackathon
      if (editingType === "hackathon" && isNewItem) {
        itemToSave = {
          ...itemToSave,
          tracks: itemToSave.tracks || [],
          prizes: itemToSave.prizes || [],
          roles: itemToSave.roles || {
            admins: [user?.address || ""],
            organizers: [],
            judges: [],
            participants: [],
          },
          schedule: itemToSave.schedule || {
            start: new Date().toISOString(),
            end: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          },
          projectsCID: itemToSave.projectsCID || [],
          createdAt: new Date().toISOString(),
        };
      }

      console.log("Saving item:", { method, url, itemToSave });

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          // Add wallet address to headers for admin verification
          "X-Wallet-Address": user?.address || "",
        },
        body: JSON.stringify(itemToSave),
      });

      if (response.ok) {
        await fetchAllData();
        setEditDialogOpen(false);
        setEditingItem(null);
      } else {
        const errorData = await response.text();
        console.error("Save failed:", response.status, errorData);
        alert(`Save failed: ${response.status} - ${errorData}`);
      }
    } catch (error) {
      console.error("Error saving item:", error);
      alert(`Error saving item: ${error}`);
    }
  };

  const handleDelete = async (
    id: string,
    type: "hackathon" | "user" | "project"
  ) => {
    try {
      let url = "";

      if (type === "hackathon") {
        url = `/api/admin/hackathons/${id}`;
      } else if (type === "user") {
        url = `/api/admin/users/${id}`;
      } else {
        url = `/api/admin/projects/${id}`;
      }

      const response = await fetch(url, { method: "DELETE" });

      if (response.ok) {
        await fetchAllData();
      }
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const filteredHackathons = hackathons.filter(
    (h) =>
      h.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredUsers = users.filter(
    (u) =>
      u.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.profile?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.profile?.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredProjects = projects.filter(
    (p) =>
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.team.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (adminCheckLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card>
          <CardHeader>
            <CardTitle>Loading...</CardTitle>
            <CardDescription>Checking admin permissions...</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Please connect your wallet to access the admin dashboard
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card>
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>
              You don't have admin privileges. Only system administrators can
              access this dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">
              Connected as: <span className="font-mono">{user?.address}</span>
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Button onClick={fetchAllData} disabled={loading}>
          <RefreshCw
            className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="hackathons" className="flex items-center gap-2">
            <Trophy className="h-4 w-4" />
            Hackathons ({hackathons.length})
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Users ({users.length})
          </TabsTrigger>
          <TabsTrigger value="projects" className="flex items-center gap-2">
            <Code className="h-4 w-4" />
            Projects ({projects.length})
          </TabsTrigger>
        </TabsList>

        {/* Hackathons Tab */}
        <TabsContent value="hackathons">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Hackathons Management</CardTitle>
                  <CardDescription>
                    Manage all hackathons in the system
                  </CardDescription>
                </div>
                <Button
                  onClick={() =>
                    handleEdit(
                      {
                        name: "",
                        description: "",
                        creator: user?.address || "",
                        status: "upcoming",
                      },
                      "hackathon"
                    )
                  }
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Hackathon
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Creator</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>End Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredHackathons.map((hackathon) => (
                    <TableRow key={hackathon.id}>
                      <TableCell className="font-medium">
                        {hackathon.name}
                      </TableCell>
                      <TableCell>
                        {hackathon.creator.slice(0, 6)}...
                        {hackathon.creator.slice(-4)}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            hackathon.status === "ongoing"
                              ? "bg-green-100 text-green-800"
                              : hackathon.status === "upcoming"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {hackathon.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        {new Date(
                          hackathon.schedule.start
                        ).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {new Date(hackathon.schedule.end).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(hackathon, "hackathon")}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button size="sm" variant="destructive">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Delete Hackathon
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete "
                                  {hackathon.name}"? This action cannot be
                                  undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() =>
                                    handleDelete(hackathon.id, "hackathon")
                                  }
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>Users Management</CardTitle>
              <CardDescription>Manage all users in the system</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Address</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Experience</TableHead>
                    <TableHead>Hackathons</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.address}>
                      <TableCell className="font-mono text-sm">
                        {user.address.slice(0, 6)}...{user.address.slice(-4)}
                      </TableCell>
                      <TableCell>{user.profile?.name || "N/A"}</TableCell>
                      <TableCell>{user.profile?.email || "N/A"}</TableCell>
                      <TableCell>{user.experience || "N/A"}</TableCell>
                      <TableCell>
                        {user.stats?.hackathonsParticipated || 0}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(user, "user")}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button size="sm" variant="destructive">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete User</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete this user?
                                  This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() =>
                                    handleDelete(user.address, "user")
                                  }
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Projects Tab */}
        <TabsContent value="projects">
          <Card>
            <CardHeader>
              <CardTitle>Projects Management</CardTitle>
              <CardDescription>
                Manage all projects in the system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Team</TableHead>
                    <TableHead>Hackathon</TableHead>
                    <TableHead>Submission Date</TableHead>
                    <TableHead>Members</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProjects.map((project) => (
                    <TableRow key={project.id}>
                      <TableCell className="font-medium">
                        {project.title}
                      </TableCell>
                      <TableCell>{project.team.name}</TableCell>
                      <TableCell>{project.hackathonId}</TableCell>
                      <TableCell>
                        {new Date(project.submissionDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{project.team.members.length}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(project, "project")}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button size="sm" variant="destructive">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Delete Project
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete "
                                  {project.title}"? This action cannot be
                                  undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() =>
                                    handleDelete(project.id, "project")
                                  }
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingItem?.id ? "Edit" : "Create"}{" "}
              {editingType.charAt(0).toUpperCase() + editingType.slice(1)}
            </DialogTitle>
            <DialogDescription>
              Make changes to the {editingType} details below.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {editingType === "hackathon" && editingItem && (
              <>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    value={editingItem.name || ""}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, name: e.target.value })
                    }
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    value={editingItem.description || ""}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        description: e.target.value,
                      })
                    }
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="creator" className="text-right">
                    Creator
                  </Label>
                  <Input
                    id="creator"
                    value={editingItem.creator || ""}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        creator: e.target.value,
                      })
                    }
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="status" className="text-right">
                    Status
                  </Label>
                  <Select
                    value={editingItem.status || "upcoming"}
                    onValueChange={(value) =>
                      setEditingItem({ ...editingItem, status: value })
                    }
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="upcoming">Upcoming</SelectItem>
                      <SelectItem value="ongoing">Ongoing</SelectItem>
                      <SelectItem value="ended">Ended</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            {editingType === "user" && editingItem && (
              <>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="address" className="text-right">
                    Address
                  </Label>
                  <Input
                    id="address"
                    value={editingItem.address || ""}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        address: e.target.value,
                      })
                    }
                    className="col-span-3"
                    disabled={!!editingItem.id}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    value={editingItem.profile?.name || ""}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        profile: {
                          ...editingItem.profile,
                          name: e.target.value,
                        },
                      })
                    }
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">
                    Email
                  </Label>
                  <Input
                    id="email"
                    value={editingItem.profile?.email || ""}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        profile: {
                          ...editingItem.profile,
                          email: e.target.value,
                        },
                      })
                    }
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="experience" className="text-right">
                    Experience
                  </Label>
                  <Select
                    value={editingItem.experience || "beginner"}
                    onValueChange={(value) =>
                      setEditingItem({ ...editingItem, experience: value })
                    }
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            {editingType === "project" && editingItem && (
              <>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="title" className="text-right">
                    Title
                  </Label>
                  <Input
                    id="title"
                    value={editingItem.title || ""}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, title: e.target.value })
                    }
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    value={editingItem.description || ""}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        description: e.target.value,
                      })
                    }
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="teamName" className="text-right">
                    Team Name
                  </Label>
                  <Input
                    id="teamName"
                    value={editingItem.team?.name || ""}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        team: { ...editingItem.team, name: e.target.value },
                      })
                    }
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="hackathonId" className="text-right">
                    Hackathon ID
                  </Label>
                  <Input
                    id="hackathonId"
                    value={editingItem.hackathonId || ""}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        hackathonId: e.target.value,
                      })
                    }
                    className="col-span-3"
                  />
                </div>
              </>
            )}
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save Changes</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
