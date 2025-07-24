import { useState } from "react"
import { motion } from "framer-motion"
import { toast } from "react-toastify"
import Button from "@/components/atoms/Button"
import Checkbox from "@/components/atoms/Checkbox"
import Card from "@/components/atoms/Card"
import ApperIcon from "@/components/ApperIcon"
import { cn } from "@/utils/cn"

const TaskCard = ({ task, onToggleComplete, onDelete }) => {
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const handleToggleComplete = async () => {
    try {
      await onToggleComplete(task.Id)
      toast.success(task.isCompleted ? "Task marked incomplete" : "Task completed! 🎉")
    } catch (error) {
      toast.error("Failed to update task")
    }
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await onDelete(task.Id)
      toast.success("Task deleted successfully")
    } catch (error) {
      toast.error("Failed to delete task")
    } finally {
      setIsDeleting(false)
      setShowDeleteConfirm(false)
    }
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, x: -100 }}
      transition={{ duration: 0.2 }}
      whileHover={{ scale: 1.01 }}
      className="group"
    >
      <Card className={cn(
        "p-4 shadow-md hover:shadow-lg transition-all duration-200",
        "border-l-4 border-l-primary/20",
        task.isCompleted && "task-completed border-l-success/40"
      )}>
        <div className="flex items-start gap-4">
          <motion.div
            whileTap={{ scale: 0.9 }}
            className="mt-1"
          >
            <Checkbox
              checked={task.isCompleted}
              onChange={handleToggleComplete}
              className="mt-0.5"
            />
          </motion.div>

          <div className="flex-1 min-w-0">
            <h3 className={cn(
              "font-display font-medium text-gray-900 task-title",
              "text-base leading-tight mb-1"
            )}>
              {task.title}
            </h3>
            
            {task.description && (
              <p className="text-sm text-gray-600 font-body leading-relaxed">
                {task.description}
              </p>
            )}
            
            <div className="flex items-center gap-2 mt-3 text-xs text-gray-400 font-body">
              <ApperIcon name="Clock" className="h-3 w-3" />
              <span>
                Created {new Date(task.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {task.isCompleted && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="p-1.5 bg-success/10 rounded-full"
              >
                <ApperIcon name="Check" className="h-3 w-3 text-success" />
              </motion.div>
            )}
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            >
              {showDeleteConfirm ? (
                <div className="flex items-center gap-1">
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="h-8 px-3 text-xs"
                  >
                    {isDeleting ? (
                      <ApperIcon name="Loader2" className="h-3 w-3 animate-spin" />
                    ) : (
                      "Delete"
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowDeleteConfirm(false)}
                    className="h-8 px-3 text-xs"
                  >
                    Cancel
                  </Button>
                </div>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="h-8 w-8 p-0 text-gray-400 hover:text-error hover:bg-error/10"
                >
                  <ApperIcon name="Trash2" className="h-4 w-4" />
                </Button>
              )}
            </motion.div>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

export default TaskCard