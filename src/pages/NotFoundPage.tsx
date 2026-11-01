import { useNavigate } from "react-router-dom";
import { Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";

export function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-background px-6 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gold-500/10">
        <Compass className="h-7 w-7 text-gold-400" />
      </div>
      <h1 className="font-display text-2xl font-semibold">Page not found</h1>
      <p className="max-w-xs text-sm text-muted-foreground">
        The page you're looking for doesn't exist or has moved.
      </p>
      <Button variant="gold" onClick={() => navigate(ROUTES.dashboard)}>
        Back to Dashboard
      </Button>
    </div>
  );
}
export default NotFoundPage;
