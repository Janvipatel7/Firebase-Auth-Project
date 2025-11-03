import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { signInUser, signInWithGoogle } from "../features/todos/todoSlice";
import { toast } from "react-toastify";

const SignIn = () => {
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
            await dispatch(signInUser({ email: input.email, password: input.password }));
            toast.success("Sign In successful!");
            setInput({ email: "", password: "" });
            navigate("/");
        } catch (error) {
            toast.error("Invalid credentials. Please try again.");
            setInput({ email: "", password: "" });
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-50 to-gray-200 px-4 sm:px-6">
            <form  onSubmit={handleSubmit}  className="w-full max-w-md sm:max-w-lg bg-white rounded-2xl shadow-xl p-6 sm:p-10">
                <h2 className="text-2xl sm:text-3xl font-semibold text-center text-[#04265d] mb-6 sm:mb-8">
                    Sign In
                </h2>

                <div className="mb-5 sm:mb-6">
                    <label htmlFor="email" className="block mb-2 text-sm sm:text-base uppercase font-semibold text-gray-700">
                        Email
                    </label>
                    <input type="email" onChange={handleChange} value={input.email} id="email"
                        className="bg-gray-100 border border-gray-300 text-gray-900 text-sm sm:text-base rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 sm:p-3"
                        placeholder="Enter your email"/>
                </div>

                <div className="mb-5 sm:mb-6">
                    <label htmlFor="password" className="block mb-2 text-sm sm:text-base uppercase font-semibold text-gray-700">
                        Password
                    </label>
                    <input type="password" onChange={handleChange} value={input.password} id="password"
                        className="bg-gray-100 border border-gray-300 text-gray-900 text-sm sm:text-base rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 sm:p-3"
                        placeholder="Enter your password"/>
                </div>

                <div className="mb-4">
                    <button type="submit" className="w-full bg-[#04265d] hover:bg-[#0f4499] text-white font-medium rounded-lg text-sm sm:text-base px-4 sm:px-5 py-2.5 sm:py-3 transition-all">
                        Sign In
                    </button>
                </div>


                <div className="mb-5 sm:mb-6">
                    <button
                        type="button"
                        onClick={() => {
                            dispatch(signInWithGoogle());
                            toast.success("Login with Google successful!");
                            setInput({ email: "", password: "" });
                            navigate("/");
                        }}
                        className="w-full text-white bg-blue-700 hover:bg-blue-800 transition-all flex items-center justify-center gap-2 sm:gap-3 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm sm:text-base px-4 sm:px-5 py-2.5 sm:py-3"
                    >
                        <svg width={20} height={20}  viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g clipPath="url(#clip0)">
                                <path d="M20.3081 10.2303C20.3081 9.55056 20.253 8.86711 20.1354 8.19836H10.7031V12.0492H16.1046C15.8804 13.2911 15.1602 14.3898 14.1057 15.0879V17.5866H17.3282C19.2205 15.8449 20.3081 13.2728 20.3081 10.2303Z" fill="#3F83F8"/>
                                <path d="M10.7019 20.0006C13.3989 20.0006 15.6734 19.1151 17.3306 17.5865L14.1081 15.0879C13.2115 15.6979 12.0541 16.0433 10.7056 16.0433C8.09669 16.0433 5.88468 14.2832 5.091 11.9169H1.76562V14.4927C3.46322 17.8695 6.92087 20.0006 10.7019 20.0006Z" fill="#34A853"/>
                                <path d="M5.08857 11.9169C4.66969 10.6749 4.66969 9.33008 5.08857 8.08811V5.51233H1.76688C0.348541 8.33798 0.348541 11.667 1.76688 14.4927L5.08857 11.9169Z" fill="#FBBC04"/>
                                <path d="M10.7019 3.95805C12.1276 3.936 13.5055 4.47247 14.538 5.45722L17.393 2.60218C15.5852 0.904587 13.1858 -0.0287217 10.7019 0.000673888C6.92087 0.000673888 3.46322 2.13185 1.76562 5.51234L5.08732 8.08813C5.87733 5.71811 8.09302 3.95805 10.7019 3.95805Z" fill="#EA4335"/>
                            </g>
                            <defs>
                                <clipPath id="clip0">
                                    <rect width="20" height="20" fill="white" transform="translate(0.5)" />
                                </clipPath>
                            </defs>
                        </svg>
                        Sign in with Google
                    </button>
                </div>

                
                <p className="text-md text-center text-gray-700 mt-5">
                    Don’t have an account yet?{" "}
                    <Link
                        to={"/sign-up"}
                        className="font-medium text-blue-700 hover:underline"
                    >
                        Sign up
                    </Link>
                </p>
            </form>
        </div>
    );
};

export default SignIn;
