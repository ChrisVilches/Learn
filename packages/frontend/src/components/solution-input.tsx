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
        className={`w-full rounded-md p-3 h-32 ${className}`}
        value={value}
        onChange={(ev) => { onChange(ev.currentTarget.value) }}>
      </textarea>
    </div>
  )
}
