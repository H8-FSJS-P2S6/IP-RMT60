import { ClipLoader } from "react-spinners";

export const LoadingSpinner = ({ loading }) => (
  <div className="flex justify-center items-center h-32">
    <ClipLoader color="#3b82f6" loading={loading} size={35} />
  </div>
);
