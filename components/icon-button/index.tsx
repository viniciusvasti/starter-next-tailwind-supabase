import React from "react";
import { LuPencil, LuPlusCircle } from "react-icons/lu";

type Props = {
  iconName: "plus-circle" | "pencil";
  iconSize?: number;
};

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & Props;

const IconButton = React.forwardRef<HTMLButtonElement, ButtonProps>(function (
  { iconName, iconSize, ...props }: ButtonProps,
  ref,
) {
  const size = iconSize || 24;
  return (
    <button
      ref={ref}
      type="button"
      className="flex-center text-gray-500 hover:text-gray-900"
      {...props}
    >
      {iconName === "plus-circle" && <LuPlusCircle size={size} />}
      {iconName === "pencil" && <LuPencil size={size} />}
    </button>
  );
});

IconButton.displayName = "IconButton";

export default IconButton;
