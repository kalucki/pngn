export type HistoryEntry<T> = {
  value: T
  bytes: number
}

export type HistoryState<T> = {
  past: HistoryEntry<T>[]
  present: T
  future: HistoryEntry<T>[]
  byteLimit: number
}

export type HistoryAction<T> =
  | { type: 'commit'; value: T; bytes?: number }
  | { type: 'replace'; value: T }
  | { type: 'undo' }
  | { type: 'redo' }
  | { type: 'clear'; value: T }

const approximateBytes = (value: unknown) => {
  try {
    return JSON.stringify(value).length * 2
  } catch {
    return 1024
  }
}

const trimPast = <T,>(entries: HistoryEntry<T>[], byteLimit: number) => {
  let total = entries.reduce((sum, entry) => sum + entry.bytes, 0)
  let start = 0
  while (start < entries.length && total > byteLimit) {
    total -= entries[start].bytes
    start += 1
  }
  return start > 0 ? entries.slice(start) : entries
}

export const createHistoryState = <T,>(
  present: T,
  byteLimit = 8 * 1024 * 1024,
): HistoryState<T> => ({
  past: [],
  present,
  future: [],
  byteLimit,
})

export const historyReducer = <T,>(
  state: HistoryState<T>,
  action: HistoryAction<T>,
): HistoryState<T> => {
  if (action.type === 'replace') {
    return { ...state, present: action.value }
  }
  if (action.type === 'clear') {
    return createHistoryState(action.value, state.byteLimit)
  }
  if (action.type === 'undo') {
    const previous = state.past[state.past.length - 1]
    if (!previous) return state
    return {
      ...state,
      past: state.past.slice(0, -1),
      present: previous.value,
      future: [
        { value: state.present, bytes: approximateBytes(state.present) },
        ...state.future,
      ],
    }
  }
  if (action.type === 'redo') {
    const next = state.future[0]
    if (!next) return state
    const past = [
      ...state.past,
      { value: state.present, bytes: approximateBytes(state.present) },
    ]
    return {
      ...state,
      past: trimPast(past, state.byteLimit),
      present: next.value,
      future: state.future.slice(1),
    }
  }
  const bytes = action.bytes ?? approximateBytes(state.present)
  const past = [...state.past, { value: state.present, bytes }]
  return {
    ...state,
    past: trimPast(past, state.byteLimit),
    present: action.value,
    future: [],
  }
}
