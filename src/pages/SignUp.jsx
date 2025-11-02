import { createUserWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../config/firebase";
import { useDispatch } from "react-redux";
import { signUpUser } from "../features/todos/todoSlice";
import { toast } from "react-toastify";

const SignUp = () => {
    const [input, setInput] = useState({
        email: "",
        password: "",
    });
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleChange = (e) => {
        setInput({ ...input, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (input.email.trim() === "" || input.password.trim() === "") {
            toast.error("Enter all details correctly!");
            setInput({ email: "", password: "" });
            return;
        }

        try {
            await dispatch(signUpUser({ email: input.email, password: input.password }));
            toast.success("Account created successfully!");
            setInput({ email: "", password: "" });
            navigate("/");
        } catch (error) {
            toast.error("Something went wrong. Please try again.");
            setInput({ email: "", password: "" });
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-50 to-gray-200 px-4">
            <form onSubmit={handleSubmit} className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-10 sm:p-12">
                <h2 className="text-3xl font-semibold text-center text-gray-800 mb-8">
                    Create Account
                </h2>

                <div className="mb-6">
                    <label htmlFor="email" className="block mb-2 text-base font-semibold text-gray-700 uppercase">
                        Email
                    </label>
                    <input type="email" onChange={handleChange} value={input.email} id="email"
                        className="bg-gray-100 border border-gray-300 text-gray-900 text-base rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
                        placeholder="Enter your email"/>
                </div>

                <div className="mb-6">
                    <label htmlFor="password" className="block mb-2 text-base font-semibold text-gray-700 uppercase">
                        Password
                    </label>
                    <input type="password" onChange={handleChange} value={input.password} id="password"
                        className="bg-gray-100 border border-gray-300 text-gray-900 text-base rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
                        placeholder="Create a password" />
                </div>

                <button type="submit"
                    className="w-full bg-[#04265d] hover:bg-[#0f4499] text-white font-medium rounded-lg text-base px-5 py-3 transition-all"
                >
                    Sign Up
                </button>

                <p className="text-md text-center text-gray-700 mt-5">
                    Already have an account?{" "}
                    <a
                        href="/sign-in"
                        className="font-medium text-blue-700 hover:underline"
                    >
                        Sign In
                    </a>
                </p>
            </form>
        </div>
    );
};

export default SignUp;
