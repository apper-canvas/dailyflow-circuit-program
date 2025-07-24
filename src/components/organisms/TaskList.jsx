import { motion, AnimatePresence } from "framer-motion"
import TaskCard from "@/components/molecules/TaskCard"

const TaskList = ({ tasks, onToggleComplete, onUpdate, onDelete, separateOverdue = false }) => {
  if (!tasks || tasks.length === 0) {
    return null
  }

  // Helper function to check if task is overdue
  const isTaskOverdue = (task) => {
    if (task.isCompleted || !task.dueDate) return false
    try {
      const dueDate = typeof task.dueDate === 'string' ? new Date(task.dueDate) : task.dueDate
      if (!dueDate || isNaN(dueDate.getTime())) return false
      
      const now = new Date()
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      const taskDate = new Date(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate())
      
      return taskDate < today
    } catch {
      return false
    }
  }

  if (separateOverdue) {
    const overdueTasks = tasks.filter(isTaskOverdue)
    const regularTasks = tasks.filter(task => !isTaskOverdue(task))

    return (
      <div className="space-y-6">
        {/* Overdue Tasks Section */}
        {overdueTasks.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <h3 className="text-lg font-display font-semibold text-error">
                Overdue Tasks
              </h3>
              <span className="px-2 py-1 bg-error/10 text-error text-xs font-bold rounded-full">
                {overdueTasks.length}
              </span>
            </div>
            <div className="space-y-3">
              <AnimatePresence mode="popLayout">
                {overdueTasks.map((task) => (
                  <TaskCard
                    key={task.Id}
                    task={task}
                    onToggleComplete={onToggleComplete}
                    onUpdate={onUpdate}
                    onDelete={onDelete}
                  />
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* Regular Tasks Section */}
        {regularTasks.length > 0 && (
          <div>
            {overdueTasks.length > 0 && (
              <h3 className="text-lg font-display font-semibold text-gray-800 mb-4">
                Other Tasks
              </h3>
            )}
            <div className="space-y-3">
              <AnimatePresence mode="popLayout">
                {regularTasks.map((task) => (
                  <TaskCard
                    key={task.Id}
                    task={task}
                    onToggleComplete={onToggleComplete}
                    onUpdate={onUpdate}
                    onDelete={onDelete}
                  />
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <AnimatePresence mode="popLayout">
        {tasks.map((task) => (
          <TaskCard
            key={task.Id}
            task={task}
            onToggleComplete={onToggleComplete}
            onUpdate={onUpdate}
            onDelete={onDelete}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}

export default TaskList