import { isUndefined } from 'lodash'
import { useCallback, useState } from 'react'
import { Modal } from './modal'
import { useQuery } from 'react-query'
import { getProblemHelp } from '../api-client/problem'
import { useOnce } from '../hooks/use-once'

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

  const noDataAvailable = isError || isUndefined(data) || data.length === 0
  const result = noDataAvailable ? <i>No help available</i> : data

  return (
    <>
      <button onClick={onClickOpenModal}>Help</button>
      <Modal openModal={showModal} closeModal={() => { setShowModal(false) }}>
        <p>
          {isFetching ? 'Loading...' : result}
        </p>
      </Modal>

    </>
  )
}
