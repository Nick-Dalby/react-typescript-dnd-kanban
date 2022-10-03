import AddNewItem from './AddNewItem'
import Card from './Card'
import { ColumnContainer, ColumnTitle } from './styles'
import { useAppState } from './state/AppStateContext'
import { addTask, moveList } from './state/actions'
import { useRef } from 'react'
import { useItemDrag } from './utils/useItemDrag'
import { useDrop } from 'react-dnd'
import { throttle } from 'throttle-debounce-ts'
import { isHidden } from './utils/isHidden'

type ColumnProps = {
  text: string
  id: string
}

const Column = ({ text, id }: ColumnProps) => {
  const { getTasksByListId, dispatch, draggedItem } = useAppState()

  const ref = useRef<HTMLDivElement>(null)
  const [, drop] = useDrop({
    accept: 'COLUMN',
    hover: throttle(200, () => {
      if (!draggedItem) {
        return
      }
      if (draggedItem.type === 'COLUMN') {
        if (draggedItem.id === id) {
          return
        }
        dispatch(moveList(draggedItem.id, id))
      }
    }),
  })

  const { drag } = useItemDrag({ type: 'COLUMN', id, text })

  const tasks = getTasksByListId(id)

  drag(drop(ref))

  return (
    <ColumnContainer ref={ref} isHidden={isHidden(draggedItem, 'COLUMN', id)}>
      <ColumnTitle>{text}</ColumnTitle>
      {tasks.map((task) => (
        <Card text={task.text} key={task.id} id={task.id} />
      ))}
      <AddNewItem
        dark
        toggleButtonText="+ add another item"
        onAdd={(text) => dispatch(addTask(text, id))}
      />
    </ColumnContainer>
  )
}
export default Column
