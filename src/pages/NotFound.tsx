
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Logo from "@/components/Logo";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b py-4 px-6">
        <div className="container mx-auto">
          <Logo />
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center">
        <div className="text-center space-y-6 max-w-md px-4">
          <h1 className="text-6xl font-bold text-primary">404</h1>
          <h2 className="text-2xl font-semibold">Page Not Found</h2>
          <p className="text-muted-foreground">
            The page you are looking for doesn't exist or has been moved.
          </p>
          <Button onClick={() => navigate("/")}>
            Go Back Home
          </Button>
        </div>
      </main>
    </div>
  );
};

export default NotFound;
