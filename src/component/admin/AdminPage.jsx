import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ApiService from '../../service/ApiService';

const AdminPage = () => {

    const [adminName, setAdminName] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAdminName = async () => {
            try {
                const response = await ApiService.getUserProfile();
                setAdminName(response.user.name);
            } catch (error) {
                console.error(error.message);
            }
        };

        fetchAdminName();
    }, []);

    return (
        <div className="min-h-screen px-4 md:px-16 py-10 bg-gray-100">

            {/* HEADER */}
            <h1 className="text-3xl md:text-4xl font-bold text-center text-teal-700 mb-10">
                Welcome, {adminName}
            </h1>

            {/* ACTION CARDS */}
            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* MANAGE ROOMS */}
                <div 
                    onClick={() => navigate('/admin/manage-rooms')}
                    className="cursor-pointer bg-white shadow-lg rounded-lg p-6 flex flex-col items-center justify-center hover:shadow-xl hover:scale-105 transition"
                >
                    <div className="text-5xl mb-3">🏨</div>
                    <h2 className="text-xl font-bold text-teal-700">
                        Manage Rooms
                    </h2>
                    <p className="text-gray-500 text-sm text-center mt-2">
                        Add, edit, and manage hotel rooms
                    </p>
                </div>

                {/* MANAGE BOOKINGS */}
                <div 
                    onClick={() => navigate('/admin/manage-bookings')}
                    className="cursor-pointer bg-white shadow-lg rounded-lg p-6 flex flex-col items-center justify-center hover:shadow-xl hover:scale-105 transition"
                >
                    <div className="text-5xl mb-3">📅</div>
                    <h2 className="text-xl font-bold text-teal-700">
                        Manage Bookings
                    </h2>
                    <p className="text-gray-500 text-sm text-center mt-2">
                        View and control all bookings
                    </p>
                </div>

            </div>

        </div>
    );
};

export default AdminPage;