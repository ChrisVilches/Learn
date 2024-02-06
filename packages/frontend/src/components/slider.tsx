import { Slider } from '@mui/base/Slider'

const slotProps = {
  root: { className: 'w-full relative inline-block h-2 cursor-pointer' },
  rail: { className: 'bg-slate-100 dark:bg-slate-700 h-2 w-full rounded-full block absolute' },
  track: { className: 'bg-slate-500 dark:bg-slate-400 h-2 absolute rounded-full' },
  thumb: { className: 'ring-slate-500 dark:ring-slate-400 ring-2 w-4 h-4 -mt-1 -ml-2 flex items-center justify-center bg-white rounded-full shadow absolute' }
}

interface HorizontalSliderProps {
  value: number
  min: number
  max: number
  onChange: ((event: Event, value: number | number[], activeThumb: number) => void) | undefined
  onChangeCommitted: ((event: Event | React.SyntheticEvent<Element, Event>, value: number | number[]) => void) | undefined
}

export function HorizontalSlider ({ onChange, value, onChangeCommitted, min, max }: HorizontalSliderProps): JSX.Element {
  return (
    <Slider
      className="mb-8"
      min={min}
      max={max}
      onChange={onChange}
      onChangeCommitted={onChangeCommitted}
      value={value}
      slotProps={slotProps}
    />
  )
}
