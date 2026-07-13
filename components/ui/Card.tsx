type CardProps = {
    children: React.ReactNode;
    className?: string;
  };
  
  export default function Card({
    children,
    className = "",
  }: CardProps) {
    return (
      <div
        className={`bg-white border rounded-3xl p-6 shadow-sm hover:shadow-md transition ${className}`}
      >
        {children}
      </div>
    );
  }