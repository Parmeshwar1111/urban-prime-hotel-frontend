import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import ApiService from '../../service/ApiService';

const RoomSearch = ({ handleSearchResult }) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [roomType, setRoomType] = useState('');
  const [roomTypes, setRoomTypes] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRoomTypes = async () => {
      try {
        const types = await ApiService.getRoomTypes();
        setRoomTypes(types);
      } catch (error) {
        console.error('Error fetching room types:', error.message);
      }
    };
    fetchRoomTypes();
  }, []);

  /**This methods is going to be used to show errors */
  const showError = (message, timeout = 5000) => {
    setError(message);
    setTimeout(() => {
      setError('');
    }, timeout);
  };

  /**THis is going to be used to fetch avaailabe rooms from database base on seach data that'll be passed in */
  const handleInternalSearch = async () => {
    if (!startDate || !endDate || !roomType) {
      showError('Please select all fields');
      return false;
    }
    try {
      // Convert startDate to the desired format
      const formattedStartDate = startDate ? startDate.toISOString().split('T')[0] : null;
      const formattedEndDate = endDate ? endDate.toISOString().split('T')[0] : null;
      // Call the API to fetch available rooms
      const response = await ApiService.getAvailableRoomsByDateAndType(formattedStartDate, formattedEndDate, roomType);

      // Check if the response is successful
      if (response.statusCode === 200) {
        if (response.roomList.length === 0) {
          showError('Room not currently available for this date range on the selected rom type.');
          return
        }
        handleSearchResult(response.roomList);
        setError('');
      }
    } catch (error) {
      showError("Unown error occured: " + error.response.data.message);
    }
  };

  return (
    <section className="w-full">

  <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">

    {/* CHECK-IN */}
    <div className="w-full">
      <label className="block font-semibold mb-1 text-gray-700">Check-in</label>
      <DatePicker
        selected={startDate}
        onChange={(date) => setStartDate(date)}
        dateFormat="dd/MM/yyyy"
        placeholderText="Select date"
        className="w-full p-2 border rounded"
        wrapperClassName="w-full"
      />
    </div>

    {/* CHECK-OUT */}
    <div className="w-full">
      <label className="block font-semibold mb-1 text-gray-700">Check-out</label>
      <DatePicker
        selected={endDate}
        onChange={(date) => setEndDate(date)}
        dateFormat="dd/MM/yyyy"
        placeholderText="Select date"
        className="w-full p-2 border rounded"
        wrapperClassName="w-full"
      />
    </div>

    {/* ROOM TYPE */}
    <div className="w-full">
      <label className="block font-semibold mb-1 text-gray-700">Room Type</label>
      <select
        value={roomType}
        onChange={(e) => setRoomType(e.target.value)}
        className="w-full p-2 border rounded"
      >
        <option value="">Select Room Type</option>
        {roomTypes.map((type) => (
          <option key={type} value={type}>{type}</option>
        ))}
      </select>
    </div>

    {/* BUTTON */}
    <div className="flex items-end w-full">
      <button
        onClick={handleInternalSearch}
        className="w-full bg-teal-700 text-white p-2 mb-4 rounded font-semibold hover:bg-blue-900 transition"
      >
        Search Rooms
      </button>
    </div>

  </div>

</section>
  );
};

export default RoomSearch;
