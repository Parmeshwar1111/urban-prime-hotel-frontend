import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService from '../../service/ApiService';

const EditProfilePage = () => {

    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await ApiService.getUserProfile();
                setUser(response.user);
            } catch (error) {
                setError(error.message);
            }
        };

        fetchUserProfile();
    }, []);

    const handleDeleteProfile = async () => {
        if (!window.confirm('Are you sure you want to delete your account?')) return;

        try {
            await ApiService.deleteUser(user.id);
            navigate('/signup');
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className="px-4 md:px-16 py-10 min-h-screen flex justify-center items-start">

            {/* CARD */}
            <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">

                <h2 className="text-2xl font-bold text-center text-teal-700 mb-6">
                    Edit Profile
                </h2>

                {/* ERROR */}
                {error && (
                    <p className="text-red-500 text-center mb-4 font-semibold">
                        {error}
                    </p>
                )}

                {/* USER DETAILS */}
                {user && (
                    <div className="space-y-4 text-gray-700">

                        <div>
                            <p className="font-semibold">Name</p>
                            <p className="border p-2 rounded bg-gray-50">{user.name}</p>
                        </div>

                        <div>
                            <p className="font-semibold">Email</p>
                            <p className="border p-2 rounded bg-gray-50">{user.email}</p>
                        </div>

                        <div>
                            <p className="font-semibold">Phone Number</p>
                            <p className="border p-2 rounded bg-gray-50">{user.phoneNumber}</p>
                        </div>

                        {/* DELETE BUTTON */}
                        <button
                            onClick={handleDeleteProfile}
                            className="w-full mt-4 bg-red-500 text-white py-2 rounded hover:bg-red-600 transition"
                        >
                            Delete Profile
                        </button>

                    </div>
                )}

            </div>

        </div>
    );
};

export default EditProfilePage;