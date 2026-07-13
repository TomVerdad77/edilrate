type EmptyStateProps = {
    title: string;
    description?: string;
    emoji?: string;
  };
  
  export default function EmptyState({
    title,
    description,
    emoji = "📭",
  }: EmptyStateProps) {
    return (
      <div className="bg-white border rounded-3xl p-8 text-center text-gray-600">
        <div className="text-4xl">{emoji}</div>
  
        <h3 className="mt-4 text-xl font-semibold text-black">
          {title}
        </h3>
  
        {description && (
          <p className="mt-2 text-sm text-gray-500">
            {description}
          </p>
        )}
      </div>
    );
  }