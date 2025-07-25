import { motion, AnimatePresence } from "framer-motion"
import TaskCard from "@/components/molecules/TaskCard"
import Button from "@/components/atoms/Button"
import ApperIcon from "@/components/ApperIcon"
const TaskList = ({ 
  tasks, 
  onToggleComplete, 
  onUpdate, 
  onDelete, 
  separateOverdue = false,
  selectedTasks = [],
  onSelectionChange,
  onBulkComplete,
  onBulkDelete,
  onBulkPriorityChange,
  showBulkActions = false
}) => {
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
const BulkActionsBar = () => (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="sticky top-0 z-10 bg-white border border-gray-200 rounded-lg p-4 mb-4 shadow-md"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ApperIcon name="CheckSquare" className="h-5 w-5 text-primary" />
          <span className="font-medium text-gray-700">
            {selectedTasks.length} task{selectedTasks.length > 1 ? 's' : ''} selected
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="success"
            size="sm"
            onClick={onBulkComplete}
            className="flex items-center gap-1"
          >
            <ApperIcon name="Check" className="h-4 w-4" />
            Mark Complete
          </Button>
          <div className="relative group">
            <Button
              variant="secondary"
              size="sm"
              className="flex items-center gap-1"
            >
              <ApperIcon name="Flag" className="h-4 w-4" />
              Priority
              <ApperIcon name="ChevronDown" className="h-3 w-3" />
            </Button>
            <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-20">
              <div className="py-1 min-w-[120px]">
                <button
                  onClick={() => onBulkPriorityChange('High')}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center gap-2"
                >
                  <div className="w-2 h-2 rounded-full bg-red-500"></div>
                  High
                </button>
                <button
                  onClick={() => onBulkPriorityChange('Medium')}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center gap-2"
                >
                  <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                  Medium
                </button>
                <button
                  onClick={() => onBulkPriorityChange('Low')}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center gap-2"
                >
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  Low
                </button>
              </div>
            </div>
          </div>
          <Button
            variant="danger"
            size="sm"
            onClick={onBulkDelete}
            className="flex items-center gap-1"
          >
            <ApperIcon name="Trash2" className="h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>
    </motion.div>
  )

  if (separateOverdue) {
    const overdueTasks = tasks.filter(isTaskOverdue)
    const regularTasks = tasks.filter(task => !isTaskOverdue(task))

    return (
      <div className="space-y-6">
        <AnimatePresence>
          {showBulkActions && selectedTasks.length > 0 && (
            <BulkActionsBar />
          )}
        </AnimatePresence>
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
                    isSelected={selectedTasks.includes(task.Id)}
                    onSelectionChange={onSelectionChange}
                    showSelection={showBulkActions}
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
                    isSelected={selectedTasks.includes(task.Id)}
                    onSelectionChange={onSelectionChange}
                    showSelection={showBulkActions}
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
      <AnimatePresence>
        {showBulkActions && selectedTasks.length > 0 && (
          <BulkActionsBar />
        )}
      </AnimatePresence>
      <AnimatePresence mode="popLayout">
{tasks.map((task) => (
          <TaskCard
            key={task.Id}
            task={task}
            onToggleComplete={onToggleComplete}
            onUpdate={onUpdate}
            onDelete={onDelete}
            isSelected={selectedTasks.includes(task.Id)}
            onSelectionChange={onSelectionChange}
            showSelection={showBulkActions}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}

export default TaskList