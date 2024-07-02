import React, { useState } from 'react';
import Modal from 'react-modal';
import { FaSearch, FaEdit, FaTrash, FaPlus, FaSignOutAlt } from 'react-icons/fa';
import Sidebar from '../components/Sidebar';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const DataUser = () => {
    const [users, setUsers] = useState([
        { id: 1, username: 'john_doe', userRole: 'Admin' },
        { id: 2, username: 'jane_doe', userRole: 'User' },
        // Data pengguna lainnya...
    ]);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        userRole: '', // menambahkan userRole
    });
    const [showAddModal, setShowAddModal] = useState(false); // Menambahkan state untuk menampilkan modal tambah user
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const openModal = () => {
        setShowAddModal(true); // Menampilkan modal tambah user
    };

    const closeModal = () => {
        setShowAddModal(false); // Menyembunyikan modal tambah user
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Lakukan penanganan pengiriman data form ke backend disini
        closeModal(); // Tutup modal setelah form dikirim
    };

    const handleEdit = (id) => {
        navigate(`/EditUser/${id}`);
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: 'Apakah Anda yakin?',
            text: 'Data user akan dihapus secara permanen!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ya, hapus!',
            cancelButtonText: 'Batal',
        }).then((result) => {
            if (result.isConfirmed) {
                setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
                Swal.fire('Dihapus!', 'Data user telah dihapus.', 'success');
            }
        });
    };

    const handleLogout = () => {
        Swal.fire({
            title: 'Logout',
            text: 'Apakah Anda yakin ingin logout?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ya, logout',
            cancelButtonText: 'Batal',
        }).then((result) => {
            if (result.isConfirmed) {
                navigate('/');
            }
        });
    };

    const handleChangeSearch = (e) => {
        setSearchKeyword(e.target.value);
    };

    const filteredUsers = users.filter(
        (user) =>
            user.username.toLowerCase().includes(searchKeyword.toLowerCase()) ||
            user.userRole.toLowerCase().includes(searchKeyword.toLowerCase())
    );

    return (
        <div className="flex">
            <Sidebar />
            <div className="flex-1 p-4">
                <div className="bg-[#C0C0C0] rounded-lg shadow-md p-4 relative">
                    <h1 className="text-xl font-semibold mb-4">Data User</h1>
                    <div className="flex items-center mb-4">
                        <div className="relative flex items-center">
                            <div className="bg-white flex items-center rounded-md shadow-md px-3 border border-black">
                                <FaSearch className="text-black-400" />
                                <input
                                    type="text"
                                    name="katakunci"
                                    placeholder="Search..."
                                    className="outline-none px-2 py-1 w-64"
                                    value={searchKeyword}
                                    onChange={handleChangeSearch}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center">
                        <div className="ml-auto mt-[-65px]">
                            <button onClick={handleLogout} className="bg-[#b23b3b] hover:bg-red-600 text-white py-2 px-4 rounded-md flex items-center">
                                <span>Logout</span>
                                <FaSignOutAlt className="ml-2" />
                            </button>
                        </div>
                    </div>
                </div>
                <div className="mt-8">
                    <button onClick={openModal} className="bg-green-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md mb-4 flex items-center">
                        <FaPlus className="mr-2" />
                        Tambah User
                    </button>
                    <table className="w-full border-collapse border rounded-lg shadow-lg mr-[200px]">
                        <thead>
                            <tr>
                                <th className="border px-4 py-2 text-black text-center bg-gray-300" style={{ borderColor: 'black', color: 'black' }}>
                                    No
                                </th>
                                <th className="border px-4 py-2 text-black text-center bg-gray-300" style={{ borderColor: 'black', color: 'black' }}>
                                    Username
                                </th>
                                <th className="border px-4 py-2 text-black text-center bg-gray-300" style={{ borderColor: 'black', color: 'black' }}>
                                    User Role
                                </th>
                                <th className="border px-4 py-2 text-black text-center bg-gray-300" style={{ borderColor: 'black', color: 'black' }}>
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map((user, index) => (
                                <tr key={user.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-300'}>
                                    <td className="border px-4 py-2 text-black text-center" style={{ borderColor: 'black', color: 'black' }}>
                                        {index + 1}
                                    </td>
                                    <td className="border px-4 py-2 text-black text-center" style={{ borderColor: 'black', color: 'black' }}>
                                        {user.username}
                                    </td>
                                    <td className="border px-4 py-2 text-black text-center" style={{ borderColor: 'black', color: 'black' }}>
                                        {user.userRole}
                                    </td>
                                    <td className="border px-2 py-2 text-center" style={{ borderColor: 'black', color: 'black', justifyContent: 'center' }}>
                                        <button
                                            onClick={() => handleEdit(user.id)}
                                            className="mr-2 bg-transparent hover:bg-blue-800 text-blue-500 hover:text-white py-1 px-2 rounded-md btn-action w-[100px] border border-blue-500 items-center"
                                            style={{ margin: 'auto' }}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(user.id)}
                                            className="ml-2 bg-transparent hover:bg-red-800 text-red-500 hover:text-white py-1 px-2 rounded-md btn-action w-[100px] border border-red-500"
                                        >
                                            Hapus
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <Modal isOpen={showAddModal} onRequestClose={closeModal} className="Modal">
                    <div className="bg-white rounded-lg shadow-md p-6 w-96 mx-auto"> {/* Memperkecil lebar form dan meletakkan di tengah */}
                        <h2 className="text-xl font-semibold mb-4">Tambah User</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username:</label>
                                <input type="text" id="username" name="username" value={formData.username} onChange={handleChange} className="mt-1 p-2 block w-full border-gray-300 rounded-md" />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password:</label>
                                <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} className="mt-1 p-2 block w-full border-gray-300 rounded-md" />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="userRole" className="block text-sm font-medium text-gray-700">Role:</label>
                                <input type="text" id="userRole" name="userRole" value={formData.userRole} onChange={handleChange} className="mt-1 p-2 block w-full border-gray-300 rounded-md" />
                            </div>
                            <div className="flex justify-end">
                                <button type="button" onClick={closeModal} className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md mr-2">Batal</button>
                                <button type="submit" className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md">Tambah</button>
                            </div>
                        </form>
                    </div>
                </Modal>
            </div>
        </div>
    );
};

export default DataUser;
