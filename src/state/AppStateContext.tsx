import { createContext, FC, useContext, Dispatch } from 'react'
import { appStateReducer, AppState, List, Task } from './appStateReducer'
import { Action } from './actions'
import { useImmerReducer } from 'use-immer'
import { DragItem } from '../DragItem'

const appData: AppState = {
  draggedItem: null,
  lists: [
    {
      id: '0',
      text: 'Do:',
      tasks: [{ id: 'c0', text: 'Learn typescript' }],
    },
    {
      id: '1',
      text: 'Doing:',
      tasks: [{ id: 'c1', text: 'Open VS Code' }],
    },
    {
      id: '2',
      text: 'Done:',
      tasks: [{ id: 'c2', text: '...Profit' }],
    },
  ],
}

type AppStateContextProps = {
  draggedItem: DragItem | null
  lists: List[]
  getTasksByListId(id: string): Task[]
  dispatch: Dispatch<Action>
}

const AppStateContext = createContext<AppStateContextProps>(
  {} as AppStateContextProps
)

type Props = {
  children?: React.ReactNode
}

export const AppStateProvider: FC<Props> = ({ children }) => {
  const [state, dispatch] = useImmerReducer(appStateReducer, appData)

  const { lists, draggedItem } = state

  const getTasksByListId = (id: string) => {
    return lists.find((list) => list.id === id)?.tasks || []
  }

  return (
    <AppStateContext.Provider value={{draggedItem, lists, getTasksByListId, dispatch }}>
      {children}
    </AppStateContext.Provider>
  )
}

export const useAppState = () => {
  return useContext(AppStateContext)
}
