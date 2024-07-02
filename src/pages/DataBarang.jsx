import React, { useState, useEffect } from 'react';
import { FaSearch, FaEdit, FaTrash, FaPlus, FaSignOutAlt } from 'react-icons/fa';
import Sidebar from '../components/Sidebar';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { startTransition } from 'react';
import Pagination from '@mui/material/Pagination'; // Import Pagination component from Material UI
import Stack from '@mui/material/Stack'; // Import Stack component from Material UI

const Databarang = () => {
    const [barang, setBarang] = useState([]);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editBarangData, setEditBarangData] = useState(null);
    const [isLoadingAdd, setIsLoadingAdd] = useState(false);
    const [isLoadingEdit, setIsLoadingEdit] = useState(false);
    const [foto, setFoto] = useState(null);

    const itemsPerPage = 5;
    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
    }, [currentPage]);

    const fetchData = () => {
        startTransition(() => {
            axios.get(`http://127.0.0.1:8000/api/data_barangs/show?page=${currentPage}`)
                .then(response => {
                    setBarang(response.data.data);
                    console.log(response.data.data);
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                });
        });
    };

    const openAddModal = () => {
        setShowAddModal(true);
    };

    const closeAddModal = () => {
        setShowAddModal(false);
    };

    const handleTambahBarang = () => {
        setIsLoadingAdd(true);
        const namaBarang = document.getElementById('namaBarang').value;
        const jumlahBarang = document.getElementById('jumlahBarang').value;

        axios.post('http://127.0.0.1:8000/api/data_barangs/create', { nama_barang: namaBarang, jumlah: jumlahBarang })
            .then(response => {
                if (response.status === 201 || response.status === 204) {
                    Swal.fire({
                        position: "top-end",
                        icon: "success",
                        title: "Data barang berhasil ditambahkan!",
                        showConfirmButton: false,
                        timer: 1500
                    });
                    closeAddModal();
                    fetchData();
                } else {
                    Swal.fire({
                        position: "top-end",
                        icon: "error",
                        title: "Gagal menambahkan data barang!",
                        showConfirmButton: false,
                        timer: 1500
                    });
                }
            })
            .catch(error => {
                console.error('Error adding data:', error);
                Swal.fire({
                    position: "top-end",
                    icon: "error",
                    title: "Gagal menambahkan data barang!",
                    showConfirmButton: false,
                    timer: 1500
                });
            })
            .finally(() => {
                setIsLoadingAdd(false);
            });
    };

    const handleEdit = (id) => {
        const barangToEdit = barang.find(item => item.id === id);
        setEditBarangData(barangToEdit);
        setShowEditModal(true);
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: 'Apakah Anda yakin?',
            text: 'Data barang akan dihapus secara permanen!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ya, hapus!',
            cancelButtonText: 'Batal'
        }).then((result) => {
            if (result.isConfirmed) {
                axios.delete(`http://127.0.0.1:8000/api/data_barangs/destroy/${id}`)
                    .then(response => {
                        if (response.status === 200) {
                            Swal.fire(
                                'Dihapus!',
                                'Data barang telah dihapus.',
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

    const navigateToAddBarang = () => {
        openAddModal();
    };

    const handleChangeSearch = (e) => {
        setSearchKeyword(e.target.value);
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
                startTransition(() => {
                    Cookies.remove('token');
                    toast.success('Logout Berhasil!', {
                        position: 'top-right',
                        autoClose: 4000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                    navigate('/');
                });
            }
        });
    };

    const filteredBarang = barang.filter(item =>
        item.nama_barang.toLowerCase().includes(searchKeyword.toLowerCase())
    );

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const paginatedBarang = filteredBarang.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(filteredBarang.length / itemsPerPage);

    const handleEditBarang = () => {
        setIsLoadingEdit(true);
        const id = editBarangData.id;
        const namaBarang = document.getElementById('editNamaBarang').value;
        const jumlahBarang = document.getElementById('editJumlahBarang').value;

        axios.put(`http://127.0.0.1:8000/api/data_barangs/update/${id}`, { nama_barang: namaBarang, jumlah: jumlahBarang })
            .then(response => {
                if (response.status === 200) {
                    Swal.fire({
                        position: "top-end",
                        icon: "success",
                        title: "Data barang berhasil diubah!",
                        showConfirmButton: false,
                        timer: 1500
                    });
                    closeEditModal();
                    fetchData();
                } else {
                    Swal.fire({
                        position: "top-end",
                        icon: "error",
                        title: "Gagal mengubah data barang!",
                        showConfirmButton: false,
                        timer: 1500
                    });
                }
            })
            .catch(error => {
                console.error('Error editing data:', error);
                Swal.fire({
                    position: "top-end",
                    icon: "error",
                    title: "Gagal mengubah data barang!",
                    showConfirmButton: false,
                    timer: 1500
                });
            })
            .finally(() => {
                setIsLoadingEdit(false);
            });
    };

    const closeEditModal = () => {
        setShowEditModal(false);
    };

    // Handler for changing page using Material UI Pagination
    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    return (
        <div className="flex">
            <Sidebar />
            <div className="flex-1 p-4">
                <div className="bg-[#C0C0C0] rounded-lg shadow-md p-4 relative">
                    <h1 className="text-xl font-semibold mb-4">Data Barang</h1>
                    <div className="flex items-center mb-4">
                        <div className="relative flex items-center">
                            <div className="bg-white flex items-center rounded-md shadow-md px-3 border border-black">
                                <FaSearch className="text-black-400" />
                                <input type="text" name="katakunci" placeholder="Search..." className="outline-none px-2 py-1 w-64" value={searchKeyword} onChange={handleChangeSearch} />
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center">
                        <div className="ml-auto mt-[-65px]">
                            <button onClick={handleLogout} className="bg-[#b23b3b] hover:bg-red-600 text-white py-2 px-4 rounded-lg flex items-center mb-4">
                                <FaSignOutAlt className="mr-2" />
                                Logout
                            </button>
                        </div>
                    </div>
                    <table className="min-w-full bg-white border border-black shadow-md">
                        <thead>
                            <tr>
                                <th className="py-2 px-4 border-b border-black">No</th>
                                <th className="py-2 px-4 border-b border-black">Nama Barang</th>
                                <th className="py-2 px-4 border-b border-black">Jumlah</th>
                                <th className="py-2 px-4 border-b border-black">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedBarang.map((item, index) => (
                                <tr key={item.id}>
                                    <td className="py-2 px-4 border-b border-black text-center">{indexOfFirstItem + index + 1}</td>
                                    <td className="py-2 px-4 border-b border-black text-center">{item.nama_barang}</td>
                                    <td className="py-2 px-4 border-b border-black text-center">{item.jumlah}</td>
                                    <td className="py-2 px-4 border-b border-black text-center">
                                        <button className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded mr-2" onClick={() => handleEdit(item.id)}>
                                            <FaEdit />
                                        </button>
                                        <button className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded" onClick={() => handleDelete(item.id)}>
                                            <FaTrash />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Pagination Component */}
                    <div className="flex justify-center mt-4">
                        <Stack spacing={2}>
                            <Pagination count={totalPages} page={currentPage} onChange={handlePageChange} variant="outlined" shape="rounded" />
                        </Stack>
                    </div>

                    <button onClick={navigateToAddBarang} className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg flex items-center mt-4">
                        <FaPlus className="mr-2" />
                        Tambah Barang
                    </button>
                </div>
            </div>

            {/* Modal Add */}
            {showAddModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-4 rounded-lg shadow-lg max-w-md w-full">
                        <h2 className="text-xl font-semibold mb-4">Tambah Data Barang</h2>
                        <div className="mb-4">
                            <label className="block mb-1">Nama Barang:</label>
                            <input type="text" id="namaBarang" className="w-full border border-gray-300 rounded-md p-2" />
                        </div>
                        <div className="mb-4">
                            <label className="block mb-1">Jumlah Barang:</label>
                            <input type="number" id="jumlahBarang" className="w-full border border-gray-300 rounded-md p-2" />
                        </div>
                        <div className="flex justify-end">
                            <button onClick={closeAddModal} className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg mr-2">Batal</button>
                            <button onClick={handleTambahBarang} className={`bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg ${isLoadingAdd ? 'cursor-not-allowed opacity-50' : ''}`} disabled={isLoadingAdd}>
                                {isLoadingAdd ? 'Menambahkan...' : 'Tambah'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Edit */}
            {showEditModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-4 rounded-lg shadow-lg max-w-md w-full">
                        <h2 className="text-xl font-semibold mb-4">Edit Data Barang</h2>
                        <div className="mb-4">
                            <label className="block mb-1">Nama Barang:</label>
                            <input type="text" id="editNamaBarang" className="w-full border border-gray-300 rounded-md p-2" defaultValue={editBarangData.nama_barang} />
                        </div>
                        <div className="mb-4">
                            <label className="block mb-1">Jumlah Barang:</label>
                            <input type="number" id="editJumlahBarang" className="w-full border border-gray-300 rounded-md p-2" defaultValue={editBarangData.jumlah} />
                        </div>
                        <div className="flex justify-end">
                            <button onClick={closeEditModal} className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg mr-2">Batal</button>
                            <button onClick={handleEditBarang} className={`bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg ${isLoadingEdit ? 'cursor-not-allowed opacity-50' : ''}`} disabled={isLoadingEdit}>
                                {isLoadingEdit ? 'Mengubah...' : 'Ubah'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Databarang;
