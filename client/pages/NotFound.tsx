import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <Layout>
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center max-w-md">
          <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
          <p className="text-xl text-gray-600 mb-6">Oops! Page not found</p>
          <Link to="/" className="inline-block px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-orange-600 transition-colors">
            Return to Dashboard
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;
