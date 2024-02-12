// TODO: These specific errors should be `pages` so it makes sense to implement
// the Helmet to them, and set the title.
// Move `global-error` outside the errors folder maybe? Then put the errors in the `pages` folder
// under a new `errors` folder.
// Remove the components/errors folder since now it has pretty much nothing.

interface CategoryErrorProps {
  slug: string
}

export function CategoryError ({ slug }: CategoryErrorProps): JSX.Element {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Category not found!</h1>
      Category <b>{slug}</b> couldn&apos;t be found!
    </div>
  )
}
