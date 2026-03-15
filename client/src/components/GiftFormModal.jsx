import React, {useEffect, useState} from 'react';
import axios from 'axios';

// TODO: add loading
const GiftFormModal = ({
                           isOpen,
                           onClose,
                           mode = "add",
                           gift = null,
                           onSuccess
                       }) => {
    const [form, setForm] = useState({
        name: '',
        description: '',
        link: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!isOpen) {
            // Reset when closed
            setForm({ name: '', description: '', link: '' });
            setError('');
            return;
        }

        // When opened
        if (mode === "edit" && gift) {
            setForm({
                name: gift.name || '',
                description: gift.description || '',
                link: gift.link || '',
            });
        } else {
            // add mode → clean
            setForm({ name: '', description: '', link: '' });
        }

        setError('');
    }, [isOpen, mode, gift]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (mode === "edit" && gift?._id) {
                // Update
                await axios.put(`/api/gifts/${gift._id}`, form);
                alert('Подарок обновлен');
            } else {
                // Create
                await axios.post('/api/gifts', form);
                alert('Подарок добавлен');
            }

            onSuccess();
            onClose();
        } catch (err) {
            setError(
                err.response?.data?.message ||
                'Не удалось сохранить подарок'
            );
        } finally {
            setLoading(false);
        }
    };

    const title = mode === "edit" ? "Редактировать подарок" : "Добавить подарок";
    const buttonText = mode === "edit" ? "Сохранить изменения" : "Добавить";

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
            <div className="bg-gray-800 p-8 rounded-xl shadow-2xl max-w-lg w-full">
                <h2 className="text-2xl font-bold mb-4 text-cyan-400">{title}</h2>

                {error && <p className="text-red-400 text-center">{error}</p>}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm mb-1">Название *</label>
                        <input
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            className="w-full p-3 bg-gray-700 border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm mb-1">Описание</label>
                        <textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            className="w-full p-3 bg-gray-700 h-24 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm mb-1">Ссылка</label>
                        <input
                            type="url"
                            name="link"
                            value={form.link}
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
                            {loading ? 'Сохранение...' : buttonText}
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

export default GiftFormModal;