import { useState, useEffect, useRef, useContext } from "react"
import { motion } from "framer-motion"
import { useSelector } from 'react-redux'
import taskService from "@/services/api/taskService"
import TaskForm from "@/components/molecules/TaskForm"
import TaskStats from "@/components/molecules/TaskStats"
import TaskList from "@/components/organisms/TaskList"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import { AuthContext } from "../App"

const TasksPage = () => {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
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
                <h2 className="text-2xl font-display font-semibold text-gray-800">
                  Your Tasks
                </h2>
                <div className="text-sm text-gray-500 font-body">
                  {tasks.length} {tasks.length === 1 ? "task" : "tasks"} total
                </div>
              </div>
              
              <TaskList
                tasks={tasks}
                onToggleComplete={handleToggleComplete}
                onUpdate={handleTaskUpdate}
                onDelete={handleDeleteTask}
                separateOverdue={true}
              />
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default TasksPage