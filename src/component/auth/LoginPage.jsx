import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import ApiService from "../../service/ApiService";

function LoginPage() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || "/home";

    /* OAuth redirect */
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get("token");

        if (token) {
            localStorage.setItem("token", token);
            localStorage.setItem("role", "USER");
            navigate("/home", { replace: true });
        }
    }, [navigate]);

    /* Google Login */
    const handleGoogleLogin = () => {
        window.location.href = "https://urbanprimehotel-backend.onrender.com/oauth2/authorization/google";
    };

    /* Normal Login */
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            setError("Please fill all fields");
            setTimeout(() => setError(''), 5000);
            return;
        }

        try {
            const response = await ApiService.loginUser({ email, password });

            if (response.statusCode === 200) {
                localStorage.setItem("token", response.token);
                localStorage.setItem("role", response.role);
                navigate(from, { replace: true });
            }

        } catch (error) {
            setError(error.response?.data?.message || error.message);
            setTimeout(() => setError(''), 5000);
        }
    };

    return (

        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">

            {/* CARD */}
            <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">

                <h2 className="text-2xl font-bold text-center text-teal-700 mb-6">
                    Welcome Back 👋
                </h2>

                {/* ERROR */}
                {error && (
                    <p className="text-red-500 text-center mb-4 font-semibold">
                        {error}
                    </p>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">

                    {/* EMAIL */}
                    <div>
                        <label className="block font-medium mb-1">Email</label>
                        <input
                            type="email"
                            placeholder="Enter email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-2 border rounded outline-none focus:ring-2 focus:ring-teal-500"
                        />
                    </div>

                    {/* PASSWORD */}
                    <div>
                        <label className="block font-medium mb-1">Password</label>
                        <input
                            type="password"
                            placeholder="Enter password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-2 border rounded outline-none focus:ring-2 focus:ring-teal-500"
                        />
                    </div>

                    {/* LOGIN BUTTON */}
                    <button
                        type="submit"
                        className="w-full bg-teal-700 text-white py-2 rounded hover:bg-blue-900 transition"
                    >
                        Login
                    </button>

                    {/* DIVIDER */}
                    <div className="text-center text-gray-400">OR</div>

                    {/* GOOGLE LOGIN */}
                    <button
                        type="button"
                        onClick={handleGoogleLogin}
                        className="w-full border border-gray-300 py-2 rounded flex items-center justify-center gap-2 hover:bg-gray-100 transition"
                    >
                        <img
                            src="https://www.svgrepo.com/show/475656/google-color.svg"
                            alt="Google"
                            className="w-5 h-5"
                        />
                        Login with Google
                    </button>

                </form>

                {/* REGISTER LINK */}
                <p className="text-center text-sm mt-4">
                    Don't have an account?{" "}
                    <Link to="/register" className="text-teal-700 font-semibold hover:underline">
                        Register
                    </Link>
                </p>

            </div>

        </div>
    );
}

export default LoginPage;