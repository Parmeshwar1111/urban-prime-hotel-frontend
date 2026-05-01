import React, { useState } from 'react';
import ApiService from '../../service/ApiService';
import { useNavigate, Link } from 'react-router-dom';

function RegisterPage() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phoneNumber: ''
    });

    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const validateForm = () => {
        const { name, email, password, phoneNumber } = formData;
        return name && email && password && phoneNumber;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            setErrorMessage('Please fill all fields');
            setTimeout(() => setErrorMessage(''), 5000);
            return;
        }

        try {
            const response = await ApiService.registerUser(formData);

            if (response.statusCode === 200) {
                setSuccessMessage("Registration Successful!");
                setTimeout(() => navigate('/login'), 2000);
            }

        } catch (error) {
            setErrorMessage(error.response?.data?.message || error.message);
            setTimeout(() => setErrorMessage(''), 5000);
        }
    };

    return (

        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">

            {/* CARD */}
            <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">

                <h2 className="text-2xl font-bold text-center text-teal-700 mb-6">
                    Create Account
                </h2>

                {/* ERROR */}
                {errorMessage && (
                    <p className="text-red-500 text-center mb-4 font-semibold">
                        {errorMessage}
                    </p>
                )}

                {/* SUCCESS */}
                {successMessage && (
                    <p className="text-green-600 text-center mb-4 font-semibold">
                        {successMessage}
                    </p>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">

                    {/* NAME */}
                    <div>
                        <label className="block font-medium mb-1">Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded outline-none focus:ring-2 focus:ring-teal-500"
                        />
                    </div>

                    {/* EMAIL */}
                    <div>
                        <label className="block font-medium mb-1">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded outline-none focus:ring-2 focus:ring-teal-500"
                        />
                    </div>

                    {/* PHONE */}
                    <div>
                        <label className="block font-medium mb-1">Phone Number</label>
                        <input
                            type="text"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded outline-none focus:ring-2 focus:ring-teal-500"
                        />
                    </div>

                    {/* PASSWORD */}
                    <div>
                        <label className="block font-medium mb-1">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded outline-none focus:ring-2 focus:ring-teal-500"
                        />
                    </div>

                    {/* BUTTON */}
                    <button
                        type="submit"
                        className="w-full bg-teal-700 text-white py-2 rounded hover:bg-blue-900 transition"
                    >
                        Register
                    </button>

                </form>

                {/* LOGIN LINK */}
                <p className="text-center text-sm mt-4">
                    Already have an account?{" "}
                    <Link to="/login" className="text-teal-700 font-semibold hover:underline">
                        Login
                    </Link>
                </p>

            </div>

        </div>
    );
}

export default RegisterPage;