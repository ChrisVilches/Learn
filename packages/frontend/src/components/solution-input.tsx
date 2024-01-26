interface SolutionInputProps {
  onChange: (value: string) => void
  value: string
}

export const SolutionInput = ({ onChange, value }: SolutionInputProps): JSX.Element => {
  return (
    <div>
      <textarea value={value} onChange={(ev) => { onChange(ev.currentTarget.value) }}></textarea>
    </div>
  )
}
