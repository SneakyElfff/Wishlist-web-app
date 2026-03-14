import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserFormModal = ({ isOpen, onClose, user, onSuccess }) => {
    const [form, setForm] = useState({ login: '', password: '', role: 'user' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!isOpen) {
            setForm({ login: '', password: '', role: 'user' });
            setError('');
        }
    }, [isOpen]);

    useEffect(() => {
        if (isOpen) {
            if (user) {
                setForm({
                    login: user.login || '',
                    password: '',
                    role: user.role || 'user',
                });
            } else {
                setForm({ login: '', password: '', role: 'user' });
            }
            setError('');
        }
    }, [isOpen, user]);

    if (!isOpen) return null;

    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (user) {
                // update
                await axios.put(`/api/users/${user._id}`, form);
            } else {
                // create
                if (!form.password)
                    throw new Error('Пароль обязателен');
                await axios.post('/api/users', form);
            }

            onSuccess();
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Ошибка');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
            <div className="bg-gray-800 p-8 rounded-xl shadow-2xl max-w-md w-full">
                <h3 className="text-2xl font-bold mb-4 text-cyan-400">
                    {user ? 'Редактировать пользователя' : 'Добавить нового пользователя'}
                </h3>

                {error && <p className="text-red-400 mb-4 text-center">{error}</p>}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm mb-1">Логин</label>
                        <input
                            name="login"
                            value={form.login}
                            onChange={handleChange}
                            className="w-full p-3 bg-gray-700 border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm mb-1">
                            {user ? 'Новый пароль (оставьте пустым если не меняете)' : 'Пароль *'}
                        </label>
                        <input
                            name="password"
                            type="password"
                            value={form.password}
                            onChange={handleChange}
                            className="w-full p-3 bg-gray-700 border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
                            {...(!user && { required: true })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm mb-1">Роль</label>
                        <select
                            name="role"
                            value={form.role}
                            onChange={handleChange}
                            className="w-full p-3 h-12 bg-gray-700 border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
                        >
                            <option value="user">Пользователь</option>
                            <option value="admin">Администратор</option>
                        </select>
                    </div>

                    <div className="flex gap-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50 shadow-md px-4 py-3 rounded-lg transition"
                        >
                            {loading ? 'Сохранение...' : 'Сохранить'}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-gray-600 hover:bg-gray-700 shadow-md px-4 py-3 rounded-lg"
                        >
                            Отмена
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserFormModal;