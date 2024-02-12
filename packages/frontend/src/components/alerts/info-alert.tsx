interface InfoAlertProps {
  title: string
  content: string
}

export function InfoAlert ({ title, content }: InfoAlertProps): JSX.Element {
  return (
    <div className="bg-blue-200 dark:bg-blue-700 p-5 rounded-md mb-10">
      <p className="text-lg font-bold mb-4">{title}</p>
      <p>{content}</p>
    </div>
  )
}
