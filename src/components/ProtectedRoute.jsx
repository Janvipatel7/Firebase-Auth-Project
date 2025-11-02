import { onAuthStateChanged } from "firebase/auth"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { auth } from "../config/firebase"
import SignIn from "../pages/SignIn"
import { setUser } from "../features/todos/todoSlice"

const ProtectedRoute = ({ Component }) => {
    const dispatch = useDispatch()
    const user = useSelector((store) => store.todos.currentUser)

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                const { uid, displayName, email } = user
                dispatch(setUser({ id: uid, name: displayName, email }))
            }
        })
        return () => unsubscribe()
    }, [])

    if (!user) {
        return <SignIn />
    } else {
        return <Component />
    }
}

export default ProtectedRoute