import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserManagementModal = ({ isOpen, onClose }) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen) {
            const fetchUsers = async () => {
                try {
                    const res = await axios.get('/api/users');
                    setUsers(res.data);
                    setError('');
                } catch (err) {
                    setError(err.response?.data?.message || 'Не удалось загрузить список пользователей');
                } finally {
                    setLoading(false);
                }
            };

            fetchUsers();
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 overflow-y-auto">
            <div className="bg-gray-800 p-8 rounded-xl shadow-2xl max-w-3xl w-full text-gray-100">
                <h2 className="text-2xl font-bold mb-4 text-cyan-400">Пользователи</h2>

                {error && <p className="text-red-400 mb-4 text-center">{error}</p>}

                {loading ? (
                    <p className="text-center py-8">Загрузка пользователей...</p>
                ) : users.length === 0 ? (
                    <p className="text-center py-8 text-gray-400">Пользователей пока нет</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="table-auto w-full border-collapse bg-gray-800 rounded-lg shadow-lg">
                            <thead>
                            <tr className="bg-gray-700 text-gray-300">
                                <th className="border border-gray-600 p-3">Логин</th>
                                <th className="border border-gray-600 p-3">Роль</th>
                            </tr>
                            </thead>
                            <tbody>
                            {users.map((user) => (
                                <tr key={user._id} className="hover:bg-gray-600 transition">
                                    <td className="border border-gray-600 p-3">{user.login}</td>
                                    <td className="border border-gray-600 p-3 text-center">
                      <span
                          className={`px-2 py-1 rounded-lg ${
                              user.role === 'admin' ? 'bg-purple-600' : 'bg-green-600'
                          }`}
                      >
                        {user.role}
                      </span>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}

                <div className="mt-6 flex justify-center">
                    <button
                        type="button"
                        onClick={onClose}
                        className="bg-gray-600 hover:bg-gray-700 shadow-md px-4 py-3 rounded-lg"
                    >
                        Закрыть
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserManagementModal;