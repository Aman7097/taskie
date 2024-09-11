import React from "react";
import { cn } from "../utils/cn";
import { RiAddFill } from "react-icons/ri";

interface IProps extends React.HTMLAttributes<HTMLDivElement> {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

const Modal: React.FC<IProps> = ({ isOpen, onClose, title, children }) => {
  return (
    <div
      className={cn(
        "fixed inset-0 z-50 items-center justify-center px-4",
        isOpen ? "flex bg-black/70 backdrop-blur-[1px]" : "hidden"
      )}
    >
      <div className="w-full max-w-md bg-white rounded-lg shadow-xl">
        {title && (
          <>
            <div className="flex items-center justify-between gap-3 p-4">
              <p className="text-lg font-bold text-primary">{title}</p>
              <div
                onClick={onClose}
                className="flex items-center cursor-pointer justify-center size-6 p-0.5 rotate-45 rounded-full text-white bg-primary"
              >
                <RiAddFill className="size-5" />
              </div>
            </div>
            <hr className="border-b border-secondary-100" />
          </>
        )}
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
