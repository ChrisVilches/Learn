interface SolutionInputProps {
  onChange: (value: string) => void
  value: string
  className?: string
  disabled: boolean
}

export const SolutionInput = ({ disabled, onChange, value, className = '' }: SolutionInputProps): JSX.Element => {
  return (
    <div>
      <textarea
        disabled={disabled}
        className={`w-full rounded-md p-3 h-32 bg-slate-200 text-slate-900 dark:bg-slate-300 dark:text-black ${className}`}
        value={value}
        onChange={(ev) => { onChange(ev.currentTarget.value) }}>
      </textarea>
    </div>
  )
}
