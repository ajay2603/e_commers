import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('consumer');
    // const [address, setAddress] = useState(''); // Added state for address

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/auth/login', { email, password, type:role, address });
            console.log('Login successful:', response.data);
        } catch (error) {
            console.error('Error logging in:', error);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-center text-gray-800">Login</h2>
                <form className="space-y-4" onSubmit={handleLogin}>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 mt-2 text-gray-700 bg-gray-200 border rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
                            placeholder="Enter your email"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 mt-2 text-gray-700 bg-gray-200 border rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
                            placeholder="Enter your password"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Role</label>
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="w-full px-4 py-2 mt-2 text-gray-700 bg-gray-200 border rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        >
                            <option value="consumer">Consumer</option>
                            <option value="seller">Seller</option>
                        </select>
                    </div>
                    {/* <div>
                        <label className="block text-sm font-medium text-gray-700">Address</label>
                        <textarea
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className="w-full px-4 py-2 mt-2 text-gray-700 bg-gray-200 border rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
                            placeholder="Enter your address"
                        ></textarea>
                    </div> */}
                    <button
                        type="submit"
                        className="w-full px-4 py-2 font-bold text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none"
                    >
                        Login
                    </button>
                </form>
                <p className="text-sm text-center text-gray-600">
                    Don't have an account? <a href="/signup" className="text-blue-500 hover:underline">Sign up</a>
                </p>
            </div>
        </div>
    );
};

export default Login