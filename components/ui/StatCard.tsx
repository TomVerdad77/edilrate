type StatCardProps = {
    emoji?: string;
    label: string;
    value: number | string;
    href?: string;
  };
  
  export default function StatCard({
    emoji,
    label,
    value,
    href,
  }: StatCardProps) {
    const content = (
      <>
        {emoji && <div className="text-3xl">{emoji}</div>}
        <p className="mt-5 text-sm text-gray-500">{label}</p>
        <p className="mt-2 text-4xl font-bold">{value}</p>
      </>
    );
  
    const classes =
      "bg-white border rounded-3xl p-6 hover:shadow-md transition";
  
    if (href) {
      return (
        <a href={href} className={classes}>
          {content}
        </a>
      );
    }
  
    return <div className={classes}>{content}</div>;
  }