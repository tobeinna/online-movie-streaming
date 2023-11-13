import clsx from "clsx";
import { ReactNode } from "react";

interface IButton {
  type: string;
  className?: string;
  text?: string;
  isSubmit?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  icon?: ReactNode;
}

const MainButton = ({
  type,
  className,
  text,
  isSubmit,
  onClick,
  icon,
}: IButton) => {
  return (
    <button
      type={isSubmit ? "submit" : "button"}
      className={clsx(
        "flex justify-center gap-1 h-9 w-fit mx-auto lg:h-10 transition-colors duration-500",
        className && className,
        type === "filled" &&
          "bg-green-600 hover:bg-green-500 text-sm lg:text-base text-slate-200 px-4 py-2 sm:px-4 sm:py-2 lg:px-5 lg:py-2 rounded-md",
        type === "outlined" &&
          "hover:bg-white hover:bg-opacity-20 text-sm lg:text-base text-slate-200 hover:text-white px-4 py-2 sm:px-4 sm:py-2 lg:px-5 lg:py-2 border-2 border-slate-200 hover:border-white rounded-md",
        type === "auth" &&
          "bg-white hover:bg-slate-200 text-sm lg:text-base text-slate-600 hover:text-slate-900 px-4 py-2 sm:px-4 sm:py-2 lg:px-5 lg:py-2 rounded-md",
        type === "icon-only" &&
          "hover:bg-white hover:bg-opacity-20 text-base lg:text-lg text-white px-2 py-2 sm:px-2 sm:py-2 lg:px-3 lg:py-3 rounded-md"
      )}
      onClick={onClick && onClick}
    >
      {icon && (
        <span className="h-full flex flex-col justify-center ">{icon}</span>
      )}
      {text && (
        <span className="self-center font-medium">{text}</span>
      )}
    </button>
  );
};

export default MainButton;
