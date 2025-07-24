import { useState } from "react"
import { motion } from "framer-motion"
import { toast } from "react-toastify"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import Button from "@/components/atoms/Button"
import Input from "@/components/atoms/Input"
import Textarea from "@/components/atoms/Textarea"
import Card from "@/components/atoms/Card"
import ApperIcon from "@/components/ApperIcon"

const TaskForm = ({ onTaskCreated }) => {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [dueDate, setDueDate] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!title.trim()) {
      toast.error("Please enter a task title")
      return
    }

    setIsSubmitting(true)

    try {
      const newTask = {
        title: title.trim(),
        description: description.trim(),
        dueDate: dueDate ? dueDate.toISOString() : null
      }

      await onTaskCreated(newTask)
      
      // Reset form
      setTitle("")
      setDescription("")
      setDueDate(null)
      
      toast.success("Task created successfully!")
    } catch (error) {
      toast.error("Failed to create task. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="p-6 shadow-lg border-0 bg-gradient-to-br from-white to-gray-50">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-primary/10 rounded-lg">
              <ApperIcon name="Plus" className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-xl font-display font-semibold text-gray-800">
              Add New Task
            </h2>
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 font-body">
              Task Title
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs to be done?"
              disabled={isSubmitting}
              className="font-body"
            />
          </div>
<div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 font-body">
              Description (Optional)
            </label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add more details about this task..."
              disabled={isSubmitting}
              className="font-body"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 font-body">
              Due Date (Optional)
            </label>
            <div className="relative">
              <DatePicker
                selected={dueDate}
                onChange={setDueDate}
                placeholderText="Select a due date"
                dateFormat="MMM d, yyyy"
                minDate={new Date()}
                disabled={isSubmitting}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-body focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                wrapperClassName="w-full"
                popperClassName="react-datepicker-popper"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <ApperIcon name="Calendar" className="h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting || !title.trim()}
            className="w-full mt-6 font-display font-medium"
            size="lg"
          >
            {isSubmitting ? (
              <>
                <ApperIcon name="Loader2" className="mr-2 h-4 w-4 animate-spin" />
                Creating Task...
              </>
            ) : (
              <>
                <ApperIcon name="Plus" className="mr-2 h-4 w-4" />
                Create Task
              </>
            )}
          </Button>
        </form>
      </Card>
    </motion.div>
  )
}

export default TaskForm