import { motion, AnimatePresence } from "framer-motion"
import TaskCard from "@/components/molecules/TaskCard"

const TaskList = ({ tasks, onToggleComplete, onDelete }) => {
  if (!tasks || tasks.length === 0) {
    return null
  }

  return (
    <div className="space-y-3">
      <AnimatePresence mode="popLayout">
        {tasks.map((task) => (
          <TaskCard
            key={task.Id}
            task={task}
            onToggleComplete={onToggleComplete}
            onDelete={onDelete}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}

export default TaskList