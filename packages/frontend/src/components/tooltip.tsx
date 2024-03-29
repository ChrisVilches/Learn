import { useDismiss, useFloating, useFocus, useHover, useInteractions, useRole, autoUpdate, offset, flip, shift } from '@floating-ui/react'
import { type ReactNode, useState, type ReactElement } from 'react'

interface TooltipProps {
  children: (props: object) => ReactElement
  label: ReactNode
}

export function Tooltip ({ children, label }: TooltipProps): JSX.Element {
  const [isOpen, setIsOpen] = useState(false)

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    middleware: [offset(10), flip(), shift()],
    whileElementsMounted: autoUpdate
  })

  const hover = useHover(context, { move: false })
  const focus = useFocus(context)
  const dismiss = useDismiss(context)
  const role = useRole(context, { role: 'tooltip' })

  const { getReferenceProps, getFloatingProps } = useInteractions([
    hover,
    focus,
    dismiss,
    role
  ])

  return (
    <>
      {children({
        ref: refs.setReference,
        ...getReferenceProps()
      })}
      {isOpen && (
        <div
          className="p-2 bg-black opacity-85 rounded-md text-white"
          ref={refs.setFloating}
          style={floatingStyles}
          {...getFloatingProps()}
        >
          {label}
        </div>
      )}
    </>
  )
}
