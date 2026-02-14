import * as React from "react"
import "./Card.css"

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(({ className = "", ...props }, ref) => (
  <div ref={ref} className={`card ${className}`} {...props} />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef<HTMLDivElement, CardProps>(({ className = "", ...props }, ref) => (
  <div ref={ref} className={`card-header ${className}`} {...props} />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<HTMLHeadingElement, CardProps>(({ className = "", ...props }, ref) => (
  <h3 ref={ref} className={`card-title ${className}`} {...props} />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<HTMLParagraphElement, CardProps>(({ className = "", ...props }, ref) => (
  <p ref={ref} className={`card-description ${className}`} {...props} />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<HTMLDivElement, CardProps>(({ className = "", ...props }, ref) => (
  <div ref={ref} className={`card-content ${className}`} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<HTMLDivElement, CardProps>(({ className = "", ...props }, ref) => (
  <div ref={ref} className={`card-footer ${className}`} {...props} />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
