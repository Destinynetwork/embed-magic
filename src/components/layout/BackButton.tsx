import { ArrowLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface BackButtonProps {
  to?: string;
  label?: string;
  showHome?: boolean;
}

export function BackButton({ to, label = "Back", showHome = false }: BackButtonProps) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (to) {
      navigate(to);
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button variant="ghost" size="sm" onClick={handleBack}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        {label}
      </Button>
      {showHome && (
        <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
          <Home className="h-4 w-4 mr-2" />
          Home
        </Button>
      )}
    </div>
  );
}
