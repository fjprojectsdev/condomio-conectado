import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface NavigationProps {
  title: string;
  showBack?: boolean;
}

export const Navigation = ({ title, showBack = true }: NavigationProps) => {
  const navigate = useNavigate();

  return (
    <div className="sticky top-0 z-10 bg-gradient-primary p-4 shadow-elevated">
      <div className="flex items-center gap-3">
        {showBack && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="text-primary-foreground hover:bg-white/20 p-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        )}
        <h1 className="text-xl font-semibold text-primary-foreground">
          {title}
        </h1>
      </div>
    </div>
  );
};