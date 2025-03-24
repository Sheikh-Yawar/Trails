import * as LucideIcons from "lucide-react"; // Import all icons

type CustomButtonProps = {
  isLoading?: boolean;
  labelText: string;
  onClickHandler: () => void;
  showIcon?: boolean;
  iconPosition?: "prefix" | "suffix";
  iconName?: keyof typeof LucideIcons; // Restrict to valid Lucide icon names
  buttonClassName?: string;
  iconClassName?: string;
};

function CustomButton({
  isLoading = false,
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
      className={`flex items-center justify-center gap-2 text-white transition-colors rounded-lg bg-secondary hover:bg-secondary/90 group font-semibold duration-200 px-6 py-3 ${
        buttonClassName || ""
      }`}
    >
      {isLoading ? (
        <LucideIcons.Loader className="w-6 h-6 text-white animate-spin" />
      ) : (
        <>
          {showIcon && iconPosition === "prefix" && (
            <Icon className={`w-5 h-5 ${iconClassName || ""}`} />
          )}
          {labelText}
          {showIcon && iconPosition === "suffix" && (
            <Icon className={`w-5 h-5  ${iconClassName || ""}`} />
          )}
        </>
      )}
    </button>
  );
}

export default CustomButton;
