import React from 'react';

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, giftName, loading = false }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
            <div className="bg-gray-800 p-8 rounded-xl shadow-2xl max-w-lg w-full">
                <h2 className="text-2xl font-bold mb-4 text-red-400">Удалить подарок?</h2>

                <p className="mb-4">
                    Вы действительно хотите удалить <strong className="text-cyan-400">{giftName || 'этот подарок'}</strong>?<br />
                    Это действие нельзя отменить.
                </p>

                <div className="flex gap-4">
                    <button
                        onClick={onConfirm}
                        disabled={loading}
                        className="bg-red-600 hover:bg-red-700 disabled:opacity-50 shadow-md px-4 py-3 rounded-lg transition flex"
                    >
                        {loading ? 'Удаление...' : 'Удалить'}
                    </button>
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="bg-gray-600 hover:bg-gray-700 shadow-md px-4 py-3 rounded-lg"
                    >
                        Отмена
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmModal;