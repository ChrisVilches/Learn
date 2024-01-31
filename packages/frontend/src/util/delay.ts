import { last } from 'lodash'
import { type Observable, Subject, bufferTime, filter, map, concatMap } from 'rxjs'

interface DelayExecutionOnlyLastReturn<S, R> {
  pending$: Subject<S>
  buffered$: Observable<R>
}

export function delayExecutionOnlyLast<S, R> (time: number, fn: (args: S) => Promise<R>): DelayExecutionOnlyLastReturn<S, R> {
  const pending$ = new Subject<S>()

  const buffered$ = pending$.pipe(
    bufferTime(time),
    filter(x => x.length > 0),
    map(x => last(x) as S),
    concatMap(fn)
  )

  return { pending$, buffered$ }
}
