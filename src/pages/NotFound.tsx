import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    if (import.meta.env.DEV) {
      console.warn("[404] Route not found:", location.pathname);
    }
  }, [location.pathname]);

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4 bg-background px-4">
      <h1 className="text-4xl font-bold text-foreground">404</h1>
      <p className="text-center text-muted-foreground">Page not found</p>
      <a
        href="/"
        className="rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
      >
        Back to home
      </a>
    </div>
  );
};

export default NotFound;
