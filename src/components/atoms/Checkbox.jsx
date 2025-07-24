import React from "react"
import { cn } from "@/utils/cn"

const Checkbox = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <input
      type="checkbox"
      className={cn(
        "task-checkbox",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})

Checkbox.displayName = "Checkbox"

export default Checkbox