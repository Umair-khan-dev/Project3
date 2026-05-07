import { useState } from "react";
import axios from "axios";

export default function Login({ setUser }) {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            if (isLogin) {
                const res = await axios.post("http://localhost:5000/api/auth/login", {
                    email,
                    password,
                });
                localStorage.setItem("token", res.data.token);
                setUser(res.data.user);
            } else {
                await axios.post("http://localhost:5000/api/auth/register", {
                    username,
                    email,
                    password,
                });
                alert("Registration successful! Please login.");
                setIsLogin(true);
            }
        } catch (err) {
            setError(err.response?.data?.msg || "Something went wrong. Please check your connection.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-screen w-full flex items-center justify-center bg-gray-950 chat-bg font-sans p-4">
            <div className="card w-full max-w-md p-8 border border-gray-800 backdrop-blur-xl bg-gray-900/50">
                <div className="text-center mb-10">
                    <div className="inline-block p-4 rounded-2xl bg-green-500/10 mb-4 border border-green-500/20">
                        <span className="text-4xl">💬</span>
                    </div>
                    <h1 className="text-3xl font-extrabold text-white mb-2 tracking-tight">
                        {isLogin ? "Welcome Back" : "Join the Chat"}
                    </h1>
                    <p className="text-gray-400 font-medium">
                        {isLogin ? "Sign in to your account" : "Create a new account to start chatting"}
                    </p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-xl mb-8 text-sm flex items-center gap-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    {!isLogin && (
                        <div>
                            <label className="block text-sm font-semibold text-gray-300 mb-2">Username</label>
                            <input 
                                className="w-full bg-gray-800/50 text-white px-5 py-3 rounded-xl border border-gray-700 focus:border-green-500 focus:ring-4 focus:ring-green-500/10 outline-none transition-all placeholder:text-gray-600" 
                                placeholder="Choose a username" 
                                required
                                onChange={e => setUsername(e.target.value)} 
                            />
                        </div>
                    )}
                    <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">Email Address</label>
                        <input 
                            type="email"
                            className="w-full bg-gray-800/50 text-white px-5 py-3 rounded-xl border border-gray-700 focus:border-green-500 focus:ring-4 focus:ring-green-500/10 outline-none transition-all placeholder:text-gray-600" 
                            placeholder="name@example.com" 
                            required
                            onChange={e => setEmail(e.target.value)} 
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">Password</label>
                        <input 
                            type="password" 
                            className="w-full bg-gray-800/50 text-white px-5 py-3 rounded-xl border border-gray-700 focus:border-green-500 focus:ring-4 focus:ring-green-500/10 outline-none transition-all placeholder:text-gray-600" 
                            placeholder="••••••••" 
                            required
                            onChange={e => setPassword(e.target.value)} 
                        />
                    </div>
                    <button 
                        type="submit"
                        disabled={loading}
                        className="btn-primary w-full py-4 font-bold text-lg shadow-xl shadow-green-500/20 transform active:scale-[0.98] transition-all mt-6 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                        {loading ? (
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : (
                            isLogin ? "Sign In" : "Get Started"
                        )}
                    </button>
                </form>

                <div className="mt-10 text-center">
                    <p className="text-gray-400 font-medium">
                        {isLogin ? "New here?" : "Already have an account?"}
                        <button 
                            onClick={() => setIsLogin(!isLogin)} 
                            className="text-green-500 ml-2 font-bold hover:text-green-400 transition-colors"
                        >
                            {isLogin ? "Create an account" : "Sign in instead"}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}