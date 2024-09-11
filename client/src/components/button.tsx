import { cn } from "../utils/cn";

type ButtonProps = {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  svg?: React.ReactNode;
  children?: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const variantClasses = {
  primary: "bg-primary text-secondary hover:bg-blue-700",
  secondary: "bg-secondary text-primary hover:bg-gray-200",
  ghost: "bg-transparent text-secondary hover:text-grey-500",
  danger: "bg-red-500 text-white hover:bg-red-600",
};

const Button = ({
  className,
  variant,
  svg,
  children,
  ...rest
}: ButtonProps) => {
  return (
    <button
      className={cn(
        "flex items-center gap-2 p-2 rounded-lg text-sm",
        variantClasses[variant ?? "secondary"],
        className
      )}
      {...rest}
    >
      {svg && svg}

      {children}
    </button>
  );
};

export default Button;
