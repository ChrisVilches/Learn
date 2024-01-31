import { type ReactNode, useRef, useEffect } from 'react'

interface ModalProps {
  openModal: boolean
  closeModal: () => void
  children?: ReactNode
}

export function Modal ({ openModal, closeModal, children }: ModalProps): JSX.Element {
  const ref = useRef<HTMLDialogElement | null>(null)

  useEffect(() => {
    if (openModal) {
      ref.current?.showModal()
    } else {
      ref.current?.close()
    }
  }, [openModal])

  const opacity = openModal ? 'opacity-100 z-40' : 'opacity-0 -z-50'

  return (
    <div
      className={`${opacity} fixed inset-0 bg-neutral-200 bg-opacity-10 backdrop-blur-sm transition-all`}
    >
      <dialog
        className='p-8 rounded-lg shadow transition'
        ref={ref}
        onCancel={closeModal}
      >
        <div className='mb-8'>
          {children}
        </div>
        <button onClick={closeModal}>
          Close
        </button>
      </dialog>
    </div>
  )
}
