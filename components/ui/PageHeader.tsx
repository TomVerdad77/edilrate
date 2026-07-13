type PageHeaderProps = {
    eyebrow?: string;
    title: string;
    subtitle?: string;
    backHref?: string;
    backLabel?: string;
    action?: React.ReactNode;
  };
  
  export default function PageHeader({
    eyebrow = "Pannello amministratore",
    title,
    subtitle,
    backHref,
    backLabel = "← Torna alla dashboard",
    action,
  }: PageHeaderProps) {
    return (
      <div>
        {backHref && (
          <a href={backHref} className="text-sm text-gray-500 hover:text-black">
            {backLabel}
          </a>
        )}
  
        <div className="mt-6 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            {eyebrow && (
              <p className="text-sm text-gray-500">
                {eyebrow}
              </p>
            )}
  
            <h1 className="mt-2 text-4xl md:text-5xl font-bold">
              {title}
            </h1>
  
            {subtitle && (
              <p className="mt-4 text-gray-600">
                {subtitle}
              </p>
            )}
          </div>
  
          {action && <div>{action}</div>}
        </div>
      </div>
    );
  }