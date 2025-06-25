import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
  const [gifts, setGifts] = useState([]);
  const [reserverName, setReserverName] = useState('');
  const [selectedGifts, setSelectedGifts] = useState([]);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [unreserveGiftId, setUnreserveGiftId] = useState('');
  const [unreserveName, setUnreserveNameInput] = useState('');

  useEffect(() => {
    fetchGifts();
  }, []);

  const fetchGifts = async () => {
    const response = await axios.get('http://localhost:5001/api/gifts');
    setGifts(response.data);
    setSelectedGifts([]); // Clear selection on refresh
  };

  const handleReserve = async () => {
    if (!reserverName) {
      alert('Введите имя (для науки).');
      return;
    }
    if (selectedGifts.length === 0) {
      alert('Воздух застолбить решили?.');
      return;
    }
    for (const id of selectedGifts) {
      const gift = gifts.find((g) => g._id === id);
      if (!gift.reserved) {
        await axios.post(`http://localhost:5001/api/gifts/${id}/reserve`, { reservedBy: reserverName });
      }
    }
    setReserverName('');
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
    setUnreserveNameInput('');
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
      await axios.post(`http://localhost:5001/api/gifts/${unreserveGiftId}/unreserve`, { reservedBy: unreserveName });
      alert('Успех! Будем считать, что никто ничего не видел.');
      fetchGifts();
      closeHelpModal();
    } catch (err) {
      alert(err.response?.data?.message || 'Что-то пошло не так...');
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

  return (
      <div className="min-h-screen bg-gray-900 text-gray-100 p-6 font-sans">
        <h1 className="text-4xl font-extrabold mb-6 text-center text-purple-400">Wish List</h1>
        <div className="flex flex-wrap items-center gap-4 mb-6 justify-center">
          <input
              type="text"
              placeholder="Ваше имя"
              value={reserverName}
              onChange={(e) => setReserverName(e.target.value)}
              className="bg-gray-800 border border-gray-700 text-gray-100 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition w-64"
          />
          <button
              onClick={handleReserve}
              className={`bg-green-600 text-white p-3 rounded-lg shadow-md hover:bg-green-700 transition ${!canReserve ? 'opacity-50 cursor-not-allowed' : ''}`}
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
              className="bg-teal-600 text-white p-3 rounded-lg shadow-md hover:bg-teal-700 transition"
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
                  <td className="border border-gray-600 p-3">
                    {gift.link ? (
                        <a
                            href={gift.link}
                            className="text-purple-400 hover:text-purple-300 transition"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                          Ссылка
                        </a>
                    ) : (
                        '-'
                    )}
                  </td>
                  <td className="border border-gray-600 p-3">
                    {gift.reserved ? (
                        <span className="text-red-400">Забито</span>
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
            <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
              <div className="bg-gray-800 p-8 rounded-xl shadow-2xl max-w-2xl w-full text-gray-100">
                <h2 className="text-2xl font-bold mb-4 text-purple-400">Пояснение</h2>
                <p className="mb-4">
                  Добро пожаловать! Это своего рода помощник вам, мои любимые люди, в поисках скромного дара, который вы бы
                  могли захотеть преподнести вашей покорной слуге. Но помните, что я в любом случае буду рада абсолютно любому
                  подарку (который не преступает рамки приличия, закона, морали, не нарушает чужих прав и за который вам не
                  пришлось расплатиться жизнью) и даже его отсутствию, ведь главный мой подарок – знакомство с вами.
                </p>
                <p className="mb-4">
                  P.S. Если какой-то вариант вам приглянулся, вы можете его "застолбить", поставив галочку в квадратике в
                  столбце "Выбрать", введя свое имя и нажав кнопку "Застолбить". И пусть победит сильнейший.
                </p>
                <p className="mb-4">
                  P.P.S. Очередность выстроена в порядке возникновения мозговых импульсов, а не согласно какой-либо из
                  стандартных сортировок.
                </p>
                <button
                    onClick={closeInfoModal}
                    className="bg-blue-600 text-white p-3 rounded-lg shadow-md hover:bg-blue-700 transition"
                >
                  Понятно
                </button>
              </div>
            </div>
        )}

        {isHelpModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
              <div className="bg-gray-800 p-8 rounded-xl shadow-2xl max-w-2xl w-full text-gray-100">
                <h2 className="text-2xl font-bold mb-4 text-teal-400">Передумали?</h2>
                <p className="mb-4">
                  Выберите застолбленную идею и введите имя для подтверждения чистоты ваших намерений. Имя должно совпадать с
                  введенным ранее.
                </p>
                <select
                    value={unreserveGiftId}
                    onChange={(e) => setUnreserveGiftId(e.target.value)}
                    className="bg-gray-700 border border-gray-600 text-gray-100 p-3 rounded-lg mb-4 w-full focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
                >
                  <option value="">Выберите забронированный подарок</option>
                  {gifts
                      .filter((gift) => gift.reserved)
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
                    className="bg-gray-700 border border-gray-600 text-gray-100 p-3 rounded-lg mb-4 w-full focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
                />
                <div className="flex gap-4">
                  <button
                      onClick={handleUnreserve}
                      className="bg-teal-600 text-white p-3 rounded-lg shadow-md hover:bg-teal-700 transition"
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