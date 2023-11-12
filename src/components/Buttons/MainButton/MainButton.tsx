import clsx from "clsx";
import { ReactNode } from "react";

interface IButton {
  type: string;
  className?: string;
  text: string;
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
        "flex justify-center h-9 w-full mx-auto lg:h-10",
        className && className,
        type === "filled" &&
          "transition-colors bg-green-600 hover:bg-green-500 text-sm lg:text-base text-slate-200 px-4 py-2 sm:px-4 sm:py-2 lg:px-5 lg:py-2 rounded-md",
        type === "outlined" &&
          "transition-colors text-sm lg:text-base text-slate-200 hover:text-white px-4 py-2 sm:px-4 sm:py-2 lg:px-5 lg:py-2 border-2 border-slate-200 hover:border-white rounded-md",
        type === "auth" &&
          "transition-colors bg-white hover:bg-slate-200 text-sm lg:text-base text-slate-600 hover:text-slate-900 px-4 py-2 sm:px-4 sm:py-2 lg:px-5 lg:py-2 rounded-md"
      )}
      onClick={onClick && onClick}
    >
      {icon && (
        <span className="mr-1 h-full flex flex-col justify-center">{icon}</span>
      )}
      <p className="text-wrapper self-center">{text}</p>
    </button>
  );
};

export default MainButton;
