import { type ReactNode, useRef, useEffect, useCallback } from 'react'
import { insideRectangle } from '../util/misc'

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

  const handleClick = useCallback((ev: React.MouseEvent<HTMLDialogElement, MouseEvent>) => {
    if (!insideRectangle(ev.clientX, ev.clientY, ev.currentTarget.getBoundingClientRect())) {
      closeModal()
    }
  }, [closeModal])

  return (
    <div
    className={`${opacity} fixed inset-0 bg-neutral-200 bg-opacity-10 backdrop-blur-sm transition-all`}
    >
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions */}
      <dialog
        onClick={handleClick}
        className='p-8 rounded-lg shadow transition w-full md:w-[400px] lg:w-[600px]'
        ref={ref}
        onCancel={closeModal}
      >
        <div className='mb-8'>
          {children}
        </div>
        <button className="p-4 duration-200 transition-colors rounded-md bg-slate-900 hover:bg-purple-900" onClick={closeModal}>Close</button>
      </dialog>
    </div>
  )
}
