import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UserFormModal from './UserFormModal';
import DeleteConfirmModal from './DeleteConfirmModal';
import {PencilIcon, TrashIcon} from "@heroicons/react/24/outline";

const UserManagementModal = ({ isOpen, onClose }) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [selectedUser, setSelectedUser] = useState(null);
    const [isUserFormModalOpen, setIsUserFormModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        if (isOpen) fetchUsers();
    }, [isOpen]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await axios.get('/api/users');
            setUsers(res.data);
            setError('');
        } catch (err) {
            setError('Не удалось загрузить пользователей');
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = () => {
        setSelectedUser(null);
        setIsUserFormModalOpen(true);
    };

    const handleEdit = (user) => {
        setSelectedUser(user);
        setIsUserFormModalOpen(true);
    };

    const handleDelete = (user) => {
        setSelectedUser(user);
        setIsDeleteModalOpen(true);
    };

    const handleFormSuccess = () => {
        fetchUsers();
        setIsUserFormModalOpen(false);
    };

    const handleDeleteConfirm = async () => {
        setActionLoading(true);
        try {
            await axios.delete(`/api/users/${selectedUser._id}`);
            alert('Пользователь удален');

            fetchUsers();
            setIsDeleteModalOpen(false);
        } catch (err) {
            alert(err.response?.data?.message || 'Ошибка удаления');
        } finally {
            setActionLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 overflow-y-auto">
            <div className="bg-gray-800 p-8 rounded-xl shadow-2xl max-w-3xl w-full text-gray-100">
                <h2 className="text-2xl font-bold mb-4 text-cyan-400">Пользователи</h2>

                <div className="flex flex-wrap gap-4 mb-6">
                    <button
                        onClick={handleAdd}
                        className="bg-emerald-600 text-white p-3 rounded-lg shadow-md hover:bg-emerald-700 transition"
                    >
                        Добавить пользователя
                    </button>
                </div>

                {error && <p className="text-red-400 mb-4 text-center">{error}</p>}

                {loading ? (
                    <p className="text-center py-8">Загрузка пользователей...</p>
                ) : users.length === 0 ? (
                    <p className="text-center py-8 text-gray-400">Пользователей пока нет</p>
                ) : (
                    <table className="table-auto w-full border-collapse bg-gray-800 rounded-lg shadow-lg">
                        <thead>
                        <tr className="bg-gray-700 text-gray-300">
                            <th className="border border-gray-600 p-3">Логин</th>
                            <th className="border border-gray-600 p-3">Роль</th>
                            <th className="border border-gray-600 p-3 w-12">Действия</th>
                        </tr>
                        </thead>
                        <tbody>
                        {users.map(u => (
                            <tr key={u._id} className="hover:bg-gray-600 transition">
                                <td className="border border-gray-600 p-3">{u.login}</td>
                                <td className="border border-gray-600 p-3 text-center">
                                    <span className={`px-2 py-1 rounded-lg shadow-md text-sm ${u.role === 'admin' ? 'bg-purple-600' : 'bg-cyan-600'}`}>
                                      {u.role}
                                    </span>
                                </td>
                                <td className="border border-gray-600 p-3 text-center">
                                    <div className="flex justify-center gap-3">
                                        <button
                                            onClick={() => handleEdit(u)}
                                            className="text-yellow-400 hover:text-yellow-300 transition text-xl"
                                            title="Редактировать подарок"
                                        >
                                            <PencilIcon className="w-5 h-5" />
                                        </button>

                                        <button
                                            onClick={() => handleDelete(u)}
                                            className="text-red-400 hover:text-red-300 transition text-xl"
                                            title="Удалить подарок"
                                        >
                                            <TrashIcon className="w-5 h-5" />
                                        </button>
                                    </div>

                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
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

                <UserFormModal
                    isOpen={isUserFormModalOpen}
                    onClose={() => setIsUserFormModalOpen(false)}
                    user={selectedUser}
                    onSuccess={handleFormSuccess}
                />

                <DeleteConfirmModal
                    isOpen={isDeleteModalOpen}
                    onClose={() => setIsDeleteModalOpen(false)}
                    onConfirm={handleDeleteConfirm}
                    object='пользователя'
                    giftName={
                        selectedUser?.role === 'admin'
                            ? `администратора ${selectedUser?.login}`
                            : `пользователя ${selectedUser?.login}`
                    }
                    loading={actionLoading}
                />
            </div>
        </div>
    );
};

export default UserManagementModal;