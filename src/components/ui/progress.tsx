import * as React from "react";
import { cn } from "cn";
import { Progress as ProgressPrimitive } from "radix-ui";

function Progress({
  className,
  value,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root>) {
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn(
        "relative flex h-1 w-full items-center overflow-hidden rounded-full bg-muted isolate",
        className,
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className="size-full flex-1 bg-primary transform-gpu [will-change:transform] [backface-visibility:hidden]"
        style={{ transform: `translate3d(-${100 - (value || 0)}%, 0, 0)` }}
      />
    </ProgressPrimitive.Root>
  );
}

export { Progress };
