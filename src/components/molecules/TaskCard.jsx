import { useState } from "react"
import { motion } from "framer-motion"
import { toast } from "react-toastify"
import Button from "@/components/atoms/Button"
import Input from "@/components/atoms/Input"
import Textarea from "@/components/atoms/Textarea"
import Checkbox from "@/components/atoms/Checkbox"
import Card from "@/components/atoms/Card"
import ApperIcon from "@/components/ApperIcon"
import { cn } from "@/utils/cn"
import { format, isValid, parseISO } from "date-fns"
const TaskCard = ({ task, onToggleComplete, onDelete, onUpdate, isSelected, onSelectionChange, showSelection = false }) => {
const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(task.title)
  const [editDescription, setEditDescription] = useState(task.description || "")
  const [editCategory, setEditCategory] = useState(task.category || "Personal")
  const [editPriority, setEditPriority] = useState(task.priority || "Medium")
  const [isSaving, setIsSaving] = useState(false)
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

const handleEdit = () => {
    setEditTitle(task.title)
    setEditDescription(task.description || "")
    setEditCategory(task.category || "Personal")
    setEditPriority(task.priority || "Medium")
    setIsEditing(true)
  }

  const handleSave = async () => {
    if (!editTitle.trim()) {
      toast.error("Task title cannot be empty")
      return
    }

    setIsSaving(true)
    try {
const updates = {
        title: editTitle.trim(),
        description: editDescription.trim(),
        category: editCategory,
        priority: editPriority
      }
      await onUpdate(task.Id, updates)
      setIsEditing(false)
      toast.success("Task updated successfully")
    } catch (error) {
      toast.error("Failed to update task")
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    setEditTitle(task.title)
    setEditDescription(task.description || "")
    setIsEditing(false)
  }

  const formatDueDate = (dueDate) => {
    if (!dueDate) return null
    try {
      const date = typeof dueDate === 'string' ? parseISO(dueDate) : dueDate
      if (!isValid(date)) return null
      
      const now = new Date()
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      const taskDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())
      
      if (taskDate.getTime() === today.getTime()) {
        return { text: "Today", isOverdue: false, isToday: true }
      } else if (taskDate < today) {
        return { text: format(date, "MMM d"), isOverdue: true, isToday: false }
      } else {
        return { text: format(date, "MMM d"), isOverdue: false, isToday: false }
      }
    } catch {
      return null
    }
}

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800 border-red-200'
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'Low': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Work': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'Personal': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'Shopping': return 'bg-emerald-100 text-emerald-800 border-emerald-200'
      case 'Health': return 'bg-pink-100 text-pink-800 border-pink-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const dueDateInfo = formatDueDate(task.dueDate)
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
        task.isCompleted && "task-completed border-l-success/40",
        dueDateInfo?.isOverdue && !task.isCompleted && "border-l-error/60 bg-error/5"
      )}>
<div className="flex items-start gap-4">
          {showSelection && (
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Checkbox
                checked={isSelected}
                onChange={(e) => onSelectionChange(task.Id, e.target.checked)}
                className="mt-0.5 border-secondary"
              />
            </motion.div>
          )}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Checkbox
              checked={task.isCompleted}
              onChange={handleToggleComplete}
              className="mt-0.5"
            />
          </motion.div>

<div className="flex-1 min-w-0">
{isEditing ? (
              <div className="space-y-3">
                <div>
                  <Input
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    placeholder="Task title"
                    disabled={isSaving}
                    className="font-display font-medium text-base"
                  />
                </div>
                <div>
                  <Textarea
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    placeholder="Add description..."
                    disabled={isSaving}
                    className="text-sm font-body min-h-[60px]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <select
                      value={editCategory}
                      onChange={(e) => setEditCategory(e.target.value)}
                      disabled={isSaving}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-xs font-body focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-50"
                    >
                      <option value="Work">Work</option>
                      <option value="Personal">Personal</option>
                      <option value="Shopping">Shopping</option>
                      <option value="Health">Health</option>
                    </select>
                  </div>
                  <div>
                    <select
                      value={editPriority}
                      onChange={(e) => setEditPriority(e.target.value)}
                      disabled={isSaving}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-xs font-body focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-50"
                    >
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    onClick={handleSave}
                    disabled={isSaving || !editTitle.trim()}
                    className="h-8 px-3 text-xs"
                  >
                    {isSaving ? (
                      <ApperIcon name="Loader2" className="h-3 w-3 animate-spin mr-1" />
                    ) : (
                      <ApperIcon name="Check" className="h-3 w-3 mr-1" />
                    )}
                    Save
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCancel}
                    disabled={isSaving}
                    className="h-8 px-3 text-xs"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <h3 
                  className={cn(
                    "font-display font-medium text-gray-900 task-title cursor-pointer",
                    "text-base leading-tight mb-1 hover:text-primary transition-colors"
                  )}
                  onClick={handleEdit}
                >
                  {task.title}
                </h3>
                
                {task.description ? (
                  <p 
                    className="text-sm text-gray-600 font-body leading-relaxed cursor-pointer hover:text-gray-800 transition-colors"
                    onClick={handleEdit}
                  >
                    {task.description}
                  </p>
                ) : (
                  <p 
                    className="text-sm text-gray-400 font-body leading-relaxed cursor-pointer hover:text-gray-600 transition-colors italic"
                    onClick={handleEdit}
                  >
                    Click to add description...
                  </p>
                )}

<div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      "px-2 py-1 rounded-full text-xs font-medium border",
                      getCategoryColor(task.category || "Personal")
                    )}>
                      {task.category || "Personal"}
                    </span>
                    <span className={cn(
                      "px-2 py-1 rounded-full text-xs font-medium border",
                      getPriorityColor(task.priority || "Medium")
                    )}>
                      {task.priority || "Medium"}
                    </span>
                    {dueDateInfo?.isOverdue && !task.isCompleted && (
                      <span className="px-2 py-1 rounded-full text-xs font-bold bg-error text-white border border-error">
                        OVERDUE
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4 mt-3 text-xs text-gray-400 font-body">
                  {dueDateInfo && (
                    <div className={cn(
                      "flex items-center gap-1",
                      dueDateInfo.isOverdue && "text-error",
                      dueDateInfo.isToday && "text-warning"
                    )}>
                      <ApperIcon name="Calendar" className="h-3 w-3" />
                      <span>{dueDateInfo.text}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-1">
                    <ApperIcon name="Clock" className="h-3 w-3" />
                    <span>
                      Created {new Date(task.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </>
            )}
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
{!isEditing && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center gap-1"
              >
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleEdit}
                  className="h-8 w-8 p-0 text-gray-400 hover:text-primary hover:bg-primary/10"
                >
                  <ApperIcon name="Edit2" className="h-4 w-4" />
                </Button>
                
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
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

export default TaskCard