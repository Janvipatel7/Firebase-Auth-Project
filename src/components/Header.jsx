import { useDispatch } from "react-redux";
import { logout } from "../features/todos/todoSlice";
import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../config/firebase";

const Header = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await signOut(auth);
            dispatch(logout());
            navigate("/sign-in");
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <header className="bg-gradient-to-r from-blue-50 to-gray-100 shadow-md">
            <nav className="max-w-5xl mx-auto flex justify-between items-center py-4 px-6">
                <Link href="/" className="flex items-center gap-2">
                    <span className="text-2xl font-semibold text-[#04265d] tracking-wide">
                        TaskTracker
                    </span>
                </Link>

                <ul className="flex items-center space-x-6 font-medium">
                    <li>
                        <button
                            onClick={handleLogout}
                            className="px-6 py-2 bg-blue-500 text-white rounded-lg shadow-sm hover:bg-blue-600 transition-all duration-300"
                        >
                            Logout
                        </button>
                    </li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;
