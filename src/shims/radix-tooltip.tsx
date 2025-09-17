import * as React from "react";

// No-op shim for @radix-ui/react-tooltip to prevent runtime issues
export const Provider: React.FC<{ delayDuration?: number; children: React.ReactNode }> = ({ children }) => (
  <>{children}</>
);

export const Root: React.FC<{ children: React.ReactNode }> = ({ children }) => <>{children}</>;

export const Trigger = React.forwardRef<any, any>(({ children, ...props }, ref) => {
  if (React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement, { ref, ...props });
  }
  return (
    <span ref={ref} {...props}>
      {children}
    </span>
  );
});
Trigger.displayName = "Trigger";

export const Content = React.forwardRef<HTMLDivElement, any>(({ className, style, ...props }, ref) => (
  <div ref={ref} className={className} style={{ display: "none", ...(style || {}) }} {...props} />
));
Content.displayName = "Content";

export const Arrow: React.FC<any> = () => null;
