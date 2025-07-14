import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import { 
  fetchCourseById, 
  selectCurrentCourse 
} from "../store/slices/courseSlice";
// import { selectUser } from "../store/slices/authSlice";
import VideoPlayerModern from "../components/VideoPlayerModern";
import { 
  Play, 
  Pause,
  SkipBack,
  SkipForward,
  CheckCircle,
  Circle,
  Clock,
  BookOpen,
  ArrowLeft,
  Menu,
  X,
  Download,
  MessageCircle,
  Star,
  Settings,
  Maximize,
  Volume2,
  ChevronDown,
  ChevronUp,
  FileText,
  Award
} from "lucide-react";

export default function ModernCourseLearning() {
  return (
    <div>
      <h1>Modern Course Learning Page</h1>
      <p>This is a simplified version to test for internal server errors.</p>
    </div>
  );
}
