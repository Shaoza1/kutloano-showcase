import * as React from "react";
import { cn } from "@/lib/utils";

// Safe, no-op Tooltip primitives to avoid Radix runtime issues
const TooltipProvider: React.FC<{ delayDuration?: number; children: React.ReactNode }> = ({ children }) => (
  <>{children}</>
);

const Tooltip: React.FC<{ children: React.ReactNode }> = ({ children }) => <>{children}</>;

const TooltipTrigger = React.forwardRef<
  HTMLElement,
  (React.HTMLAttributes<HTMLElement> & { asChild?: boolean }) | Record<string, any>
>(({ children, asChild, ...props }, ref) => {
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement, { ref, ...props });
  }
  return (
    <span ref={ref as any} {...(props as any)}>
      {children}
    </span>
  );
});
TooltipTrigger.displayName = "TooltipTrigger";

const TooltipContent = React.forwardRef<HTMLDivElement, (React.HTMLAttributes<HTMLDivElement> & Record<string, any>)>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("hidden", className)} {...(props as any)} />
  )
);
TooltipContent.displayName = "TooltipContent";

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
