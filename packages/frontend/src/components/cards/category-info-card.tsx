interface CategoryInfoCardProps {
  children: React.ReactElement | React.ReactElement[]
  className?: string
}

export function CategoryInfoCard ({ children, className = '' }: CategoryInfoCardProps): JSX.Element {
  return (
    <div className={`p-4 rounded-lg text-slate-800 dark:text-slate-300 bg-slate-400 dark:bg-slate-900 ${className}`}>
      {children}
    </div>
  )
}
