import { FC } from 'react'
import { Checkbox } from '@radix-ui/react-checkbox'
import { Clock } from 'lucide-react'

interface TodoItem {
  id: string
  title: string
  points: number
  time: number
  date: string
  tag: {
    name: string
    color: string
  }
}

const TodoList: FC = () => {
  const todos: TodoItem[] = [
    {
      id: '1',
      title: 'Code Review',
      points: 4,
      time: 12,
      date: '22 Jan 2023',
      tag: {
        name: 'Dev',
        color: 'bg-[#5252FF]'
      }
    },
    {
      id: '2',
      title: 'Meetings with Ragazo Company',
      points: 4,
      time: 12,
      date: '22 Jan 2023',
      tag: {
        name: 'Meeting',
        color: 'bg-[#FF7452]'
      }
    }
  ]

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-semibold">Today, 22 April</h1>
          <div className="flex space-x-2">
            <button className="px-4 py-1 text-sm bg-[rgba(82,82,255,0.1)] text-[#5252FF] rounded-full">
              List
            </button>
            <button className="px-4 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-full">
              Board
            </button>
            <button className="px-4 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-full">
              Timeline
            </button>
            <button className="px-4 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-full">
              Calendar
            </button>
          </div>
        </div>
        <button className="px-4 py-2 bg-[#5252FF] text-white rounded-lg text-sm">
          New Task
        </button>
      </div>

      <div className="space-y-2">
        {todos.map((todo) => (
          <div
            key={todo.id}
            className="flex items-center h-14 px-4 border rounded-lg hover:bg-gray-50"
          >
            <Checkbox className="w-[18px] h-[18px] border-2 rounded" />
            <span className="ml-3 flex-1">{todo.title}</span>
            <div className="flex items-center space-x-4">
              <span className={`px-3 py-1 text-xs text-white rounded-full ${todo.tag.color}`}>
                {todo.tag.name}
              </span>
              <div className="flex items-center text-gray-500">
                <Clock className="w-4 h-4 mr-1" />
                <span className="text-xs">{todo.points}</span>
                <span className="mx-1 text-xs">·</span>
                <span className="text-xs">{todo.time}</span>
                <span className="mx-1 text-xs">·</span>
                <span className="text-xs">{todo.date}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TodoList
