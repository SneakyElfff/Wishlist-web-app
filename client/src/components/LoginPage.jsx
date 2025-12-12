import React, { useState} from "react";
import axios from "axios";

const LoginPage = ({ onLoginSuccess }) => {
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await axios.post('/api/login', { login, password });
            // TODO: later use JWT
            localStorage.setItem("isAuthenticated", 'true');
            localStorage.setItem("user", JSON.stringify(res.data.user));
            localStorage.setItem("userLogin", login);

            onLoginSuccess(login);
        } catch (err) {
            setError(err.response?.data?.message || 'Ошибка входа');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
            <div className="bg-gray-800 p-10 rounded-2xl shadow-2xl w-full max-w-md">
                <h2 className="text-3xl font-bold text-center text-cyan-400 mb-8">
                    Wish List
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <input
                        type="text"
                        placeholder="Логин"
                        value={login}
                        onChange={(e) => setLogin(e.target.value)}
                        className="w-full p-4 bg-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"

                    />

                    <input
                        type="password"
                        placeholder="Пароль"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-4 bg-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"

                    />

                    {error && <p className="text-red-400 text-center">{error}</p>}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50 text-white font-bold py-4 rounded-lg transition"
                    >
                        {loading ? 'Терпение...' : 'Войти'}
                    </button>
                </form>

                <p className="text-gray-400 text-center mt-6 text-sm">
                    Если вы не знаете, что вводить: хлоп-хлоп, пшел вон
                </p>
            </div>
        </div>
    );
};

export default LoginPage;