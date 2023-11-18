import clsx from "clsx";
import { FiMinus, FiPlus } from "react-icons/fi";

interface ICategoryChip {
  className?: string;
  category: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  isSelected: boolean;
}

const CategoryChip = ({
  className,
  category,
  onClick,
  isSelected,
}: ICategoryChip) => {
  return (
    <button
      className={clsx(
        "flex justify-between w-fit",
        isSelected
          ? "bg-green-600 hover:bg-green-500 text-sm lg:text-base text-slate-200 px-1.5 py-2 sm:px-1.5 sm:py-2 lg:px-2.5 lg:py-2 rounded-full"
          : "hover:bg-white hover:bg-opacity-20 text-sm lg:text-base text-slate-200 hover:text-white px-1.5 py-1.5 sm:px-1.5 sm:py-1.5 lg:px-2.5 lg:py-1.5 border-2 border-slate-200 hover:border-white rounded-full",
        className && className
      )}
      onClick={onClick && onClick}
    >
      {isSelected ? (
        <FiMinus className="my-auto" />
      ) : (
        <FiPlus className="my-auto" />
      )}
      {category && (
        <span className="self-center font-medium w-max ml-0.5">{category}</span>
      )}
    </button>
  );
};

export default CategoryChip;
