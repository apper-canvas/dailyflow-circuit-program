import { BrowserRouter as Router } from "react-router-dom"
import { ToastContainer } from "react-toastify"
import TasksPage from "@/components/pages/TasksPage"

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background">
        <TasksPage />
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          style={{ zIndex: 9999 }}
        />
      </div>
    </Router>
  )
}

export default App