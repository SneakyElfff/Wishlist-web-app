// src/components/AddGiftModal.jsx
import React, { useState } from 'react';
import axios from 'axios';

const AddGiftModal = ({ isOpen, onClose, onGiftAdded }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [link, setLink] = useState('');
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            await axios.post('/api/gifts', {
                name,
                description,
                link: link || undefined,
            });
            onGiftAdded();
            onClose();
            setName('');
            setDescription('');
            setLink('');
        } catch (err) {
            setError(err.response?.data?.message || 'Не удалось добавить подарок');
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
            <div className="bg-gray-800 p-8 rounded-xl shadow-2xl max-w-lg w-full">
                <h2 className="text-2xl font-bold mb-4 text-cyan-400">Добавить новый подарок</h2>

                {error && <p className="text-red-400 text-center">{error}</p>}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm mb-1">Название *</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full p-3 bg-gray-700 border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm mb-1">Описание</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full p-3 bg-gray-700 h-24 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm mb-1">Ссылка</label>
                        <input
                            type="url"
                            value={link}
                            onChange={(e) => setLink(e.target.value)}
                            className="w-full p-3 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        />
                    </div>

                    <div className="flex gap-4">
                        <button
                            type="submit"
                            className="bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50 shadow-md px-4 py-3 rounded-lg transition"
                        >
                            Добавить
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

export default AddGiftModal;