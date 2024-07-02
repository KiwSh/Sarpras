import React, { useState, useEffect } from 'react';
import { FaSearch, FaPlus, FaSignOutAlt } from 'react-icons/fa';
import SidebarSiswa from '../components/SidebarSiswa';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

const RuanganSiswa = () => {
    const [ruangan, setRuangan] = useState([]);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [selectedRuanganId, setSelectedRuanganId] = useState(null);
    const [currentPage, setCurrentPage] = useState(1); // State to manage current page
    const [formData, setFormData] = useState({
        nama_ruangan: '',
        jumlah_ruangan: '',
        tanggal_pinjam: '', // Remove automatic filling
        tanggal_pengembalian: '', // Remove automatic filling
        keterangan: ''
    });
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRuangan = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/data_ruangans/show');
                setRuangan(response.data.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchRuangan();
    }, []);

    const handleLogout = () => {
        // Fungsi logout
    };

    const handleChangeSearch = (e) => {
        setSearchKeyword(e.target.value);
    };

    // Filter ruangan based on search keyword
    const filteredRuangan = ruangan.filter(item =>
        item.nama_ruangan && item.nama_ruangan.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        (item.jumlah && item.jumlah.toString().toLowerCase().includes(searchKeyword.toLowerCase()))
    );

    // Calculate total pages
    const totalPages = Math.ceil(filteredRuangan.length / 5);

    // Slice the data for pagination
    const startIndex = (currentPage - 1) * 5;
    const endIndex = startIndex + 5;
    const paginatedRuangan = filteredRuangan.slice(startIndex, endIndex);

    const navigateToPinjamRuangan = (id, namaRuangan) => {
        setSelectedRuanganId(id);
        setFormData({
            ...formData,
            nama_ruangan: namaRuangan,
            tanggal_pinjam: '', // Reset tanggal peminjaman
            tanggal_pengembalian: '', // Reset tanggal pengembalian
            keterangan: ''
        });
        setShowModal(true);
    };

    // Define a count variable outside the map function
    let count = startIndex;

    const handlePrevPage = () => {
        setCurrentPage(currentPage - 1);
    };

    const handleNextPage = () => {
        setCurrentPage(currentPage + 1);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handlePinjam = () => {
        console.log(`Peminjaman:`, formData);
        // Lakukan aksi peminjaman
        setShowModal(false);
    };

    return (
        <div className="flex">
            <SidebarSiswa />
            <div className="flex-1 p-4">
                <div className="bg-[#C0C0C0] rounded-lg shadow-md p-4 relative">
                <h1 className="text-xl font-semibold mb-4">Ruangan yang tersedia</h1>
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
                        <div className="ml-auto mt-[-5px]">
                            <button
                                onClick={handleLogout}
                                className="bg-[#b23b3b] hover:bg-red-600 text-white py-2 px-4 rounded-md flex items-center"
                            >
                                <span>Logout</span>
                                <FaSignOutAlt className="ml-2" />
                            </button>
                        </div>
                    </div>
                </div>
                <div className="mt-8">
                    <table className="w-full border-collapse border rounded-lg shadow-lg mr-[200px]">
                        <thead>
                            <tr>
                                <th className="border px-4 py-2 text-black text-center bg-gray-300" style={{ borderColor: 'black', color: 'black' }}>No</th>
                                <th className="border px-4 py-2 text-black text-center bg-gray-300" style={{ borderColor: 'black', color: 'black' }}>Nama Ruangan</th>
                                <th className="border px-4 py-2 text-black text-center bg-gray-300" style={{ borderColor: 'black', color: 'black' }}>Jumlah</th>
                                <th className="border px-4 py-2 text-black text-center bg-gray-300" style={{ borderColor: 'black', color: 'black' }}>Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedRuangan.map((item, index) => {
                                // Increment the count for each filtered item
                                count++;
                                // Determine row background color based on index
                                const rowBgColor = index % 2 === 0 ? 'bg-white' : 'bg-gray-300';
                                return (
                                    <tr key={item.id} className={rowBgColor}>
                                        <td className="border px-4 py-2 text-center" style={{ borderColor: 'black', color: 'black' }}>{count}</td>
                                        <td className="border px-4 py-2 text-center" style={{ borderColor: 'black', color: 'black' }}>{item.nama_ruangan}</td>
                                        <td className="border px-4 py-2 text-center" style={{ borderColor: 'black', color: 'black' }}>{item.jumlah}</td>
                                        <td className="border px-2 py-2 text-center" style={{ borderColor: 'black', color: 'black', justifyContent: 'center' }}>
                                            <button onClick={() => navigateToPinjamRuangan(item.id, item.nama_ruangan)} className="bg-green-500 hover:bg-green-700 text-white py-1 px-2 rounded-md flex items-center" style={{ margin: 'auto' }}>
                                                <FaPlus className="mr-1" />
                                                <span>Pinjam</span>
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                <div className="mt-4 flex justify-between">
                    <button onClick={handlePrevPage} disabled={currentPage === 1} className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-md">Sebelumnya</button>
                    <button onClick={handleNextPage} disabled={currentPage === totalPages} className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-md">Berikutnya</button>
                </div>

                {showModal && (
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center">
                        <div className="bg-white p-8 rounded-md">
                            <h2 className="text-xl font-semibold mb-4">Form Peminjaman Ruangan</h2>
                            <div className="mb-4">
                                <label htmlFor="nama_ruangan" className="block text-sm font-medium text-gray-700">Nama Ruangan:</label>
                                <input
                                    type="text"
                                    id="nama_ruangan"
                                    name="nama_ruangan"
                                    value={formData.nama_ruangan}
                                    readOnly // Set nama ruangan otomatis
                                    className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="jumlah_ruangan" className="block text-sm font-medium text-gray-700">Jumlah Ruangan:</label>
                                <input
                                    type="number"
                                    id="jumlah_ruangan"
                                    name="jumlah_ruangan"
                                    value={formData.jumlah_ruangan}
                                    onChange={handleChange}
                                    className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="tanggal_pinjam" className="block text-sm font-medium text-gray-700">Tanggal Pinjam:</label>
                                <input
                                    type="date"
                                    id="tanggal_pinjam"
                                    name="tanggal_pinjam"
                                    value={formData.tanggal_pinjam}
                                    onChange={handleChange}
                                    className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="tanggal_pengembalian" className="block text-sm font-medium text-gray-700">Tanggal Pengembalian:</label>
                                <input
                                    type="date"
                                    id="tanggal_pengembalian"
                                    name="tanggal_pengembalian"
                                    value={formData.tanggal_pengembalian}
                                    onChange={handleChange}
                                    className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="keterangan" className="block text-sm font-medium text-gray-700">Keterangan:</label>
                                <textarea
                                    id="keterangan"
                                    name="keterangan"
                                    value={formData.keterangan}
                                    onChange={handleChange}
                                    className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                                />
                            </div>
                            <div className="flex justify-end">
                                <button
                                    onClick={handlePinjam}
                                    className="bg-green-500 hover:bg-green-700 text-white py-2 px-4 rounded-md"
                                >
                                    Pinjam
                                </button>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded-md ml-2"
                                >
                                    Batal
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RuanganSiswa;
