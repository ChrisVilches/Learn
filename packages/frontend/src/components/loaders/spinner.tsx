import { TbLoader2 } from 'react-icons/tb'

export function Spinner (): JSX.Element {
  return (
    <div className="p-2">
      <TbLoader2 className="animate-spin h-5 w-5"/>
    </div>
  )
}
