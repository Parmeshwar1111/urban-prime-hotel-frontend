import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService from '../../service/ApiService';

const ProfilePage = () => {

    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await ApiService.getUserProfile();
                const userPlusBookings = await ApiService.getUserBookings(response.user.id);
                setUser(userPlusBookings.user);
            } catch (error) {
                setError(error.response?.data?.message || error.message);
            }
        };

        fetchUserProfile();
    }, []);

    const handleLogout = () => {
        ApiService.logout();
        navigate('/home');
    };

    const handleEditProfile = () => {
        navigate('/edit-profile');
    };

    return (
        <div className="px-4 md:px-16 py-10 min-h-screen">

            {/* TITLE */}
            {user && (
                <h2 className="text-3xl font-bold text-teal-700 mb-6 text-center">
                    Welcome, {user.name}
                </h2>
            )}

            {/* ACTION BUTTONS */}
            <div className="flex justify-center gap-4 mb-6">
                <button
                    onClick={handleEditProfile}
                    className="bg-teal-700 text-white px-4 py-2 rounded hover:bg-blue-900 transition"
                >
                    Edit Profile
                </button>

                <button
                    onClick={handleLogout}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                >
                    Logout
                </button>
            </div>

            {/* ERROR */}
            {error && (
                <p className="text-red-500 text-center mb-4 font-semibold">
                    {error}
                </p>
            )}

            {/* PROFILE DETAILS */}
            {user && (
                <div className="max-w-2xl mx-auto bg-white shadow rounded p-6 mb-8">
                    <h3 className="text-xl font-bold text-teal-700 mb-4">
                        My Profile
                    </h3>

                    <div className="space-y-2 text-gray-700">
                        <p><strong>Email:</strong> {user.email}</p>
                        <p><strong>Phone:</strong> {user.phoneNumber}</p>
                    </div>
                </div>
            )}

            {/* BOOKINGS */}
            <div className="max-w-5xl mx-auto">
                <h3 className="text-2xl font-bold text-teal-700 mb-4 text-center">
                    My Booking History
                </h3>

                {user && user.bookings.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {user.bookings.map((booking) => (
                            <div
                                key={booking.id}
                                className="bg-white shadow rounded p-4 hover:shadow-lg transition"
                            >

                                <p className="text-sm text-gray-500 mb-2">
                                    Booking Code: {booking.bookingConfirmationCode}
                                </p>

                                <p><strong>Check-in:</strong> {booking.checkInDate}</p>
                                <p><strong>Check-out:</strong> {booking.checkOutDate}</p>
                                <p><strong>Guests:</strong> {booking.totalNumOfGuest}</p>
                                <p><strong>Room:</strong> {booking.room.roomType}</p>

                                <img
                                    src={booking.room.roomPhotoUrl}
                                    alt="Room"
                                    className="w-full h-40 object-cover mt-3 rounded"
                                />

                            </div>
                        ))}

                    </div>
                ) : (
                    <p className="text-center text-gray-500 mt-4">
                        No bookings found.
                    </p>
                )}
            </div>

        </div>
    );
};

export default ProfilePage;