import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/Button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import api from '../../utils/api';

const EditCourseModal = ({ isOpen, onClose, course, onEditCourse }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [video, setVideo] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (course) {
      setTitle(course.title || '');
      setDescription(course.description || '');
      setPrice(course.price || '');
      setVideo(null); // Reset video input when course changes
    }
  }, [course]);

  const handleFileChange = (e) => {
    setVideo(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    let newVideoUrl = course.videoUrl;

    try {
      if (video) {
        // 1. Get the signed URL for upload from our server
        const { data: { url, id } } = await api.post('/videos/upload');

        // 2. Upload the video file directly to Mux
        await fetch(url, {
          method: 'PUT',
          body: video,
          headers: {
            'Content-Type': video.type,
          },
        });
        newVideoUrl = `https://stream.mux.com/${id}.m3u8`;
      }

      // 3. Update the course in our database
      onEditCourse(course.id, {
        title,
        description,
        price: parseInt(price),
        videoUrl: newVideoUrl,
      });

      onClose();
    } catch (error) {
      console.error('Error updating course:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Course</DialogTitle>
          <DialogDescription>
            Update the details for this course.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price" className="text-right">
                Price
              </Label>
              <Input
                id="price"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="video" className="text-right">
                Video
              </Label>
              <Input
                id="video"
                type="file"
                onChange={handleFileChange}
                className="col-span-3"
                accept="video/*"
              />
            </div>
            {course && course.videoUrl && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Current Video</Label>
                <a href={course.videoUrl} target="_blank" rel="noopener noreferrer" className="col-span-3 text-blue-500 hover:underline truncate">
                  {course.videoUrl.split('/').pop()}
                </a>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button type="submit" disabled={uploading}>
              {uploading ? 'Uploading...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditCourseModal;
