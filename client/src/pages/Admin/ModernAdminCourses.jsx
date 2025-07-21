import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import api from '../../utils/api';
import { useState } from 'react';
import AddCourseModal from '../../components/Admin/AddCourseModal';
import EditCourseModal from '../../components/Admin/EditCourseModal';

const fetchCourses = async () => {
  const { data } = await api.get('/admin/lectures'); // Assuming /admin/lectures is the endpoint for courses
  return data;
};

const ModernAdminCourses = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  const { data: courses, isLoading, isError } = useQuery({
    queryKey: ['adminCourses'],
    queryFn: fetchCourses,
  });

  const { mutate: addCourse } = useMutation({
    mutationFn: async (newCourse) => {
      const { data } = await api.post('/admin/lectures', newCourse);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries('adminCourses');
      setIsModalOpen(false);
    },
  });

  const { mutate: deleteCourse } = useMutation({
    mutationFn: async (id) => {
      await api.delete(`/admin/lectures/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries('adminCourses');
    },
  });

  const { mutate: editCourse } = useMutation({
    mutationFn: async ({ id, updatedCourse }) => {
      const { data } = await api.put(`/admin/lectures/${id}`, updatedCourse);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries('adminCourses');
      setIsEditModalOpen(false);
    },
  });

  if (isLoading) {
    return <div>Loading courses...</div>;
  }

  if (isError) {
    return <div>Error fetching courses.</div>;
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold">Courses Management</CardTitle>
          <Button size="sm" className="h-8 gap-1" onClick={() => setIsModalOpen(true)}>
            <PlusCircle className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Add Course
            </span>
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {courses.map((course) => (
                <TableRow key={course.id}>
                  <TableCell className="font-medium">{course.title}</TableCell>
                  <TableCell>{course.Category.name}</TableCell>
                  <TableCell>Rp{course.price}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      course.status === 'Published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {course.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      className="mr-2"
                      onClick={() => {
                        setSelectedCourse(course);
                        setIsEditModalOpen(true);
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteCourse(course.id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <AddCourseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddCourse={addCourse}
      />
      <EditCourseModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        course={selectedCourse}
        onEditCourse={editCourse}
      />
    </>
  );
};

export default ModernAdminCourses;
