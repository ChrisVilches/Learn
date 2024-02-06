import toast from 'react-hot-toast'
import { ToastError, ToastSuccess } from '../components/toast-containers'

export function toastSuccess (content: string): void {
  toast.custom((t) => <ToastSuccess {...t}>{content}</ToastSuccess>)
}

export function toastError (content: string): void {
  toast.custom((t) => <ToastError {...t}>{content}</ToastError>)
}
