import { motion } from "framer-motion"
import Card from "@/components/atoms/Card"
import ApperIcon from "@/components/ApperIcon"

const TaskStats = ({ tasks }) => {
  const totalTasks = tasks.length
  const completedTasks = tasks.filter(task => task.isCompleted).length
  const pendingTasks = totalTasks - completedTasks
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
  
  // Calculate overdue tasks
  const overdueTasks = tasks.filter(task => {
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
  }).length

  const stats = [
    {
      label: "Total Tasks",
      value: totalTasks,
      icon: "List",
      color: "text-primary",
      bgColor: "bg-primary/10"
    },
    {
      label: "Completed",
      value: completedTasks,
      icon: "CheckCircle2",
      color: "text-success",
      bgColor: "bg-success/10"
    },
    {
      label: "Overdue",
      value: overdueTasks,
      icon: "AlertCircle",
      color: "text-error",
      bgColor: "bg-error/10"
    },
    {
      label: "Progress",
      value: `${completionRate}%`,
      icon: "TrendingUp",
      color: "text-info",
      bgColor: "bg-info/10"
    }
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <Card className="p-4 text-center hover:shadow-md transition-shadow duration-200">
            <div className={`inline-flex p-2 rounded-lg ${stat.bgColor} mb-2`}>
              <ApperIcon name={stat.icon} className={`h-5 w-5 ${stat.color}`} />
            </div>
            <div className="text-2xl font-display font-bold text-gray-900 mb-1">
              {stat.value}
            </div>
            <div className="text-sm font-body text-gray-600">
              {stat.label}
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}

export default TaskStats