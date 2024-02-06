import { type ReactNode, useRef, useEffect, useCallback } from 'react'
import { insideRectangle } from '../util/misc'
import { ButtonSecondary } from './buttons'

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
        <ButtonSecondary onClick={closeModal}>
          Close
        </ButtonSecondary>
      </dialog>
    </div>
  )
}
