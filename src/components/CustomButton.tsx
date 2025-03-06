import * as LucideIcons from "lucide-react"; // Import all icons

type CustomButtonProps = {
  labelText: string;
  onClickHandler: () => void;
  showIcon?: boolean;
  iconPosition?: "prefix" | "suffix";
  iconName?: keyof typeof LucideIcons; // Restrict to valid Lucide icon names
  buttonClassName?: string;
  iconClassName?: string;
};

function CustomButton({
  labelText,
  onClickHandler,
  showIcon = true,
  iconPosition = "prefix",
  iconName = "Sparkles", // Default icon
  buttonClassName,
  iconClassName,
}: CustomButtonProps) {
  // Ensure the selected icon is a valid React component
  const Icon = LucideIcons[iconName] as React.ElementType;

  return (
    <button
      onClick={onClickHandler}
      className={`flex items-center justify-center gap-2 text-white transition-colors rounded-lg bg-secondary hover:bg-secondary/90 group font-semibold duration-200 ${
        buttonClassName || ""
      }`}
    >
      {showIcon && iconPosition === "prefix" && (
        <Icon className={`w-5 h-5 ${iconClassName || ""}`} />
      )}
      {labelText}
      {showIcon && iconPosition === "suffix" && (
        <Icon className={`w-5 h-5  ${iconClassName || ""}`} />
      )}
    </button>
  );
}

export default CustomButton;
