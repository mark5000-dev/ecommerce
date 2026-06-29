"use client";

import * as React from "react";
import * as SeparatorPrimitive from "@radix-ui/react-separator";
import { cn } from "@/lib/utils"; // Adjusted path to map to your main lib utilities

export type SeparatorProps = React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>;

export const Separator = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  SeparatorProps
>(({
  className,
  orientation = "horizontal",
  decorative = true,
  ...props
}, ref) => {
  return (
    <SeparatorPrimitive.Root
      ref={ref}
      data-slot="separator-root"
      decorative={decorative}
      orientation={orientation}
      className={cn(
        "bg-border shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px",
        className,
      )}
      {...props}
    />
  );
});

Separator.displayName = SeparatorPrimitive.Root.displayName;