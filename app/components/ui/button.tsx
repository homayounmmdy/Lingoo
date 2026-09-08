import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";

const buttonVariants = cva(
  [
    "group/button inline-flex shrink-0 items-center justify-center",
    "rounded-xl border border-transparent bg-clip-padding",
    "text-sm font-semibold whitespace-nowrap",
    "transition-all duration-200 ease-out",
    "outline-none select-none",
    "focus-visible:ring-2 focus-visible:ring-[#f74697]/30 focus-visible:ring-offset-2",
    "active:not-aria-[haspopup]:scale-[0.98]",
    "disabled:pointer-events-none disabled:opacity-50",
    "aria-invalid:border-destructive aria-invalid:ring-destructive/20",
    "hover-scale", // Your custom scale animation
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  ].join(" "),
  {
    variants: {
      variant: {
        // Primary pink button with soft pink shadow
        default: [
          "bg-[#f74697] text-white shadow-md shadow-pink-200/60",
          "hover:bg-[#ff66aa] hover:shadow-lg hover:shadow-pink-300/60",
          "focus-visible:border-[#f74697]",
        ].join(" "),

        // Outline with pink hover effect
        outline: [
          "border-slate-200 bg-white text-slate-700 shadow-sm",
          "hover:border-[#f74697] hover:text-[#f74697] hover:bg-pink-50/50",
          "aria-expanded:bg-pink-50 aria-expanded:border-[#f74697] aria-expanded:text-[#f74697]",
          "dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200",
          "dark:hover:border-[#f74697] dark:hover:bg-pink-950/20",
        ].join(" "),

        // Soft secondary (for badges/chips)
        secondary: [
          "bg-slate-100 text-slate-700 border border-slate-200",
          "hover:bg-[#f74697]/10 hover:text-[#f74697] hover:border-[#f74697]/30",
          "aria-expanded:bg-slate-200",
          "dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700",
        ].join(" "),

        // Ghost with pink tint on hover
        ghost: [
          "text-slate-700",
          "hover:bg-pink-50 hover:text-[#f74697]",
          "aria-expanded:bg-pink-50 aria-expanded:text-[#f74697]",
          "dark:text-slate-200 dark:hover:bg-pink-950/20",
        ].join(" "),

        // Destructive (soft red)
        destructive: [
          "bg-rose-50 text-rose-700 border border-rose-200",
          "hover:bg-rose-100 hover:text-rose-800",
          "focus-visible:border-rose-400 focus-visible:ring-rose-200",
          "dark:bg-rose-950/30 dark:text-rose-300",
        ].join(" "),

        // Link style
        link: [
          "text-[#f74697] underline-offset-4",
          "hover:underline hover:text-[#ff66aa]",
          "border-none shadow-none bg-transparent",
        ].join(" "),
      },
      size: {
        default:
          "h-10 gap-2 px-5 in-data-[slot=button-group]:rounded-xl has-data-[icon=inline-end]:pe-3 has-data-[icon=inline-start]:ps-3",
        xs: "h-7 gap-1.5 px-2.5 text-xs rounded-lg in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pe-2 has-data-[icon=inline-start]:ps-2 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-9 gap-1.5 px-3.5 rounded-lg in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pe-2.5 has-data-[icon=inline-start]:ps-2.5",
        lg: "h-12 gap-2 px-6 text-base rounded-2xl in-data-[slot=button-group]:rounded-2xl has-data-[icon=inline-end]:pe-3 has-data-[icon=inline-start]:ps-3 [&_svg:not([class*='size-'])]:size-5",
        icon: "size-10 rounded-xl",
        "icon-xs":
          "size-7 rounded-lg in-data-[slot=button-group]:rounded-lg [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-9 rounded-lg in-data-[slot=button-group]:rounded-lg",
        "icon-lg": "size-12 rounded-2xl [&_svg:not([class*='size-'])]:size-5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
