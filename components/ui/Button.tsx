type ButtonProps = {
    children: React.ReactNode;
    href?: string;
    onClick?: () => void;
    type?: "button" | "submit";
    variant?: "primary" | "secondary" | "danger";
    className?: string;
    disabled?: boolean;
  };
  
  export default function Button({
    children,
    href,
    onClick,
    type = "button",
    variant = "primary",
    className = "",
    disabled = false,
  }: ButtonProps) {
    const base =
      "inline-flex items-center justify-center px-5 py-3 rounded-2xl text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed";
  
    const variants = {
      primary: "bg-black text-white hover:bg-gray-800",
      secondary: "bg-white border text-black hover:bg-gray-100",
      danger: "bg-red-600 text-white hover:bg-red-700",
    };
  
    const classes = `${base} ${variants[variant]} ${className}`;
  
    if (href) {
      return (
        <a href={href} className={classes}>
          {children}
        </a>
      );
    }
  
    return (
      <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={classes}
      >
        {children}
      </button>
    );
  }