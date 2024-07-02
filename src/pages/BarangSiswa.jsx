import React, { useState, useEffect } from 'react';
import { FaSearch, FaPlus, FaSignOutAlt } from 'react-icons/fa';
import SidebarSiswa from '../components/SidebarSiswa';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

const BarangSiswa = () => {
    const [barang, setBarang] = useState([]);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [selectedBarangId, setSelectedBarangId] = useState(null);
    const [formData, setFormData] = useState({
        nama_barang: '',
        jumlah_barang: '',
        tanggal_pinjam: '',
        tanggal_pengembalian: '',
        keterangan: ''
    });
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBarang = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/data_barangs/show');
                setBarang(response.data.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchBarang();
    }, []);

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
                Cookies.remove('token');
                navigate('/');
                toast.success('Logout Berhasil!', {
                    position: 'top-right',
                    autoClose: 4000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }
        });
    };

    const handleChangeSearch = (e) => {
        setSearchKeyword(e.target.value);
    };

    const filteredBarang = barang.filter(item =>
        item.nama_barang.toLowerCase().includes(searchKeyword.toLowerCase())
    );

    const navigateToPinjamBarang = (id, namaBarang) => {
        setSelectedBarangId(id);
        setFormData({
            ...formData,
            nama_barang: namaBarang,
            jumlah_barang: '',
            tanggal_pinjam: '',
            tanggal_pengembalian: '',
            keterangan: ''
        });
        setShowModal(true);
    };

    const handlePinjam = async (e) => {
        e.preventDefault();
        const user_id = Cookies.get('user_id');
        if (!user_id) {
            toast.error('User ID tidak ditemukan. Silakan login kembali.', {
                position: 'top-right',
                autoClose: 4000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            return;
        }

        if (!formData.tanggal_pinjam || !formData.tanggal_pengembalian || !formData.jumlah_barang || !formData.nama_barang) {
            toast.error('Semua kolom harus diisi.', {
                position: 'top-right',
                autoClose: 4000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            return;
        }

        console.log("Mengirim data peminjaman dengan:", formData);

        try {
            const response = await axios.post(`http://127.0.0.1:8000/api/data_peminjaman/store/${user_id}`, {
                user_id,
                tanggal_pinjam: formData.tanggal_pinjam,
                nama_peminjam: user_id,
                nama_peminjaman: formData.nama_barang,
                jumlah: formData.jumlah_barang,
                jenis_peminjaman: 'barang',
                keterangan: formData.keterangan,
                status: 'dipinjam'
            });

            console.log("Response dari server:", response.data);

            if (response.data.success) {
                setBarang(prevBarang => prevBarang.map(item =>
                    item.id === selectedBarangId
                        ? { ...item, jumlah: item.jumlah - formData.jumlah_barang }
                        : item
                ));

                toast.success('Barang telah berhasil dipinjam!', {
                    position: 'top-right',
                    autoClose: 4000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });

                setShowModal(false);
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: response.data.message || 'Gagal meminjam barang.',
                });
            }
        } catch (error) {
            console.error('Error borrowing item:', error);
            toast.error('Terjadi kesalahan saat meminjam barang.', {
                position: 'top-right',
                autoClose: 4000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
    };

    const handlePrevPage = () => {
        setCurrentPage(prevPage => Math.max(prevPage - 1, 1));
    };

    const handleNextPage = () => {
        setCurrentPage(prevPage => Math.min(prevPage + 1, Math.ceil(filteredBarang.length / itemsPerPage)));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredBarang.slice(indexOfFirstItem, indexOfLastItem);

    return (
        <div className="flex">
            <SidebarSiswa />
            <div className="flex-1 p-4">
                <div className="bg-[#C0C0C0] rounded-lg shadow-md p-4 relative">
                    <h1 className="text-xl font-semibold mb-4">Barang dan alat yang tersedia</h1>
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
                    <table className="w-full border-collapse border rounded-lg shadow-lg mr-[200px]" style={{ borderColor: 'black' }}>
                        <thead>
                            <tr>
                                <th className="border px-4 py-2 text-black text-center bg-gray-300" style={{ borderColor: 'black', color: 'black' }}>No</th>
                                <th className="border px-4 py-2 text-black text-center bg-gray-300" style={{ borderColor: 'black', color: 'black' }}>Nama Barang</th>
                                <th className="border px-4 py-2 text-black text-center bg-gray-300" style={{ borderColor: 'black', color: 'black' }}>Jumlah</th>
                                <th className="border px-4 py-2 text-black text-center bg-gray-300" style={{ borderColor: 'black', color: 'black' }}>Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.map((item, index) => (
                                <tr key={item.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-300"}>
                                    <td className="border px-4 py-2 text-center" style={{ borderColor: 'black', color: 'black' }}>{indexOfFirstItem + index + 1}</td>
                                    <td className="border px-4 py-2 text-center" style={{ borderColor: 'black', color: 'black' }}>{item.nama_barang}</td>
                                    <td className="border px-4 py-2 text-center" style={{ borderColor: 'black', color: 'black' }}>{item.jumlah}</td>
                                    <td className="border px-2 py-2 text-center" style={{ borderColor: 'black', color: 'black', justifyContent: 'center' }}>
                                        <button
                                            onClick={() => navigateToPinjamBarang(item.id, item.nama_barang)}
                                            className="bg-green-500 hover:bg-green-700 text-white py-1 px-2 rounded-md flex items-center"
                                            style={{ margin: 'auto' }}
                                        >
                                            <FaPlus className="mr-1" />
                                            <span>Pinjam</span>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="mt-4 flex justify-between">
                    <button 
                        onClick={handlePrevPage} 
                        className={`bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-md ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={currentPage === 1}
                    >
                        Sebelumnya
                    </button>
                    <button 
                        onClick={handleNextPage} 
                        className={`bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-md ${currentPage === Math.ceil(filteredBarang.length / itemsPerPage) ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={currentPage === Math.ceil(filteredBarang.length / itemsPerPage)}
                    >
                        Berikutnya
                    </button>
                </div>

                {showModal && (
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center">
                        <div className="bg-white p-8 rounded-md">
                            <h2 className="text-xl font-semibold mb-4">Form Peminjaman Barang</h2>
                            <form onSubmit={handlePinjam}>
                                <div className="mb-4">
                                    <label htmlFor="nama_barang" className="block text-sm font-medium text-gray-700">Nama Barang:</label>
                                    <input
                                        type="text"
                                        id="nama_barang"
                                        name="nama_barang"
                                        value={formData.nama_barang}
                                        readOnly
                                        className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="jumlah_barang" className="block text-sm font-medium text-gray-700">Jumlah Barang:</label>
                                    <input
                                        type="number"
                                        id="jumlah_barang"
                                        name="jumlah_barang"
                                        value={formData.jumlah_barang}
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
                                        min={new Date().toISOString().split('T')[0]}
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
                                        min={new Date().toISOString().split('T')[0]}
                                        onChange={handleChange}
                                        className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="keterangan" className="block text-sm font-medium text-gray-700">Keterangan Peminjaman:</label>
                                    <textarea
                                        id="keterangan"
                                        name="keterangan"
                                        value={formData.keterangan}
                                        onChange={handleChange}
                                        className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                                    />
                                </div>
                                <div className="flex justify-end">
                                    <input
                                        type="submit"
                                        value="Pinjam"
                                        className="bg-green-500 hover:bg-green-700 text-white py-2 px-4 rounded-md"
                                    />
                                    <input
                                        type="button"
                                        value="Batal"
                                        onClick={() => setShowModal(false)}
                                        className="bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded-md ml-2"
                                    />
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BarangSiswa;
