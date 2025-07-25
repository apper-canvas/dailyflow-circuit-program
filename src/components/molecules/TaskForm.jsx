import "react-datepicker/dist/react-datepicker.css"
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import DatePicker from "react-datepicker";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import Textarea from "@/components/atoms/Textarea";

const TaskForm = ({ onTaskCreated, task = null, mode = 'create' }) => {
const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [dueDate, setDueDate] = useState(null)
  const [category, setCategory] = useState("Personal")
  const [priority, setPriority] = useState("Medium")
  const [tags, setTags] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const editMode = mode === 'edit' && task

  // Pre-populate form fields when editing
  useEffect(() => {
    if (editMode) {
      setTitle(task.title || "")
      setDescription(task.description || "")
      setCategory(task.category || "Personal")
      setPriority(task.priority || "Medium")
      setTags(task.tags || "")
      
      // Handle due date - convert string to Date object for DatePicker
      if (task.dueDate) {
        try {
          const date = new Date(task.dueDate)
          if (!isNaN(date.getTime())) {
            setDueDate(date)
          }
        } catch (error) {
          console.error("Invalid due date format:", task.dueDate)
          setDueDate(null)
        }
      } else {
        setDueDate(null)
      }
    }
  }, [editMode, task])

const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!title.trim()) {
      toast.error("Please enter a task title")
      return
    }

    setIsSubmitting(true)

    try {
      const taskData = {
        title: title.trim(),
        description: description.trim(),
        dueDate: dueDate ? dueDate.toISOString() : null,
        category,
        priority,
        tags: tags.trim()
      }

      if (editMode) {
        // Update existing task
        await onTaskCreated(taskData, task.Id, 'update')
        toast.success("Task updated successfully!")
      } else {
        // Create new task
        await onTaskCreated(taskData)
        
        // Reset form only when creating
        setTitle("")
        setDescription("")
        setDueDate(null)
        setCategory("Personal")
        setPriority("Medium")
        setTags("")
        
        toast.success("Task created successfully!")
      }
    } catch (error) {
      const errorMessage = editMode 
        ? "Failed to update task. Please try again."
        : "Failed to create task. Please try again."
      toast.error(errorMessage)
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
              {editMode ? 'Edit Task' : 'Add New Task'}
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
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 font-body">
                Category
              </label>
              <div className="relative">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  disabled={isSubmitting}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-body focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 appearance-none bg-white"
                >
                  <option value="Work">Work</option>
                  <option value="Personal">Personal</option>
                  <option value="Shopping">Shopping</option>
                  <option value="Health">Health</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <ApperIcon name="ChevronDown" className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 font-body">
                Priority
              </label>
              <div className="relative">
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  disabled={isSubmitting}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-body focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 appearance-none bg-white"
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <ApperIcon name="ChevronDown" className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>
          </div>

{!editMode && (
            <>
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

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 font-body">
                  Tags
                </label>
                <Input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="Enter tags separated by commas"
                  disabled={isSubmitting}
                  className="font-body"
                />
                <p className="text-xs text-gray-500 mt-1 font-body">
                  Separate multiple tags with commas (e.g., urgent, meeting, review)
                </p>
              </div>
            </>
          )}

          <Button
            type="submit"
            disabled={isSubmitting || !title.trim()}
            className="w-full mt-6 font-display font-medium"
            size="lg"
          >
            {isSubmitting ? (
              <>
                <ApperIcon name="Loader2" className="mr-2 h-4 w-4 animate-spin" />
                {editMode ? 'Updating Task...' : 'Creating Task...'}
              </>
            ) : (
              <>
                <ApperIcon name={editMode ? "Save" : "Plus"} className="mr-2 h-4 w-4" />
                {editMode ? 'Update Task' : 'Create Task'}
              </>
            )}
          </Button>
        </form>
      </Card>
    </motion.div>
  )
}

export default TaskForm