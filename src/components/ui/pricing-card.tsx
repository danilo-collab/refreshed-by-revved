import React from "react";
import { cn } from "@/lib/utils";

function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "relative w-full rounded-lg",
        "p-1 shadow-xl backdrop-blur-xl",
        "border border-outline-variant/50",
        "bg-surface-container-low",
        className
      )}
      {...props}
    />
  );
}

function Header({
  className,
  children,
  glassEffect = true,
  ...props
}: React.ComponentProps<"div"> & {
  glassEffect?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative mb-4 rounded-lg border border-outline-variant/30 p-5",
        "bg-surface-container/80",
        className
      )}
      {...props}
    >
      {glassEffect && (
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-24 rounded-[inherit] pointer-events-none"
          style={{
            background:
              "linear-gradient(180deg, rgba(0,240,255,0.04) 0%, rgba(255,255,255,0.02) 40%, rgba(0,0,0,0) 100%)",
          }}
        />
      )}
      {children}
    </div>
  );
}

function Plan({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("mb-6 flex items-center justify-between", className)}
      {...props}
    />
  );
}

function Description({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      className={cn("text-on-surface-variant text-xs normal-case not-italic", className)}
      {...props}
    />
  );
}

function PlanName({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "text-on-surface-variant flex items-center gap-2 text-sm font-medium [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    />
  );
}

function Badge({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "bg-primary-container/20 text-primary-container border border-primary-container/40 rounded-sm px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider",
        className
      )}
      {...props}
    />
  );
}

function Price({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div className={cn("mb-4 flex items-end gap-1", className)} {...props} />
  );
}

function MainPrice({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      className={cn("text-3xl font-bold tracking-tight text-on-surface", className)}
      {...props}
    />
  );
}

function Period({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      className={cn("text-outline pb-1 text-sm", className)}
      {...props}
    />
  );
}

function Body({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("space-y-4 p-3", className)} {...props} />;
}

function List({ className, ...props }: React.ComponentProps<"ul">) {
  return <ul className={cn("space-y-3", className)} {...props} />;
}

function ListItem({ className, ...props }: React.ComponentProps<"li">) {
  return (
    <li
      className={cn(
        "text-on-surface-variant flex items-start gap-3 text-sm normal-case not-italic",
        className
      )}
      {...props}
    />
  );
}

export {
  Card,
  Header,
  Description,
  Plan,
  PlanName,
  Badge,
  Price,
  MainPrice,
  Period,
  Body,
  List,
  ListItem,
};
