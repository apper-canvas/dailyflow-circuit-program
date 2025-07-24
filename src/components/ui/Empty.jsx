import { motion } from "framer-motion"
import Button from "@/components/atoms/Button"
import Card from "@/components/atoms/Card"
import ApperIcon from "@/components/ApperIcon"

const Empty = ({ onAddTask }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex items-center justify-center min-h-[300px]"
    >
      <Card className="p-8 text-center max-w-md mx-auto shadow-lg border-0 bg-gradient-to-br from-white to-primary/5">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="p-6 bg-primary/10 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center"
        >
          <ApperIcon name="CheckSquare" className="h-12 w-12 text-primary" />
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <h3 className="text-2xl font-display font-semibold text-gray-900 mb-3">
            Ready to get productive?
          </h3>
          
          <p className="text-gray-600 font-body mb-8 leading-relaxed">
            You don't have any tasks yet. Create your first task and start organizing your day!
          </p>

          <Button
            onClick={onAddTask}
            variant="primary"
            size="lg"
            className="font-display font-medium"
          >
            <ApperIcon name="Plus" className="mr-2 h-5 w-5" />
            Create Your First Task
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          className="mt-8 pt-6 border-t border-gray-100"
        >
          <div className="flex justify-center items-center gap-6 text-sm text-gray-500 font-body">
            <div className="flex items-center gap-1">
              <ApperIcon name="Zap" className="h-4 w-4" />
              <span>Quick & Easy</span>
            </div>
            <div className="flex items-center gap-1">
              <ApperIcon name="Target" className="h-4 w-4" />
              <span>Stay Focused</span>
            </div>
          </div>
        </motion.div>
      </Card>
    </motion.div>
  )
}

export default Empty