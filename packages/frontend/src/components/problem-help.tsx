import { isUndefined } from 'lodash'
import { useCallback, useState } from 'react'
import { Modal } from './modal'
import { useQuery } from 'react-query'
import { getProblemHelp } from '../api-client/problem'
import { useOnce } from '../hooks/use-once'
import { TbBulb } from 'react-icons/tb'
import Markdown from 'react-markdown'
import { TextSkeleton } from './loaders/text-skeleton'
import { Tooltip } from './tooltip'

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

  const noDataAvailable = isError || isUndefined(data) || data?.length === 0
  const result = noDataAvailable ? '*No help available*' : data

  return (
    <>
      <Tooltip label="See help">
        {(props) => (
          <button {...props} className="bg-black text-violet-800 hover:text-violet-200 duration-100 hover:bg-violet-950 p-2 rounded-full transition-colors" onClick={onClickOpenModal}>
            <TbBulb/>
          </button>
        )}
      </Tooltip>
      <Modal openModal={showModal} closeModal={() => { setShowModal(false) }}>
        {isFetching ? <TextSkeleton/> : <Markdown className="help-markdown">{result}</Markdown>}
      </Modal>
    </>
  )
}
