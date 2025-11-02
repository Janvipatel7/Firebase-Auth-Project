import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { addTodo, deleteTodo, fetchTodo, updateTodo } from "../features/todos/todoSlice"
import { doc, getDoc } from "firebase/firestore"
import { db } from "../config/firebase"
import { toast } from "react-toastify";

const Todos = () => {
    const [input, setInput] = useState({ task: '', priority: '' })
    const [isEdit, setIsEdit] = useState(false)
    const [updateId, setUpdateId] = useState(null)
    const [showForm, setShowForm] = useState(false)
    const [filter, setFilter] = useState("all")

    const dispatch = useDispatch()
    const user = useSelector((store) => store.todos.currentUser)
    const todos = useSelector((store) => store.todos.list)

    useEffect(() => {
        if (user?.id) dispatch(fetchTodo(user.id))
    }, [user])

    useEffect(() => {
        if (updateId) {
            const getTodo = async () => {
                const todo = await getDoc(doc(db, `${user.id}`, updateId))
                setInput(todo.data())
                setIsEdit(true)
                setShowForm(true)
            }
            getTodo()
        }
    }, [updateId])

    const handleChange = (e) => {
        setInput({ ...input, [e.target.id]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!input.task.trim() || !input.priority) {
            toast.error("Enter all details correctly!");
            return;
        }

        const isDuplicate = todos.some(
            (todo) => todo.task.toLowerCase() === input.task.trim().toLowerCase()
        );

        if (isDuplicate && !isEdit) {
            toast.error("This task already exists!");
            setInput({ task: '', priority: '' });
            return;
        }

        try {
            if (!isEdit) {
                dispatch(addTodo({ uid: user.id, data: input }));
                toast.success("Task added successfully!");
                setInput({ task: '', priority: '' });
            } else {
                dispatch(updateTodo({ uid: user.id, updateId, data: input }));
                toast.success("Task updated successfully!");
                setInput({ task: '', priority: '' });
                setIsEdit(false);
                setUpdateId(null);
            }

            dispatch(fetchTodo(user.id));
            setInput({ task: "", priority: "" });
            setShowForm(false);
        } catch (error) {
            toast.error("Error while adding task: " + error.message);
            setInput({ task: '', priority: '' });
        }
    };


    const handleStatusChange = (task) => {
        if (task.status !== "completed") {
            dispatch(updateTodo({
                uid: user.id,
                updateId: task.id,
                data: { ...task, status: "completed" }
            }))
            toast.success("Task marked as completed!");
        } else {
            toast.info("Task already completed!");
        }

        setTimeout(() => {
            dispatch(fetchTodo(user.id));
        }, 500);
    };


    const filteredTodos = todos.filter(task =>
        filter === "all" ? true : filter === "pending"
            ? task.status !== "completed"
            : task.status === "completed"
    )

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 flex justify-center py-10 px-4">
            <div className="bg-white shadow-xl rounded-3xl w-full max-w-lg p-6">

                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-2xl font-semibold text-[#04265d]">Today’s Task</h2>
                    </div>
                    <button
                        onClick={() => {
                            setShowForm(!showForm)
                            setIsEdit(false)
                            setInput({ task: '', priority: '' })
                        }}
                        className="px-4 py-2 bg-blue-100 text-blue-600 font-medium rounded-xl hover:bg-blue-200 transition"
                    >
                        + New Task
                    </button>
                </div>

                {showForm && (
                    <form onSubmit={handleSubmit} className="mb-6 space-y-4 bg-gray-50 p-4 rounded-2xl border border-gray-200 shadow-sm">
                        <input type="text" id="task" onChange={handleChange} value={input.task}
                            placeholder="Enter task..." className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400" required
                        />
                        <select id="priority" onChange={handleChange} value={input.priority}
                            className="w-full p-3 rounded-xl border border-gray-200 text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        >
                            <option value="">Select Priority</option>
                            <option value="high">High</option>
                            <option value="medium">Medium</option>
                            <option value="low">Low</option>
                        </select>
                        <button type="submit"
                            className="w-full py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition"
                        >
                            {isEdit ? "Update Task" : "Add Task"}
                        </button>
                    </form>
                )}

                <div className="flex justify-around border-b pb-3 mb-6 text-gray-500 font-medium text-md">
                    {["all", "pending", "completed"].map((tab) => (
                        <button key={tab} onClick={() => setFilter(tab)}
                            className={`pb-1 transition ${filter === tab
                                ? "text-gray-900 border-b-2 border-gray-900"
                                : "hover:text-gray-800"
                                }`}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </div>

                <div className="space-y-4">
                    {filteredTodos.length === 0 ? (
                        <p className="text-center mb-6 space-y-4 bg-gray-50 p-4 rounded-2xl border border-gray-200 shadow-sm">No tasks available</p>
                    ) : (
                        filteredTodos.map((task) => (
                            <div key={task.id}
                                className="bg-white shadow-sm border border-gray-100 rounded-2xl p-4 flex justify-between items-start hover:shadow-md transition"
                            >
                                <div>
                                    <h3 className="text-lg text-gray-900 capitalize">{task.task}</h3>
                                    <p className="text-md text-gray-500 capitalize">{task.priority}</p>
                                    <p
                                        className={`text-xs font-semibold mt-1 capitalize ${task.status === "completed"
                                            ? "text-green-500"
                                            : "text-yellow-500"
                                            }`}
                                    >
                                        {task.status || "pending"}
                                    </p>
                                </div>

                                <div className="flex flex-col gap-1 items-end">
                                    <button
                                        onClick={() => handleStatusChange(task)}
                                        disabled={task.status === "completed"}
                                        className={`text-xs px-3 py-1 rounded-full ${task.status === "completed"
                                            ? "bg-green-100 text-green-600"
                                            : "bg-blue-100 text-blue-600 hover:bg-blue-200"
                                            }`}
                                    >
                                        {task.status === "completed" ? "Done" : "Mark Done"}
                                    </button>

                                    <div className="flex justify-center gap-4 mt-2">
                                        {task.status !== "completed" && (
                                            <button onClick={() => setUpdateId(task.id)}
                                                className="text-[#014e4e] hover:scale-110 transition"
                                                title="Edit Task">
                                                <svg className="w-5 h-5 text-[#014e4e]" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z" />
                                                </svg>
                                            </button>
                                        )}

                                        <button
                                            onClick={() => {
                                                dispatch(deleteTodo({ uid: user.id, deleteId: task.id }))
                                                dispatch(fetchTodo(user.id))
                                            }}
                                            className="text-red-600 hover:scale-110 transition" title="Delete Task">
                                            <svg className="w-5 h-5 text-red-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}

export default Todos
