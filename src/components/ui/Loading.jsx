import { motion } from "framer-motion"
import Card from "@/components/atoms/Card"

const Loading = () => {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-8"
      >
        <div className="h-8 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-lg w-64 mx-auto mb-2 animate-pulse"></div>
        <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded w-48 mx-auto animate-pulse"></div>
      </motion.div>

      {/* Stats skeleton */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="p-4">
            <div className="text-center space-y-2">
              <div className="h-10 w-10 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-lg mx-auto animate-pulse"></div>
              <div className="h-6 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded w-12 mx-auto animate-pulse"></div>
              <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded w-16 mx-auto animate-pulse"></div>
            </div>
          </Card>
        ))}
      </div>

      {/* Form skeleton */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-lg animate-pulse"></div>
            <div className="h-6 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded w-32 animate-pulse"></div>
          </div>
          
          <div className="space-y-2">
            <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded w-20 animate-pulse"></div>
            <div className="h-10 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded animate-pulse"></div>
          </div>

          <div className="space-y-2">
            <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded w-32 animate-pulse"></div>
            <div className="h-20 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded animate-pulse"></div>
          </div>

          <div className="h-12 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-lg animate-pulse"></div>
        </div>
      </Card>

      {/* Task list skeleton */}
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="p-4">
            <div className="flex items-start gap-4">
              <div className="h-5 w-5 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded animate-pulse mt-1"></div>
              <div className="flex-1 space-y-2">
                <div className="h-5 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded w-3/4 animate-pulse"></div>
                <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded w-1/2 animate-pulse"></div>
                <div className="h-3 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded w-32 animate-pulse"></div>
              </div>
              <div className="h-8 w-8 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded animate-pulse"></div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default Loading