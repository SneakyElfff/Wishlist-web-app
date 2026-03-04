import React, {useEffect, useState} from 'react';
import axios from 'axios';

const EditGiftModal = ({ isOpen, onClose, gift, onGiftUpdated }) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        link: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (gift && isOpen) {
            setFormData({
                name: gift.name || '',
                description: gift.description || '',
                link: gift.link || '',
            });
            setError('');
        }
    }, [gift, isOpen]);

    if (!isOpen || !gift) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await axios.put(`/api/gifts/${gift._id}`, formData);
            onGiftUpdated();
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || 'Не удалось обновить подарок');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
            <div className="bg-gray-800 p-8 rounded-xl shadow-2xl max-w-lg w-full">
                <h2 className="text-2xl font-bold mb-4 text-cyan-400">Изменить подарок</h2>

                {error && <p className="text-red-400 text-center">{error}</p>}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm mb-1">Название *</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full p-3 bg-gray-700 border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm mb-1">Описание</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className="w-full p-3 bg-gray-700 h-24 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm mb-1">Ссылка</label>
                        <input
                            type="url"
                            name="link"
                            value={formData.link}
                            onChange={handleChange}
                            className="w-full p-3 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        />
                    </div>

                    <div className="flex gap-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50 shadow-md px-4 py-3 rounded-lg transition"
                        >
                            {loading ? 'Сохранение...' : 'Сохранить изменения'}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
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

export default EditGiftModal;