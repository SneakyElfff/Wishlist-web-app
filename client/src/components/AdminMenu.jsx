import React, {useEffect} from 'react';
import {Bars4Icon, PlusIcon, UsersIcon} from '@heroicons/react/24/outline';

const AdminMenu = ({
   isAdminMenuOpen,
   setIsAdminMenuOpen,
   setIsAddGiftModalOpen,
   setIsUsersModalOpen,
   handleLogout,
}) => {
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (isAdminMenuOpen && !e.target.closest('.relative')) {
                setIsAdminMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isAdminMenuOpen, setIsAdminMenuOpen]);

    return (
        <div className="relative">
            <button
                onClick={() => setIsAdminMenuOpen(!isAdminMenuOpen)}
                className="hover:bg-cyan-700 border-2 border-cyan-600 px-4 py-3 rounded-lg font-semibold transition"
            >
                <Bars4Icon className="w-5 h-5" />

            </button>

            {isAdminMenuOpen && (
                <div
                    className="absolute right-0 mt-4 w-64 bg-gray-900 border-2 border-cyan-600 rounded-lg shadow-2xl py-2 z-50"
                    onClick={() => setIsAdminMenuOpen(false)}
                >

                    <button
                        onClick={() => setIsAddGiftModalOpen(true)}
                        className="w-full hover:bg-gray-600 px-5 py-3 font-semibold transition flex items-center gap-2"
                    >
                        <PlusIcon className="w-5 h-5" /> Добавить подарок
                    </button>

                    <button
                        onClick={() => setIsUsersModalOpen(true)}
                        className="w-full hover:bg-gray-600 px-5 py-3 font-semibold transition flex items-center gap-2"
                    >
                        <UsersIcon className="w-5 h-5" /> Пользователи
                    </button>

                    <div className="w-full h-px bg-cyan-600" />

                    <button
                        onClick={handleLogout}
                        className="w-full hover:bg-gray-600 px-5 py-3 font-semibold transition"
                    >
                        Выйти
                    </button>
                </div>
            )}
        </div>
    );
};

export default AdminMenu;