import { motion } from "framer-motion"
import Button from "@/components/atoms/Button"
import Card from "@/components/atoms/Card"
import ApperIcon from "@/components/ApperIcon"

const Error = ({ message = "Something went wrong", onRetry }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="flex items-center justify-center min-h-[400px]"
    >
      <Card className="p-8 text-center max-w-md mx-auto shadow-lg border-0 bg-gradient-to-br from-white to-red-50">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="p-4 bg-error/10 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center"
        >
          <ApperIcon name="AlertTriangle" className="h-10 w-10 text-error" />
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <h3 className="text-xl font-display font-semibold text-gray-900 mb-2">
            Oops! Something went wrong
          </h3>
          
          <p className="text-gray-600 font-body mb-6 leading-relaxed">
            {message}
          </p>

          {onRetry && (
            <Button
              onClick={onRetry}
              variant="primary"
              className="font-display font-medium"
            >
              <ApperIcon name="RotateCcw" className="mr-2 h-4 w-4" />
              Try Again
            </Button>
          )}
        </motion.div>
      </Card>
    </motion.div>
  )
}

export default Error