import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService from '../../service/ApiService';

const AddRoomPage = () => {

    const navigate = useNavigate();

    const [roomDetails, setRoomDetails] = useState({
        roomType: '',
        roomPrice: '',
        roomDescription: '',
    });

    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [roomTypes, setRoomTypes] = useState([]);
    const [newRoomType, setNewRoomType] = useState(false);

    useEffect(() => {
        const fetchRoomTypes = async () => {
            try {
                const types = await ApiService.getRoomTypes();
                setRoomTypes(types);
            } catch (error) {
                console.error(error.message);
            }
        };
        fetchRoomTypes();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setRoomDetails(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleRoomTypeChange = (e) => {
        if (e.target.value === 'new') {
            setNewRoomType(true);
            setRoomDetails(prev => ({ ...prev, roomType: '' }));
        } else {
            setNewRoomType(false);
            setRoomDetails(prev => ({ ...prev, roomType: e.target.value }));
        }
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
        }
    };

    const addRoom = async () => {

        if (!roomDetails.roomType || !roomDetails.roomPrice || !roomDetails.roomDescription) {
            setError('All fields are required');
            setTimeout(() => setError(''), 5000);
            return;
        }

        if (!window.confirm('Do you want to add this room?')) return;

        try {
            const formData = new FormData();
            formData.append('roomType', roomDetails.roomType);
            formData.append('roomPrice', roomDetails.roomPrice);
            formData.append('roomDescription', roomDetails.roomDescription);

            if (file) formData.append('photo', file);

            const result = await ApiService.addRoom(formData);

            if (result.statusCode === 200) {
                setSuccess('Room added successfully!');
                setTimeout(() => navigate('/admin/manage-rooms'), 3000);
            }

        } catch (error) {
            setError(error.response?.data?.message || error.message);
            setTimeout(() => setError(''), 5000);
        }
    };

    return (
        <div className="min-h-screen flex justify-center items-start px-4 py-10 bg-gray-100">

            {/* CARD */}
            <div className="w-full max-w-xl bg-white shadow-lg rounded-lg p-6">

                <h2 className="text-2xl font-bold text-center text-teal-700 mb-6">
                    Add New Room
                </h2>

                {/* ERROR */}
                {error && (
                    <p className="text-red-500 text-center mb-4 font-semibold">
                        {error}
                    </p>
                )}

                {/* SUCCESS */}
                {success && (
                    <p className="text-green-600 text-center mb-4 font-semibold">
                        {success}
                    </p>
                )}

                {/* IMAGE PREVIEW */}
                {preview && (
                    <img
                        src={preview}
                        alt="Preview"
                        className="w-full h-48 object-cover rounded mb-4"
                    />
                )}

                {/* FILE INPUT */}
                <input
                    type="file"
                    onChange={handleFileChange}
                    className="mb-4"
                />

                {/* ROOM TYPE */}
                <div className="mb-4">
                    <label className="block font-medium mb-1">Room Type</label>

                    <select
                        value={roomDetails.roomType}
                        onChange={handleRoomTypeChange}
                        className="w-full p-2 border rounded"
                    >
                        <option value="">Select room type</option>
                        {roomTypes.map(type => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                        <option value="new">Other</option>
                    </select>

                    {newRoomType && (
                        <input
                            type="text"
                            name="roomType"
                            placeholder="Enter new type"
                            value={roomDetails.roomType}
                            onChange={handleChange}
                            className="w-full mt-2 p-2 border rounded"
                        />
                    )}
                </div>

                {/* PRICE */}
                <div className="mb-4">
                    <label className="block font-medium mb-1">Room Price</label>
                    <input
                        type="text"
                        name="roomPrice"
                        value={roomDetails.roomPrice}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                    />
                </div>

                {/* DESCRIPTION */}
                <div className="mb-4">
                    <label className="block font-medium mb-1">Description</label>
                    <textarea
                        name="roomDescription"
                        value={roomDetails.roomDescription}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        rows="3"
                    />
                </div>

                {/* BUTTON */}
                <button
                    onClick={addRoom}
                    className="w-full bg-teal-700 text-white py-2 rounded hover:bg-blue-900 transition"
                >
                    Add Room
                </button>

            </div>

        </div>
    );
};

export default AddRoomPage;