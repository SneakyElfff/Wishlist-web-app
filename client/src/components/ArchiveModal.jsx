import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DeleteConfirmModal from './DeleteConfirmModal';
import {ArrowUturnLeftIcon, TrashIcon} from "@heroicons/react/24/outline";

const ArchiveModal = ({ isOpen, onClose, onUnarchive }) => {
    const [gifts, setGifts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [selectedGift, setSelectedGift] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        if (isOpen) fetchGifts();
    }, [isOpen]);

    const fetchGifts = async () => {
        setLoading(true);
        try {
            const res = await axios.get('/api/gifts/archived');
            setGifts(res.data);
            setError('');
        } catch (err) {
            setError('Не удалось загрузить архивированные подарки');
        } finally {
            setLoading(false);
        }
    };

    const handleUnarchive = async (gift) => {
        try {
            await axios.post(`/api/gifts/${gift._id}/unarchive`);
            alert('Успех!');
            fetchGifts();
            if (onUnarchive) onUnarchive();
        } catch (err) {
            const message = err.response?.data?.message || 'Не удалось вернуть из архива.';
            alert(message);
        }
    };

    const handleDelete = (gift) => {
        setSelectedGift(gift);
        setIsDeleteModalOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!selectedGift) return;

        setActionLoading(true);
        try {
            await axios.delete(`/api/gifts/${selectedGift._id}`);
            alert('Подарок удален');

            fetchGifts();
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
                <h2 className="text-2xl font-bold mb-4 text-cyan-400">Архив подарков</h2>

                {error && <p className="text-red-400 mb-4 text-center">{error}</p>}

                {loading ? (
                    <p className="text-center py-8">Загрузка архива подарков...</p>
                ) : gifts.length === 0 ? (
                    <p className="text-center py-8 text-gray-400">Архив пуст</p>
                ) : (
                    <table className="table-auto w-full border-collapse bg-gray-800 rounded-lg shadow-lg">
                        <thead>
                        <tr className="bg-gray-700 text-gray-300">
                            <th className="border border-gray-600 p-3">Наименование</th>
                            <th className="border border-gray-600 p-3">Описание</th>
                            <th className="border border-gray-600 p-3 w-12">Ссылка</th>
                            <th className="border border-gray-600 p-3 w-12">Действия</th>
                        </tr>
                        </thead>
                        <tbody>
                        {gifts.map(g => (
                            <tr key={g._id} className="hover:bg-gray-600 transition">
                                <td className="border border-gray-600 p-3">{g.name}</td>
                                <td className="border border-gray-600 p-3">{g.description}</td>
                                <td className="border border-gray-600 p-3 text-center">
                                    {g.link ? (
                                        <a
                                            href={g.link}
                                            className="text-blue-400 hover:text-blue-300 transition"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            Ссылка
                                        </a>
                                    ) : (
                                        '-'
                                    )}
                                </td>
                                <td className="border border-gray-600 p-3 text-center">
                                    <div className="flex justify-center gap-3">
                                        <button
                                            onClick={() => handleUnarchive(g)}
                                            className="text-yellow-400 hover:text-yellow-300 transition text-xl"
                                            title="Восстановить"
                                        >
                                            <ArrowUturnLeftIcon className="w-5 h-5" />
                                        </button>

                                        <button
                                            onClick={() => handleDelete(g)}
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

                <DeleteConfirmModal
                    isOpen={isDeleteModalOpen}
                    onClose={() => setIsDeleteModalOpen(false)}
                    onConfirm={handleDeleteConfirm}
                    object='подарок'
                    giftName={selectedGift?.name}
                    loading={actionLoading}
                />
            </div>
        </div>
    );
};

export default ArchiveModal;