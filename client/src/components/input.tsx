import React, {
  forwardRef,
  InputHTMLAttributes,
  ReactNode,
  useState,
} from "react";
import { cn } from "../utils/cn";
import { PiEye, PiEyeClosed } from "react-icons/pi";

interface IProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  containerClass?: string;
  rightIcon?: ReactNode;
  leftIcon?: ReactNode;
}

const Input: React.ForwardRefRenderFunction<HTMLInputElement, IProps> = (
  {
    className,
    type,
    error,
    containerClass,
    leftIcon,
    rightIcon,
    autoComplete = "new-password",
    ...rest
  },
  ref
) => {
  const [show, setShow] = useState(false);

  const togglePasswordVisibility = () => {
    if (type === "password") {
      setShow(!show);
    }
  };

  const renderRightIcon = () => {
    if (type === "password") {
      return show ? (
        <PiEye size={20} onClick={togglePasswordVisibility} />
      ) : (
        <PiEyeClosed size={20} onClick={togglePasswordVisibility} />
      );
    }
    return rightIcon;
  };

  return (
    <div className={containerClass}>
      <div className="relative h-full">
        {leftIcon && (
          <div className="absolute -translate-y-1/2 top-1/2 left-2.5">
            {leftIcon}
          </div>
        )}
        <input
          type={type === "password" ? (show ? "text" : "password") : type}
          ref={ref}
          autoComplete={autoComplete}
          className={cn(
            "bg-white outline-none text-sm rounded-lg p-2.5 w-full focus:outline-none focus:border-gray-400 border",
            error ? "border border-red-500 focus:border-red-500" : "",
            leftIcon ? "pl-10" : "",
            rightIcon || type === "password" ? "pr-10" : "",
            className
          )}
          {...rest}
        />
        {(rightIcon || type === "password") && (
          <div
            onClick={type === "password" ? togglePasswordVisibility : undefined}
            className={cn("absolute -translate-y-1/2 top-1/2 right-2.5", {
              "cursor-pointer": type === "password",
            })}
          >
            {renderRightIcon()}
          </div>
        )}
      </div>

      {error && (
        <span className="absolute truncate w-full block visible py-1.5 text-[0.625rem] leading-[0.625rem] text-red-500 m-0">
          {error}
        </span>
      )}
    </div>
  );
};

export default forwardRef(Input);
