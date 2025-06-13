import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const ErrorPage = ({
  title = "Something went wrong",
  message = "An unexpected error occurred. Please try again later.",
  showRetry = true,
  showHome = true,
  onRetry,
}) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[400px] flex items-center justify-center p-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="flex justify-center">
          <div className="rounded-full bg-red-100 p-3">
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          <p className="text-gray-600">{message}</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {showRetry && (
            <Button
              onClick={onRetry}
              variant="outline"
              className="w-full sm:w-auto"
            >
              Try Again
            </Button>
          )}
          {showHome && (
            <Button onClick={() => navigate("/")} className="w-full sm:w-auto">
              Go to Home
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
