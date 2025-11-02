import { BrowserRouter, Route, Router, Routes } from "react-router-dom"
import ProtectedRoute from "./components/ProtectedRoute"
import Todos from "./pages/Todos"
import SignUp from "./pages/SignUp"
import SignIn from "./pages/SignIn"
import { useSelector } from "react-redux"
import Header from "./components/Header"
import { ToastContainer } from "react-toastify"

const App = () => {
  const users = useSelector((store) => store.todos.currentUser)
  return (
    <BrowserRouter>
      {users && <Header />}
      <Routes>
        <Route path="/" element={<ProtectedRoute Component={Todos} />}></Route>
        <Route path="/edit-todo/:id" element={<ProtectedRoute Component={Todos} />}></Route>
        <Route path="/sign-up" element={<SignUp />}></Route>
        <Route path="/sign-in" element={<SignIn />}></Route>
      </Routes>
      <ToastContainer/>
    </BrowserRouter>
  )
}

export default App