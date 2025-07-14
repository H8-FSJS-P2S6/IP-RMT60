import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import api from "../utils/api";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  User,
  Lock,
  Mail,
  Phone,
  MapPin,
  BookOpen,
  CreditCard,
  Calendar,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  LogOut,
  LayoutDashboard,
  ShoppingCart,
} from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { Progress } from "@/components/ui/Progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";

const fetchOrders = async () => {
  const { data } = await api.get("/orders");
  return data;
};

const fetchEnrolledCourses = async () => {
  const { data } = await api.get("/enrollments");
  return data;
};

const updateProfile = async (profileData) => {
  const { data } = await api.put("/users/profile", profileData);
  return data;
};

const updatePassword = async (passwordData) => {
  const { data } = await api.put("/users/password", passwordData);
  return data;
};

export default function UserProfile() {
  const { user, logout } = useAuth();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("profile");
  const [profileData, setProfileData] = useState({
    username: user?.username || "",
    email: user?.email || "",
    phoneNumber: user?.phoneNumber || "",
    address: user?.address || ""
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { data: orders, isLoading: ordersLoading, isError: ordersError } = useQuery({
    queryKey: ["orders"],
    queryFn: fetchOrders,
  });

  const { data: enrolledCourses, isLoading: coursesLoading, isError: coursesError } = useQuery({
    queryKey: ["enrolledCourses"],
    queryFn: fetchEnrolledCourses,
  });

  const profileMutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: (data) => {
      queryClient.invalidateQueries(["profile"]);
      // Optionally update local user state if necessary
      // This part depends on how your useAuth hook manages user state
      console.log("Profile updated:", data);
      alert("Profile updated successfully!");
    },
    onError: (error) => {
      console.error("Profile update failed:", error);
      alert("Failed to update profile: " + (error.response?.data?.message || error.message));
    },
  });

  const passwordMutation = useMutation({
    mutationFn: updatePassword,
    onSuccess: () => {
      alert("Password updated successfully!");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
    },
    onError: (error) => {
      console.error("Password update failed:", error);
      alert("Failed to update password: " + (error.response?.data?.message || error.message));
    },
  });

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    profileMutation.mutate(profileData);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("New password and confirm password do not match.");
      return;
    }
    passwordMutation.mutate({
      currentPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword,
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  const formatToIDR = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">My Account</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="md:col-span-1">
          <CardContent className="p-4">
            <div className="flex items-center mb-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={user?.avatar || ""} />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {user?.username?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="ml-3">
                <CardTitle className="text-lg">{user?.username}</CardTitle>
                <CardDescription className="text-sm">{user?.email}</CardDescription>
              </div>
            </div>

            <Tabs defaultValue="profile" orientation="vertical" className="space-y-2">
              <TabsList className="flex flex-col items-start h-auto p-0">
                <TabsTrigger value="profile" className="w-full justify-start data-[state=active]:bg-muted data-[state=active]:text-primary">
                  <User className="mr-2 h-4 w-4" /> Profile
                </TabsTrigger>
                <TabsTrigger value="password" className="w-full justify-start data-[state=active]:bg-muted data-[state=active]:text-primary">
                  <Lock className="mr-2 h-4 w-4" /> Change Password
                </TabsTrigger>
                <TabsTrigger value="orders" className="w-full justify-start data-[state=active]:bg-muted data-[state=active]:text-primary">
                  <ShoppingCart className="mr-2 h-4 w-4" /> Order History
                </TabsTrigger>
                <TabsTrigger value="courses" className="w-full justify-start data-[state=active]:bg-muted data-[state=active]:text-primary">
                  <BookOpen className="mr-2 h-4 w-4" /> My Courses
                </TabsTrigger>
                {user?.role === "Admin" && (
                  <Link to="/admin/dashboard" className="w-full">
                    <Button variant="ghost" className="w-full justify-start">
                      <LayoutDashboard className="mr-2 h-4 w-4" /> Admin Dashboard
                    </Button>
                  </Link>
                )}
                <Button variant="ghost" onClick={logout} className="w-full justify-start text-destructive hover:text-destructive">
                  <LogOut className="mr-2 h-4 w-4" /> Logout
                </Button>
              </TabsList>
            </Tabs>
          </CardContent>
        </Card>

        <div className="md:col-span-3">
          <Tabs defaultValue="profile" value={activeTab} onValueChange={setActiveTab}>
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>Update your account's profile information.</CardDescription>
                </CardHeader>
                <CardContent>
                  {profileMutation.isSuccess && (
                    <div className="bg-green-100 text-green-700 p-3 rounded-md mb-4">
                      Profile updated successfully!
                    </div>
                  )}
                  {profileMutation.isError && (
                    <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4">
                      Failed to update profile: {profileMutation.error.response?.data?.message || profileMutation.error.message}
                    </div>
                  )}
                  <form onSubmit={handleProfileSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="username">Username</Label>
                        <Input
                          id="username"
                          name="username"
                          value={profileData.username}
                          onChange={handleProfileChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={profileData.email}
                          disabled
                        />
                        <p className="text-sm text-muted-foreground">Email cannot be changed.</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phoneNumber">Phone Number</Label>
                        <Input
                          id="phoneNumber"
                          name="phoneNumber"
                          value={profileData.phoneNumber}
                          onChange={handleProfileChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="address">Address</Label>
                        <Textarea
                          id="address"
                          name="address"
                          rows="3"
                          value={profileData.address}
                          onChange={handleProfileChange}
                        ></Textarea>
                      </div>
                    </div>
                    <Button type="submit" disabled={profileMutation.isLoading}>
                      {profileMutation.isLoading ? "Saving..." : "Save Changes"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="password">
              <Card>
                <CardHeader>
                  <CardTitle>Change Password</CardTitle>
                  <CardDescription>Update your account's password.</CardDescription>
                </CardHeader>
                <CardContent>
                  {passwordMutation.isSuccess && (
                    <div className="bg-green-100 text-green-700 p-3 rounded-md mb-4">
                      Password updated successfully!
                    </div>
                  )}
                  {passwordMutation.isError && (
                    <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4">
                      Failed to update password: {passwordMutation.error.response?.data?.message || passwordMutation.error.message}
                    </div>
                  )}
                  <form onSubmit={handlePasswordSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <Input
                        id="currentPassword"
                        name="currentPassword"
                        type="password"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <div className="relative">
                        <Input
                          id="newPassword"
                          name="newPassword"
                          type={showNewPassword ? "text" : "password"}
                          value={passwordData.newPassword}
                          onChange={handlePasswordChange}
                          required
                          minLength="6"
                          className="pr-10"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-1"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                        >
                          {showNewPassword ? <Eye className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground">Password must be at least 6 characters long.</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <div className="relative">
                        <Input
                          id="confirmPassword"
                          name="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          value={passwordData.confirmPassword}
                          onChange={handlePasswordChange}
                          required
                          className="pr-10"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-1"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? <Eye className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                    <Button type="submit" disabled={passwordMutation.isLoading}>
                      {passwordMutation.isLoading ? "Updating..." : "Update Password"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="orders">
              <Card>
                <CardHeader>
                  <CardTitle>Order History</CardTitle>
                  <CardDescription>View your past orders.</CardDescription>
                </CardHeader>
                <CardContent>
                  {ordersLoading ? (
                    <div className="text-center py-4">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                      <p className="text-muted-foreground">Loading orders...</p>
                    </div>
                  ) : ordersError ? (
                    <div className="bg-red-100 text-red-700 p-3 rounded-md">
                      Failed to fetch order history: {ordersError.message}
                    </div>
                  ) : orders?.length === 0 ? (
                    <div className="text-center py-4">
                      <ShoppingCart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-xl font-semibold mb-2">No Orders Yet</h3>
                      <p className="text-muted-foreground">You haven't placed any orders yet.</p>
                      <Button asChild className="mt-4">
                        <Link to="/courses">Browse Courses</Link>
                      </Button>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Order ID</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Items</TableHead>
                          <TableHead>Total</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {orders?.map((order) => (
                          <TableRow key={order.id}>
                            <TableCell className="font-medium">#{order.id}</TableCell>
                            <TableCell>{formatDate(order.createdAt)}</TableCell>
                            <TableCell>{order.items?.length || 0}</TableCell>
                            <TableCell>{formatToIDR(order.totalAmount)}</TableCell>
                            <TableCell>
                              <Badge variant={order.status === "completed" ? "default" : "secondary"}>
                                {order.status}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="courses">
              <Card>
                <CardHeader>
                  <CardTitle>My Courses</CardTitle>
                  <CardDescription>View your enrolled courses.</CardDescription>
                </CardHeader>
                <CardContent>
                  {coursesLoading ? (
                    <div className="text-center py-4">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                      <p className="text-muted-foreground">Loading courses...</p>
                    </div>
                  ) : coursesError ? (
                    <div className="bg-red-100 text-red-700 p-3 rounded-md">
                      Failed to fetch enrolled courses: {coursesError.message}
                    </div>
                  ) : enrolledCourses?.length === 0 ? (
                    <div className="text-center py-4">
                      <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-xl font-semibold mb-2">No Enrolled Courses</h3>
                      <p className="text-muted-foreground">You haven't enrolled in any courses yet.</p>
                      <Button asChild className="mt-4">
                        <Link to="/courses">Browse Courses</Link>
                      </Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {enrolledCourses?.map((enrollment) => (
                        <Card key={enrollment.id}>
                          <CardHeader>
                            <CardTitle className="text-lg">{enrollment.Lecture.name}</CardTitle>
                            <CardDescription>{enrollment.Lecture.technique}</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="flex justify-between items-center text-sm text-muted-foreground mb-2">
                              <span>Enrolled on {formatDate(enrollment.createdAt)}</span>
                              <Badge variant="secondary">Enrolled</Badge>
                            </div>
                            <div className="text-sm text-muted-foreground mb-2">
                              Progress: {enrollment.progress || 0}% complete
                            </div>
                            <Progress value={enrollment.progress || 0} className="w-full" />
                          </CardContent>
                          <CardFooter className="flex flex-col gap-2">
                            <Button asChild className="w-full">
                              <Link to={`/courses/${enrollment.LectureId}`}>Continue Learning</Link>
                            </Button>
                            <Button variant="outline" className="w-full">
                              Contact Instructor
                            </Button>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}