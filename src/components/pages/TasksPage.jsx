import React, { useContext, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { AuthContext } from "../../App";
import taskService from "@/services/api/taskService";
import ApperIcon from "@/components/ApperIcon";
import TaskList from "@/components/organisms/TaskList";
import Button from "@/components/atoms/Button";
import TaskStats from "@/components/molecules/TaskStats";
import TaskForm from "@/components/molecules/TaskForm";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Loading from "@/components/ui/Loading";
const TasksPage = () => {
const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
const [selectedTasks, setSelectedTasks] = useState([])
  const [showBulkActions, setShowBulkActions] = useState(false)
  const [selectMode, setSelectMode] = useState(false)
  const formRef = useRef(null)
  
  // Move hooks to top level to avoid conditional calling
  const { user } = useSelector((state) => state.user);
  const { logout } = useContext(AuthContext);
  const loadTasks = async () => {
    try {
      setError("")
      setLoading(true)
      const data = await taskService.getAll()
      setTasks(data)
    } catch (err) {
      setError("Failed to load tasks. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTasks()
  }, [])

const handleTaskCreated = async (taskData) => {
    const newTask = await taskService.create(taskData)
    setTasks(prevTasks => [...prevTasks, newTask])
  }

const handleToggleComplete = async (taskId) => {
    const updatedTask = await taskService.toggleComplete(taskId)
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.Id === taskId ? updatedTask : task
      )
    )
  }

const handleSelectionChange = (taskId, isSelected) => {
    setSelectedTasks(prev => {
      const updated = isSelected 
        ? [...prev, taskId]
        : prev.filter(id => id !== taskId)
      
      setShowBulkActions(updated.length > 0)
      return updated
    })
  }

  const handleSelectModeToggle = () => {
    setSelectMode(!selectMode)
    if (selectMode) {
      // Exiting select mode, clear selections
      setSelectedTasks([])
      setShowBulkActions(false)
    }
  }

const handleBulkComplete = async () => {
    if (selectedTasks.length === 0) return
    
    const updatedTasks = await taskService.bulkUpdate(selectedTasks, { 
      is_completed_c: true 
    })
    
    if (updatedTasks.length > 0) {
      setTasks(prevTasks =>
        prevTasks.map(task =>
          selectedTasks.includes(task.Id) 
            ? { ...task, isCompleted: true, is_completed_c: true }
            : task
        )
      )
      setSelectedTasks([])
      setShowBulkActions(false)
      setSelectMode(false)
    }
  }

const handleBulkDelete = async () => {
    if (selectedTasks.length === 0) return
    
    const confirmed = window.confirm(
      `Are you sure you want to delete ${selectedTasks.length} task${selectedTasks.length > 1 ? 's' : ''}? This action cannot be undone.`
    )
    
    if (!confirmed) return
    
    const success = await taskService.bulkDelete(selectedTasks)
    
    if (success) {
      setTasks(prevTasks =>
        prevTasks.filter(task => !selectedTasks.includes(task.Id))
      )
      setSelectedTasks([])
      setShowBulkActions(false)
      setSelectMode(false)
    }
  }

const handleBulkPriorityChange = async (priority) => {
    if (selectedTasks.length === 0) return
    
    const updatedTasks = await taskService.bulkUpdate(selectedTasks, { 
      priority_c: priority 
    })
    
    if (updatedTasks.length > 0) {
      setTasks(prevTasks =>
        prevTasks.map(task =>
          selectedTasks.includes(task.Id) 
            ? { ...task, priority: priority, priority_c: priority }
            : task
        )
      )
      setSelectedTasks([])
      setShowBulkActions(false)
      setSelectMode(false)
    }
  }

const handleTaskUpdate = async (taskId, updates) => {
    const updatedTask = await taskService.update(taskId, updates)
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.Id === taskId ? updatedTask : task
      )
    )
  }

const handleDeleteTask = async (taskId) => {
    await taskService.delete(taskId)
    setTasks(prevTasks =>
      prevTasks.filter(task => task.Id !== taskId)
    )
  }

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth" })
  }
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Loading />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Error message={error} onRetry={loadTasks} />
        </div>
      </div>
    )
  }


  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-primary to-secondary rounded-xl shadow-lg">
                <ApperIcon name="CheckSquare" className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-4xl font-display font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                DailyFlow
              </h1>
            </div>
            <div className="flex items-center gap-4">
              {user && (
                <div className="text-right">
                  <p className="text-sm text-gray-600">Welcome back,</p>
                  <p className="font-medium text-gray-800">{user.firstName} {user.lastName}</p>
                </div>
              )}
              <Button 
                variant="outline" 
                size="sm" 
                onClick={logout}
                className="flex items-center gap-2"
              >
                <ApperIcon name="LogOut" className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
          <p className="text-gray-600 font-body text-lg">
            Organize your day, accomplish your goals
          </p>
        </motion.div>

        {/* Stats */}
        {tasks.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="mb-8"
          >
            <TaskStats tasks={tasks} />
          </motion.div>
        )}

        {/* Task Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mb-8"
          ref={formRef}
        >
          <TaskForm onTaskCreated={handleTaskCreated} />
        </motion.div>

        {/* Task List or Empty State */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          {tasks.length === 0 ? (
            <Empty onAddTask={scrollToForm} />
) : (
            <div>
<div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-display font-semibold text-gray-800">
                    Your Tasks
                  </h2>
                  <div className="text-sm text-gray-500 font-body mt-1">
                    {tasks.length} {tasks.length === 1 ? "task" : "tasks"} total
                    {selectedTasks.length > 0 && (
                      <span className="ml-2 text-primary font-medium">
                        • {selectedTasks.length} selected
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Button
                    variant={selectMode ? "primary" : "outline"}
                    size="sm"
                    onClick={handleSelectModeToggle}
                    className="flex items-center gap-2"
                  >
                    <ApperIcon name={selectMode ? "CheckSquare" : "Square"} className="h-4 w-4" />
                    {selectMode ? "Exit Select Mode" : "Select Tasks"}
                  </Button>
                </div>
              </div>
              
<TaskList
                tasks={tasks}
                onToggleComplete={handleToggleComplete}
                onUpdate={handleTaskUpdate}
                onDelete={handleDeleteTask}
                separateOverdue={true}
                selectedTasks={selectedTasks}
                onSelectionChange={handleSelectionChange}
                onBulkComplete={handleBulkComplete}
                onBulkDelete={handleBulkDelete}
                onBulkPriorityChange={handleBulkPriorityChange}
                selectMode={selectMode}
              />
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default TasksPage