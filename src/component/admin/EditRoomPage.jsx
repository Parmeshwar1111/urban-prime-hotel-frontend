import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ApiService from '../../service/ApiService';

const EditRoomPage = () => {

    const { roomId } = useParams();
    const navigate = useNavigate();

    const [roomDetails, setRoomDetails] = useState({
        roomPhotoUrl: '',
        roomType: '',
        roomPrice: '',
        roomDescription: '',
    });

    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        const fetchRoomDetails = async () => {
            try {
                const response = await ApiService.getRoomById(roomId);
                setRoomDetails({
                    roomPhotoUrl: response.room.roomPhotoUrl,
                    roomType: response.room.roomType,
                    roomPrice: response.room.roomPrice,
                    roomDescription: response.room.roomDescription,
                });
            } catch (error) {
                setError(error.response?.data?.message || error.message);
            }
        };
        fetchRoomDetails();
    }, [roomId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setRoomDetails(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
        }
    };

    const handleUpdate = async () => {
        try {
            const formData = new FormData();
            formData.append('roomType', roomDetails.roomType);
            formData.append('roomPrice', roomDetails.roomPrice);
            formData.append('roomDescription', roomDetails.roomDescription);

            if (file) formData.append('photo', file);

            const result = await ApiService.updateRoom(roomId, formData);

            if (result.statusCode === 200) {
                setSuccess('Room updated successfully!');
                setTimeout(() => navigate('/admin/manage-rooms'), 3000);
            }

        } catch (error) {
            setError(error.response?.data?.message || error.message);
            setTimeout(() => setError(''), 5000);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Do you want to delete this room?')) return;

        try {
            const result = await ApiService.deleteRoom(roomId);

            if (result.statusCode === 200) {
                setSuccess('Room deleted successfully!');
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
                    Edit Room
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

                {/* IMAGE */}
                {(preview || roomDetails.roomPhotoUrl) && (
                    <img
                        src={preview || roomDetails.roomPhotoUrl}
                        alt="Room"
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
                    <input
                        type="text"
                        name="roomType"
                        value={roomDetails.roomType}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                    />
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

                {/* BUTTONS */}
                <div className="flex gap-4">

                    <button
                        onClick={handleUpdate}
                        className="flex-1 bg-teal-700 text-white py-2 rounded hover:bg-blue-900 transition"
                    >
                        Update Room
                    </button>

                    <button
                        onClick={handleDelete}
                        className="flex-1 bg-red-500 text-white py-2 rounded hover:bg-red-600 transition"
                    >
                        Delete
                    </button>

                </div>

            </div>

        </div>
    );
};

export default EditRoomPage;