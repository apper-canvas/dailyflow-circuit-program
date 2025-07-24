import React from "react"
import { cn } from "@/utils/cn"

const Card = React.forwardRef(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "rounded-lg bg-surface shadow-sm border border-gray-100",
        "transition-all duration-200 ease-out",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
})

Card.displayName = "Card"

export default Card