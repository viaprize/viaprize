import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip";

interface ToolTipSimpleProps {
  children: React.ReactNode;
  content: string;
  className?: string;
  duration?: number;
  position?: "top" | "right" | "bottom" | "left";
}

export default function ToolTipSimple({
  children,
  content,
  className,
  duration = 0,
  position = "top",
}: ToolTipSimpleProps) {
  return (
    <TooltipProvider delayDuration={duration}>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent side={position} className={className}>
          <p>{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
