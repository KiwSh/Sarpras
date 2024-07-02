import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import { FaSignOutAlt, FaPlane } from 'react-icons/fa'; // Import icons
import Swal from 'sweetalert2'; // Import SweetAlert

const TambahUserForm = ({ onSubmit }) => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        confirmPassword: '',
        email: '',
        foto: '',
        statusAkun: '',
        roleAkun: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
        setFormData({
            username: '',
            password: '',
            confirmPassword: '',
            email: '',
            foto: '',
            statusAkun: '',
            roleAkun: ''
        });
    };

    // Fungsi untuk logout dengan notifikasi SweetAlert
    const handleLogout = () => {
        Swal.fire({
            title: 'Logout',
            text: 'Apakah Anda yakin ingin logout?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ya, logout',
            cancelButtonText: 'Batal'
        }).then((result) => {
            if (result.isConfirmed) {
                // Kode untuk logout
                console.log("Logout berhasil!");
            }
        });
    };

    return (
        <div className="flex">
            <Sidebar />
            <div className="flex-1 p-4">
                <div className="bg-[#F5F5F5] rounded-lg shadow-md p-4 relative">
                    <h1 className="text-xl font-semibold mb-4">Tambah Pengguna</h1>
                    <div className="flex items-center">
                        <div className="relative flex items-center">
                            <div className="bg-white flex items-center rounded-md shadow-md px-3">
                            </div>
                        </div>
                    </div>
                    <div className="absolute top-0 right-0 mt-[25px] mr-[60px]"> {/* Mengubah posisi tombol logout */}
                        <button onClick={handleLogout} className="bg-gray-500 hover:bg-red-600 text-white py-2 px-4 rounded-md flex items-center">
                            <span>Logout</span>
                            <FaSignOutAlt className="ml-2" />
                        </button>
                    </div>
                </div>
                <div className="flex justify-center items-center h-screen">
                    <div className="bg-[#F5F5F5] rounded-lg shadow-md p-6 mb-[50px]">
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
                                <input type="text" id="username" name="username" value={formData.username} onChange={handleChange} className="mt-1 block w-full rounded-md border border-black shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                                <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} className="mt-1 block w-full rounded-md border border-black shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
                                <input type="password" id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className="mt-1 block w-full rounded-md border border-black shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                                <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className="mt-1 block w-full rounded-md border border-black shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="foto" className="block text-sm font-medium text-gray-700">Foto</label>
                                <input type="file" id="foto" name="foto" accept="image/*" onChange={handleChange} className="mt-1 block w-full rounded-md border border-black shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="statusAkun" className="block text-sm font-medium text-gray-700">Status Akun</label>
                                <input type="text" id="statusAkun" name="statusAkun" value={formData.statusAkun} onChange={handleChange} className="mt-1 block w-full rounded-md border border-black shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="roleAkun" className="block text-sm font-medium text-gray-700">Role Akun</label>
                                <input type="text" id="roleAkun" name="roleAkun" value={formData.roleAkun} onChange={handleChange} className="mt-1 block w-full rounded-md border border-black shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
                            </div>
                            <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md flex items-center">
                                <span>Submit</span>
                                <FaPlane className="ml-2" /> {/* Icon pesawat */}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TambahUserForm;
