import React, { useState } from 'react';
import { FaSearch, FaSignOutAlt } from 'react-icons/fa'; // Import icons
import SidebarSiswa from '../components/SidebarSiswa'; // Import Sidebar component
import Swal from 'sweetalert2'; // Import SweetAlert
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import Cookies from 'js-cookie'; // Import Cookies from js-cookie
import { toast } from 'react-toastify'; // Import toast from react-toastify
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS for react-toastify

const LaporanSiswa = () => {
    // Data peminjaman barang
    const [peminjaman, setPeminjaman] = useState([
        { id: 1, tglPeminjaman: '2024-02-10', tglPengembalian: '', namaPeminjaman: 'Lab PPLG', jumlah: 1, jenisPeminjaman: 'Ruangan', keterangan: 'Peminjaman untuk keperluan rapat', namaPeminjam: 'John Doe', status: 'belum dikembalikan' },
        { id: 2, tglPeminjaman: '2024-02-12', tglPengembalian: '2024-02-17', namaPeminjaman: 'Sapu', jumlah: 1, jenisPeminjaman: 'Barang', keterangan: 'Peminjaman untuk membersihkan kelas', namaPeminjam: 'Jane Doe', status: 'sudah dikembalikan' },
        // Data peminjaman lainnya...
    ]);

    // State untuk nilai pencarian
    const [searchTerm, setSearchTerm] = useState('');

    // Objek navigasi
    const navigate = useNavigate();

    // Fungsi untuk menangani tombol "Yes"
    const handleYes = (id) => {
        const updatedPeminjaman = peminjaman.map(item => {
            if (item.id === id) {
                return { ...item, keterangan: 'Yes', status: 'sudah dikembalikan' };
            }
            return item;
        });
        setPeminjaman(updatedPeminjaman);
        Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'You clicked Yes!',
        });
    };

    // Fungsi untuk menangani tombol "No"
    const handleNo = (id) => {
        const updatedPeminjaman = peminjaman.map(item => {
            if (item.id === id) {
                return { ...item, keterangan: 'No', status: 'belum dikembalikan' };
            }
            return item;
        });
        setPeminjaman(updatedPeminjaman);
        Swal.fire({
            icon: 'error',
            title: 'Cancelled',
            text: 'You clicked No!',
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
                // Logout jika pengguna mengonfirmasi
                Cookies.remove('token'); // Hapus token
                navigate('/'); // Arahkan ke halaman login
                // Tampilkan pesan toast berhasil logout
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

    // Fungsi untuk mengubah nilai pencarian
    const handleChangeSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    // Fungsi untuk melakukan pencarian
    const searchPeminjaman = peminjaman.filter((item) => {
        return item.namaPeminjaman.toLowerCase().includes(searchTerm.toLowerCase());
    });

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
                                    value={searchTerm}
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
                <div className="mt-8 overflow-x-auto">
                    <div className="max-w-full overflow-x-auto">
                        <table className="border-collapse border rounded-lg shadow-lg">
                            <thead>
                                <tr>
                                    <th className="border px-4 py-2 text-black text-center" style={{ borderColor: 'black', color: 'black' }}>No</th>
                                    <th className="border px-4 py-2 text-black text-center" style={{ borderColor: 'black', color: 'black' }}>Tgl Peminjaman</th>
                                    <th className="border px-4 py-2 text-black text-center" style={{ borderColor: 'black', color: 'black' }}>Tgl Pengembalian</th>
                                    <th className="border px-4 py-2 text-black text-center" style={{ borderColor: 'black', color: 'black' }}>Nama Peminjaman</th>
                                    <th className="border px-4 py-2 text-black text-center" style={{ borderColor: 'black', color: 'black' }}>Jumlah</th>
                                    <th className="border px-4 py-2 text-black text-center" style={{ borderColor: 'black', color: 'black' }}>Jenis Peminjaman</th>
                                    <th className="border px-4 py-2 text-black text-center" style={{ borderColor: 'black', color: 'black' }}>Keterangan</th>
                                    <th className="border px-4 py-2 text-black text-center" style={{ borderColor: 'black', color: 'black' }}>Nama Peminjam</th>
                                    <th className="border px-4 py-2 text-black text-center" style={{ borderColor: 'black', color: 'black' }}>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {searchPeminjaman.map((item, index) => (
                                    <tr key={item.id}>
                                        <td className="border px-4 py-2 text-black text-center" style={{ borderColor: 'black', color: 'black' }}>{index + 1}</td>
                                        <td className="border px-4 py-2 text-black text-center" style={{ borderColor: 'black', color: 'black' }}>{item.tglPeminjaman}</td>
                                        <td className="border px-4 py-2 text-black text-center" style={{ borderColor: 'black', color: 'black' }}>{item.tglPengembalian}</td>
                                        <td className="border px-4 py-2 text-black text-center" style={{ borderColor: 'black', color: 'black' }}>{item.namaPeminjaman}</td>
                                        <td className="border px-4 py-2 text-black text-center" style={{ borderColor: 'black', color: 'black' }}>{item.jumlah}</td>
                                        <td className="border px-4 py-2 text-black text-center" style={{ borderColor: 'black', color: 'black' }}>{item.jenisPeminjaman}</td>
                                        <td className="border px-4 py-2 text-black text-center" style={{ borderColor: 'black', color: 'black' }}>{item.keterangan}</td>
                                        <td className="border px-4 py-2 text-black text-center" style={{ borderColor: 'black', color: 'black' }}>{item.namaPeminjam}</td>
                                        <td className={`border px-4 py-2 text-center ${item.status === 'belum dikembalikan' ? 'text-red-500' : 'text-green-500'}`} style={{ borderColor: 'black' }}>{item.status}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LaporanSiswa;
