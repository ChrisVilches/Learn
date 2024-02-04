import { isUndefined } from 'lodash'
import { useCallback, useState } from 'react'
import { Modal } from './modal'
import { useQuery } from 'react-query'
import { getProblemHelp } from '../api-client/problem'
import { useOnce } from '../hooks/use-once'
import { TbBulb } from 'react-icons/tb'

interface ProblemHelpProps {
  problemId: number
}

export function ProblemHelp ({ problemId }: ProblemHelpProps): JSX.Element {
  const { isFetching, isError, data, refetch } = useQuery(
    [getProblemHelp.name, problemId],
    async () => await getProblemHelp(problemId),
    {
      retry: false,
      enabled: false
    }
  )

  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  const fetchOnlyOnce = useOnce(refetch)

  const [showModal, setShowModal] = useState(false)

  const onClickOpenModal = useCallback(() => {
    fetchOnlyOnce()
    setShowModal(true)
  }, [fetchOnlyOnce])

  // TODO: Maybe I could use markdown in order to format the help (since the text has to be
  //       stored in the database, and I don't want to store it as HTML)
  const noDataAvailable = isError || isUndefined(data) || data?.length === 0
  const result = noDataAvailable ? <i>No help available</i> : data

  return (
    <>
      <button className="bg-black text-violet-800 hover:text-violet-200 duration-100 hover:bg-violet-950 p-2 rounded-full transition-colors" onClick={onClickOpenModal}>
        <TbBulb/>
      </button>
      <Modal openModal={showModal} closeModal={() => { setShowModal(false) }}>
        <p>
          {isFetching ? 'Loading...' : result}
        </p>
      </Modal>

    </>
  )
}
