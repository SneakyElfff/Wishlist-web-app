import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import LoginPage from './components/LoginPage';
import './App.css';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState('');

  const [gifts, setGifts] = useState([]);
  const [reserverName, setReserverName] = useState('');
  const [selectedGifts, setSelectedGifts] = useState([]);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [unreserveGiftId, setUnreserveGiftId] = useState('');
  const [unreserveName, setUnreserveNameInput] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      fetchGifts();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const auth = localStorage.getItem('isAuthenticated') === 'true';
    const savedLogin = localStorage.getItem('userLogin');

    if (auth && savedLogin) {
      setIsAuthenticated(auth);
      setCurrentUser(savedLogin);
      setReserverName(savedLogin)
    }

    setLoading(false);
  }, []);

  const fetchGifts = async () => {
    const response = await axios.get('/api/gifts');
    setGifts(response.data);
    setSelectedGifts([]); // Clear selection on refresh
  };

  const handleLoginSuccess = (login) => {
    setIsAuthenticated(true);
    setCurrentUser(login);
    setReserverName(login);
  }

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
  }

  const handleReserve = async () => {
    if (!reserverName) {
      alert('Введите имя (для науки).');
      return;
    }
    if (selectedGifts.length === 0) {
      alert('Воздух застолбить решили?.');
      return;
    }

    let successCount = 0;
    let errorMessages = [];

    for (const id of selectedGifts) {
      const gift = gifts.find((g) => g._id === id);
      if (gift.reserved) {
        errorMessages.push(`"${gift.name}" уже забронирован`);
        continue;
      }

      try {
        await axios.post(`/api/gifts/${id}/reserve`, { reservedBy: reserverName });
        successCount++;
      } catch (err) {
        const msg = `Ошибка при брони "${gift.name}": ` + err.response?.data?.message;
        errorMessages.push(msg);
      }
    }

    if (successCount > 0) {
      alert(`Успешно забронировано: ${successCount} подарков! 🎉`);
    }

    if (errorMessages.length > 0) {
      alert('Проблемы:\n• ' + errorMessages.join('\n• '));
    }

    setSelectedGifts([]);
    fetchGifts();
  };

  const handleCheckboxChange = (id) => {
    setSelectedGifts((prev) =>
        prev.includes(id) ? prev.filter((giftId) => giftId !== id) : [...prev, id]
    );
  };

  const openInfoModal = () => {
    setIsInfoModalOpen(true);
  };

  const closeInfoModal = () => {
    setIsInfoModalOpen(false);
  };

  const openHelpModal = () => {
    setIsHelpModalOpen(true);
    setUnreserveGiftId('');
    setUnreserveNameInput(currentUser);
  };

  const closeHelpModal = () => {
    setIsHelpModalOpen(false);
  };

  const handleUnreserve = async () => {
    if (!unreserveGiftId) {
      alert('Галя, у нас отмена! А что отменяем-то?');
      return;
    }
    if (!unreserveName) {
      alert('Так уж все просто. Подтвердите личность.');
      return;
    }
    try {
      await axios.post(`/api/gifts/${unreserveGiftId}/unreserve`, { reservedBy: unreserveName });
      alert('Успех! Будем считать, что никто ничего не видел.');
      fetchGifts();
      closeHelpModal();
    } catch (err) {
      const message = err.response?.data?.message || 'Не удалось снять бронь.';
      alert(message);
    }
  };

  // Compute if any selected gifts are unreserved
  const canReserve = useMemo(() => {
    if (selectedGifts.length === 0) return false;
    return selectedGifts.some((id) => {
      const gift = gifts.find((g) => g._id === id);
      return gift && !gift.reserved;
    });
  }, [selectedGifts, gifts]);

  if (loading) {
    return <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">Загрузка...</div>;
  }

  if (!isAuthenticated) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  return (
      <div className="min-h-screen bg-gray-900 text-gray-100 p-6 font-sans">
        <div className="flex justify-between items-baseline mb-6">
          <div className="mb-6 text-center">
            <p className="text-xl text-cyan-400">
              Hello, <span className="font-bold">{currentUser}</span>
            </p>
          </div>

          <button
              onClick={handleLogout}
              className="hover:bg-cyan-700 border-2 border-cyan-600 px-5 py-3 rounded-lg font-semibold transition"
          >
            Выйти
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-4 mb-6 justify-center">
          <button
              onClick={handleReserve}
              className={`bg-cyan-600 text-white p-3 rounded-lg shadow-md hover:bg-cyan-700 transition ${!canReserve ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={!canReserve}
          >
            Застолбить
          </button>
          <button
              onClick={openInfoModal}
              className="bg-purple-600 text-white p-3 rounded-lg shadow-md hover:bg-purple-700 transition"
          >
            Инструкция
          </button>
          <button
              onClick={openHelpModal}
              className="bg-red-600 text-white p-3 rounded-lg shadow-md hover:bg-red-700 transition"
          >
            Помогите
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="table-auto w-full border-collapse bg-gray-800 rounded-lg shadow-lg">
            <thead>
            <tr className="bg-gray-700 text-gray-300">
              <th className="border border-gray-600 p-3 w-12">Выбрать</th>
              <th className="border border-gray-600 p-3">Наименование</th>
              <th className="border border-gray-600 p-3">Описание</th>
              <th className="border border-gray-600 p-3">Ссылка</th>
              <th className="border border-gray-600 p-3">Статус</th>
            </tr>
            </thead>
            <tbody>
            {gifts.map((gift) => (
                <tr key={gift._id} className="hover:bg-gray-600 transition">
                  <td className="border border-gray-600 p-3 text-center">
                    <input
                        type="checkbox"
                        checked={selectedGifts.includes(gift._id)}
                        onChange={() => handleCheckboxChange(gift._id)}
                        className="custom-checkbox"
                    />
                  </td>
                  <td className="border border-gray-600 p-3">{gift.name}</td>
                  <td className="border border-gray-600 p-3">{gift.description}</td>
                  <td className="border border-gray-600 p-3 text-center">
                    {gift.link ? (
                        <a
                            href={gift.link}
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
                    {gift.reserved ? (
                        gift.reservedBy === currentUser ? (
                            <span className="text-cyan-400">
                              Мое
                            </span>
                        ) : (
                          <span className="text-red-400">
                              Забронировано
                          </span>
                        )
                    ) : (
                        <span className="text-green-400">Доступно</span>
                    )}
                  </td>
                </tr>
            ))}
            </tbody>
          </table>
        </div>

        {isInfoModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 overflow-y-auto">
              <div className="bg-gray-800 p-8 rounded-xl shadow-2xl max-w-2xl w-full my-4 mx-4 sm:mx-6 md:mx-8 text-gray-100 text-justify max-h-[90vh] overflow-y-auto">
                <p className="mb-4">
                  Добро пожаловать! Это своего рода помощник вам, мои любимые люди, в поисках скромного дара, который вы бы
                  могли захотеть преподнести вашей покорной слуге. Но помните, что я в любом случае буду рада абсолютно любому
                  подарку (который не преступает рамки приличия, закона, морали, не нарушает чужих прав и за который вам не
                  пришлось расплатиться жизнью) и даже его отсутствию, ведь главный мой подарок – знакомство с вами.
                </p>

                <p className="mb-4 font-bold text-center">
                  FAQ
                </p>

                <p className="underline">
                  Что делать?
                </p>
                <p className="mb-4">
                  Если какой-то вариант вам приглянулся, вы можете его "застолбить", поставив галочку в квадратике в
                  столбце "Выбрать" и нажав кнопку "Застолбить". И пусть победит сильнейший.
                </p>
                <p className="underline">
                  Как отменить?
                </p>
                <p className="mb-4">
                  Если у вас на языке вертится старое-доброе "куда я жмал?", не беда! Нажмите кнопку "Помогите" - и вам помогут.
                  Достаточно только выбрать из списка отвергаемый лот и нажать кнопку "Снять бронь".
                </p>

                <p className="mb-4 font-bold text-center">
                  Примечания
                </p>
                <p className="mb-4">
                  P.S. Очередность выстроена в порядке возникновения мозговых импульсов, а не согласно какой-либо из
                  стандартных сортировок.
                </p>
                <p className="mb-4">
                  P.P.S. Некоторые варианты могут быть чуть более затратными, так что feel free to join forces.
                </p>

                <div className="flex justify-center">
                  <button
                      onClick={closeInfoModal}
                      className="bg-purple-600 text-white p-3 rounded-lg shadow-md hover:bg-purple-700 transition"
                  >
                    Понятно
                  </button>
                </div>
              </div>
            </div>
        )}

        {isHelpModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
              <div className="bg-gray-800 p-8 rounded-xl shadow-2xl max-w-2xl w-full text-gray-100">
                <h2 className="text-2xl font-bold mb-4 text-red-400">Передумали?</h2>
                <p className="mb-4">
                  Не сомневаюсь в чистоте ваших намерений, но снять бронь можно не с любого варианта, а с выбранного ранее лично вами.
                </p>
                <select
                    value={unreserveGiftId}
                    onChange={(e) => setUnreserveGiftId(e.target.value)}
                    className="bg-gray-700 border border-gray-600 text-gray-100 p-3 rounded-lg mb-4 w-full focus:outline-none focus:ring-2 focus:ring-red-500 transition"
                >
                  <option value="">Выберите забронированный подарок</option>
                  {gifts
                      .filter((gift) => gift.reserved && gift.reservedBy === currentUser)
                      .map((gift) => (
                          <option key={gift._id} value={gift._id}>
                            {gift.name}
                          </option>
                      ))}
                </select>
                <input
                    type="text"
                    placeholder="Ваше имя"
                    value={unreserveName}
                    onChange={(e) => setUnreserveNameInput(e.target.value)}
                    readOnly={!!currentUser}
                    disabled={!!currentUser}
                    className="bg-gray-700 border border-gray-600 text-gray-100 p-3 rounded-lg mb-4 w-full focus:outline-none focus:ring-2 focus:ring-red-500 transition"
                />
                <div className="flex gap-4">
                  <button
                      onClick={handleUnreserve}
                      className="bg-red-600 text-white p-3 rounded-lg shadow-md hover:bg-red-700 transition"
                  >
                    Снять бронь
                  </button>
                  <button
                      onClick={closeHelpModal}
                      className="bg-gray-600 text-white p-3 rounded-lg shadow-md hover:bg-gray-700 transition"
                  >
                    Закрыть
                  </button>
                </div>
              </div>
            </div>
        )}
      </div>
  );
};

export default App;