import type { Meta, StoryObj } from '@storybook/react'
import { ToastError, ToastSuccess } from '../components/toast-containers'
import { ButtonDanger, ButtonPrimary } from '../components/buttons'
import { toastError, toastSuccess } from '../util/toast'
import { Toaster } from 'react-hot-toast'

const meta = {
  title: 'components/toast-containers'
} satisfies Meta<typeof ToastSuccess>

export default meta
type Story = StoryObj<typeof meta>

export const _ToastSuccess: Story = {
  render: () => <ToastSuccess id={'1'} visible={true}>Correct answer</ToastSuccess>
}

export const _ToastError: Story = {
  render: () => <ToastError id={'1'} visible={true}>Wrong answer</ToastError>
}

export const ButtonTrigger: Story = {
  render: () => (
    <div>
      <Toaster/>
      <div className="flex space-x-4">
        <ButtonPrimary onClick={() => { toastSuccess('A message here') }}>Success</ButtonPrimary>
        <ButtonDanger onClick={() => { toastError('A message here') }}>Error</ButtonDanger>
      </div>
    </div>
  )
}
