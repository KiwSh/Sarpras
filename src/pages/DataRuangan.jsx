import React, { useState, useEffect } from 'react';
import { FaSearch, FaPlus, FaSignOutAlt } from 'react-icons/fa';
import Sidebar from '../components/Sidebar';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import Swal from 'sweetalert2';

const DataRuangan = () => {
    const [ruangan, setRuangan] = useState([]);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [showAddModal, setShowAddModal] = useState(false);
    const [namaRuangan, setNamaRuangan] = useState('');
    const [jumlahRuangan, setJumlahRuangan] = useState(0);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editedRuangan, setEditedRuangan] = useState({ id: null, nama_ruangan: '', jumlah: 0 });

    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
    }, [currentPage, searchKeyword]);

    const fetchData = () => {
        axios.get(`http://127.0.0.1:8000/api/data_ruangans/show?page=${currentPage}&search=${searchKeyword}`)
            .then(response => {
                setRuangan(response.data.data);
                setTotalPages(response.data.total_pages); // Assuming API returns total_pages
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    };

    const handleTambahRuangan = () => {
        axios.post('http://127.0.0.1:8000/api/data_ruangans/create', {
            nama_ruangan: namaRuangan,
            jumlah: jumlahRuangan
        })
        .then(response => {
            if (response.status === 201) {
                setShowAddModal(false);
                fetchData();
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "Data ruangan berhasil ditambahkan!",
                    showConfirmButton: false,
                    timer: 1500
                });
            } else {
                toast.error('Gagal menambahkan ruangan!', {
                    position: 'top-right',
                    autoClose: 4000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }
        })
        .catch(error => {
            console.error('Error adding ruangan:', error);
            toast.error('Gagal menambahkan ruangan!', {
                position: 'top-right',
                autoClose: 4000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        });
    };
    
    const handleChangeNamaRuangan = (e) => {
        setNamaRuangan(e.target.value);
    };

    const handleChangeJumlahRuangan = (e) => {
        setJumlahRuangan(e.target.value);
    };

    const openAddModal = () => {
        setShowAddModal(true);
    };

    const closeAddModal = () => {
        setShowAddModal(false);
    };

    const handleEditRuangan = () => {
        axios.put(`http://127.0.0.1:8000/api/data_ruangans/update/${editedRuangan.id}`, {
            nama_ruangan: editedRuangan.nama_ruangan,
            jumlah: editedRuangan.jumlah
        })
        .then(response => {
            if (response.status === 200) {
                setShowEditModal(false);
                fetchData();
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "Data ruangan berhasil diubah!",
                    showConfirmButton: false,
                    timer: 1500
                });
            } else {
                toast.error('Gagal mengubah ruangan!', {
                    position: 'top-right',
                    autoClose: 4000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }
        })
        .catch(error => {
            console.error('Error updating ruangan:', error);
            toast.error('Gagal mengubah ruangan!', {
                position: 'top-right',
                autoClose: 4000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        });
    };

    const handleEdit = (id) => {
        setShowEditModal(true);
        const selectedRuangan = ruangan.find(r => r.id === id);
        setEditedRuangan({ ...selectedRuangan });
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: 'Apakah Anda yakin?',
            text: 'Data ruangan akan dihapus secara permanen!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ya, hapus!',
            cancelButtonText: 'Batal'
        }).then((result) => {
            if (result.isConfirmed) {
                axios.delete(`http://127.0.0.1:8000/api/data_ruangans/destroy/${id}`)
                    .then(response => {
                        if (response.status === 200) {
                            Swal.fire(
                                'Dihapus!',
                                'Data ruangan telah dihapus.',
                                'success'
                            );
                            fetchData();
                        } else {
                            Swal.fire(
                                'Error!',
                                'Terjadi kesalahan saat menghapus data.',
                                'error'
                            );
                        }
                    })
                    .catch(error => {
                        console.error('Error deleting data:', error);
                        Swal.fire(
                            'Error!',
                            'Terjadi kesalahan saat menghapus data.',
                            'error'
                        );
                    });
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

    const closeEditModal = () => {
        setShowEditModal(false);
    };
    
    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const filteredRuangan = ruangan.filter(item =>
        item.nama_ruangan.toLowerCase().includes(searchKeyword.toLowerCase())
    );

    return (
        <div className="flex">
            <Sidebar />
            <div className="flex-1 p-4">
                <div className="bg-[#C0C0C0] rounded-lg shadow-md p-4 relative">
                    <h1 className="text-xl font-semibold mb-4">Data Ruangan</h1>
                    <div className="flex items-center mb-4">
                        <div className="relative flex items-center">
                            <div className="bg-white flex items-center rounded-md shadow-md px-3 border border-black">
                                <FaSearch className="text-black-400" />
                                <input type="text" name="katakunci" placeholder="Search..." className="outline-none px-2 py-1 w-64" value={searchKeyword} onChange={e => setSearchKeyword(e.target.value)} />
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
                    <button onClick={openAddModal} className="bg-green-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md mb-4 flex items-center">
                        <FaPlus className="mr-2" />
                        Tambah Ruangan
                    </button>
                    {showAddModal && (
                        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                            <div className="bg-white p-8 rounded-md shadow-md">
                                <h2 className="text-lg font-semibold mb-4">Tambah Ruangan</h2>
                                <div className="mb-4">
                                    <label htmlFor="namaRuangan" className="block text-sm font-medium text-gray-700">Nama Ruangan:</label>
                                    <input type="text" name="namaRuangan" id="namaRuangan" className="mt-1 p-2 block w-full border-gray-300 rounded-md" onChange={handleChangeNamaRuangan} />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="jumlahRuangan" className="block text-sm font-medium text-gray-700">Jumlah Ruangan:</label>
                                    <input type="number" name="jumlahRuangan" id="jumlahRuangan" className="mt-1 p-2 block w-full border-gray-300 rounded-md" onChange={handleChangeJumlahRuangan} />
                                </div>
                                <div className="flex justify-end">
                                    <button onClick={closeAddModal} className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md mr-2">Batal</button>
                                    <button onClick={handleTambahRuangan} className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md">Tambah</button>
                                </div>
                            </div>
                        </div>
                    )}
                    {showEditModal && (
                        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                            <div className="bg-white p-8 rounded-md shadow-md">
                                <h2 className="text-lg font-semibold mb-4">Edit Ruangan</h2>
                                <div className="mb-4">
                                    <label htmlFor="namaRuangan" className="block text-sm font-medium text-gray-700">Nama Ruangan:</label>
                                    <input type="text" name="namaRuangan" id="namaRuangan" className="mt-1 p-2 block w-full border-gray-300 rounded-md" value={editedRuangan.nama_ruangan} onChange={(e) => setEditedRuangan({ ...editedRuangan, nama_ruangan: e.target.value })} />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="jumlahRuangan" className="block text-sm font-medium text-gray-700">Jumlah Ruangan:</label>
                                    <input type="number" name="jumlahRuangan" id="jumlahRuangan" className="mt-1 p-2 block w-full border-gray-300 rounded-md" value={editedRuangan.jumlah} onChange={(e) => setEditedRuangan({ ...editedRuangan, jumlah: e.target.value })} />
                                </div>
                                <div className="flex justify-end">
                                    <button onClick={closeEditModal} className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md mr-2">Batal</button>
                                    <button onClick={handleEditRuangan} className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md">Simpan</button>
                                </div>
                            </div>
                        </div>
                    )}
                    {/* Tampilkan Data Ruangan */}
                    <table className="w-full border-collapse border rounded-lg shadow-lg mr-[200px]">
                        {/* Table Header */}
                        <thead>
                            <tr>
                                <th className="border px-4 py-2 text-black text-center bg-gray-300" style={{ borderColor: 'black', color: 'black' }}>No</th>
                                <th className="border px-4 py-2 text-black text-center bg-gray-300" style={{ borderColor: 'black', color: 'black' }}>Nama Ruangan</th>
                                <th className="border px-4 py-2 text-black text-center bg-gray-300" style={{ borderColor: 'black', color: 'black' }}>Jumlah</th>
                                <th className="border px-4 py-2 text-black text-center bg-gray-300" style={{ borderColor: 'black', color: 'black' }}>Actions</th>
                            </tr>
                        </thead>
                        {/* Table Body */}
                        <tbody>
                        {filteredRuangan.map((item, index) => (
                            <tr key={item.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-300"}>
                                <td className="border px-4 py-2 text-black text-center" style={{ borderColor: 'black', color: 'black' }}>{(currentPage - 1) * 10 + index + 1}</td>
                                <td className="border px-4 py-2 text-black text-center" style={{ borderColor: 'black', color: 'black' }}>{item.nama_ruangan}</td>
                                <td className="border px-4 py-2 text-black text-center" style={{ borderColor: 'black', color: 'black' }}>{item.jumlah}</td>
                                <td className="border px-2 py-2 text-center" style={{ borderColor: 'black', color: 'black' }}>
                                        <button
                                            onClick={() => handleEdit(item.id)}
                                            className="mr-2 bg-transparent hover:bg-blue-800 text-blue-500 hover:text-white py-1 px-2 rounded-md btn-action w-[100px] border border-blue-500"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(item.id)}
                                            className="ml-2 bg-transparent hover:bg-red-800 text-red-500 hover:text-white py-1 px-2 rounded-md btn-action w-[100px] border border-red-500"
                                        >
                                            Hapus
                                        </button>
                                    </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    <div className="flex justify-between items-center mt-4">
                        <button
                            onClick={handlePrevPage}
                            className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={currentPage === 1}
                        >
                            Prev
                        </button>
                        <div>
                            Page {currentPage} of {totalPages}
                        </div>
                        <button
                            onClick={handleNextPage}
                            className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={currentPage === totalPages}
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DataRuangan;
