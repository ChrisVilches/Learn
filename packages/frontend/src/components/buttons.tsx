import { type DetailedHTMLProps, type ComponentType, type ButtonHTMLAttributes, forwardRef } from 'react'

type ButtonProps = DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>

interface ButtonIconProps extends ButtonProps {
  icon: ComponentType
}

export const ButtonIcon = forwardRef<HTMLButtonElement, ButtonIconProps>(({ icon: Icon, ...props }, ref) => (
  <button {...props} ref={ref} className="bg-black text-violet-800 hover:text-violet-200 duration-100 hover:bg-violet-950 p-2 rounded-full transition-colors">
    <Icon />
  </button>
))

export const ButtonPrimary = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => (
  <button {...props} ref={ref} className="p-4 rounded-md transition-colors duration-200 hover:bg-green-900 bg-green-800 disabled:bg-slate-500">
    {props.children}
  </button>
))

export const ButtonSecondary = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => (
  <button {...props} ref={ref} className="p-4 duration-200 transition-colors rounded-md bg-slate-900 hover:bg-purple-900">
    {props.children}
  </button>
))

export const ButtonDanger = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => (
  <button {...props} ref={ref} className="p-4 duration-200 transition-colors rounded-md bg-red-800 hover:bg-red-900">
    {props.children}
  </button>
))

ButtonIcon.displayName = 'ButtonIcon'
ButtonPrimary.displayName = 'ButtonPrimary'
ButtonSecondary.displayName = 'ButtonSecondary'
ButtonDanger.displayName = 'ButtonDanger'
