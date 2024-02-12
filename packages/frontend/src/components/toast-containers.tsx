import { type ComponentType } from 'react'
import toast from 'react-hot-toast'
import { FaCheck, FaTimes } from 'react-icons/fa'
import { IoIosClose } from 'react-icons/io'

interface ToastProps {
  id: string
  visible: boolean
  children: string
}

interface ToastWithIconProps extends ToastProps {
  icon: ComponentType
  iconClass: string
}

function ToastWithIcon ({ id, visible, children, icon: Icon, iconClass }: ToastWithIconProps): JSX.Element {
  return (
    <div
      className={`${
        visible ? 'animate-enter' : 'animate-leave'
      } max-w-md w-full text-slate-200 bg-slate-900 shadow-lg rounded-lg flex ring-1 ring-black ring-opacity-5`}
    >
      <div className="flex-1 p-4">
        <div className="flex items-center space-x-8">
          <span className={iconClass}><Icon/></span>
          <span>{children}</span>
        </div>
      </div>
      <div className="flex">
        <button
          onClick={() => { toast.dismiss(id) }}
          className="w-full border border-transparent rounded-none p-4 flex items-center justify-center text-sm font-medium focus:outline-none focus:ring-2"
        >
          <IoIosClose/>
        </button>
      </div>
    </div>
  )
}

export function ToastSuccess (props: ToastProps): JSX.Element {
  return <ToastWithIcon {...props} icon={FaCheck} iconClass="text-green-700"/>
}

export function ToastError (props: ToastProps): JSX.Element {
  return <ToastWithIcon {...props} icon={FaTimes} iconClass="text-red-700"/>
}
