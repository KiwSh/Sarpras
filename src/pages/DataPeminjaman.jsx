import React, { useState, useEffect } from 'react';
import { FaSearch, FaSignOutAlt, FaCheck } from 'react-icons/fa';
import Sidebar from '../components/Sidebar';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import * as XLSX from 'xlsx';
import axios from 'axios';

const DataPeminjaman = () => {
    const [peminjaman, setPeminjaman] = useState([]);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [searchResult, setSearchResult] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10); // Number of items per page
    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get('/api/data_peminjaman/show'); // Menggunakan endpoint '/api/data_peminjaman'
            const data = response.data;
            setPeminjaman(data);
        } catch (error) {
            console.error("Error fetching peminjaman data:", error);
        }
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
            }
        });
    };

    const handleChangeSearch = (e) => {
        const keyword = e.target.value.toLowerCase();
        setSearchKeyword(keyword);

        const filteredData = peminjaman.filter(item => (
            item.namaPeminjam.toLowerCase().includes(keyword) ||
            item.namaPeminjaman.toLowerCase().includes(keyword) ||
            item.keterangan.toLowerCase().includes(keyword) ||
            item.statusPengembalian.toLowerCase().includes(keyword) ||
            item.jenisPeminjaman.toLowerCase().includes(keyword)
        ));

        setSearchResult(filteredData);
        setCurrentPage(1); // Reset to first page on search
    };

    const exportToExcel = () => {
        const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
        const fileExtension = '.xlsx';
        const fileName = 'data_peminjaman';

        const dataToRender = searchKeyword ? searchResult : peminjaman;

        const ws = XLSX.utils.aoa_to_sheet([
            ["No", "Tgl Peminjaman", "Tgl Pengembalian", "Nama Peminjam", "Nama Peminjaman", "Jumlah", "Jenis Peminjaman", "Keterangan", "Status Pengembalian", "Aksi"],
            ...dataToRender.map(item => [item.id, item.tglPeminjaman, item.tglPengembalian, item.namaPeminjam, item.namaPeminjaman, item.jumlah, item.jenisPeminjaman, item.keterangan, item.statusPengembalian])
        ]);

        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Data Peminjaman');

        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

        const data = new Blob([excelBuffer], { type: fileType });

        const url = window.URL.createObjectURL(data);

        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = fileName + fileExtension;
        anchor.click();
    };

    const handleKembalikan = (id) => {
        Swal.fire({
            title: 'Konfirmasi Pengembalian',
            text: 'Apakah barang sudah dikembalikan?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ya',
            cancelButtonText: 'Belum',
        }).then(async (result) => {
            if (result.isConfirmed) {
                const newDate = new Date();
                const formattedDate = `${newDate.getFullYear()}-${newDate.getMonth() + 1}-${newDate.getDate()}`;
                const updatedItem = { statusPengembalian: 'Sudah Dikembalikan', tglPengembalian: formattedDate };

                try {
                    const updatedData = await updatePeminjaman(id, updatedItem);
                    setPeminjaman(prevPeminjaman =>
                        prevPeminjaman.map(item => item.id === id ? updatedData : item)
                    );
                } catch (error) {
                    console.error("Error updating peminjaman data:", error);
                }
            }
        });
    };

    const filterByDate = (startDate, endDate) => {
        const filteredData = peminjaman.filter(item => {
            const tanggalPeminjaman = new Date(item.tglPeminjaman);
            const tanggalPengembalian = item.tglPengembalian ? new Date(item.tglPengembalian) : null;

            return (
                (tanggalPeminjaman >= new Date(startDate) && tanggalPeminjaman <= new Date(endDate)) ||
                (tanggalPengembalian && tanggalPengembalian >= new Date(startDate) && tanggalPengembalian <= new Date(endDate))
            );
        });
        setSearchResult(filteredData);
        setCurrentPage(1); // Reset to first page on filter
    };

    const handleFilterByDate = () => {
        const startDate = document.getElementById('startDate').value;
        const endDate = document.getElementById('endDate').value;
        filterByDate(startDate, endDate);
    };

    // Get current items
    const dataToRender = searchKeyword ? searchResult : peminjaman;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = dataToRender.slice(indexOfFirstItem, indexOfLastItem);

    // Change page
    const paginate = pageNumber => setCurrentPage(pageNumber);

    return (
        <div className="flex flex-col md:flex-row">
            <Sidebar />
            <div className="flex-1 p-4">
                <div className="bg-[#C0C0C0] rounded-lg shadow-md p-4 relative">
                    <h1 className="text-xl font-semibold mb-4">Data Peminjaman</h1>
                    <div className="flex items-center space-x-4">
                        <div className="relative flex items-center">
                            <div className="bg-white flex items-center rounded-md shadow-md px-3 border border-black">
                                <FaSearch className="text-black-400" />
                                <input type="text" placeholder="Search..." className="outline-none px-2 py-1 w-64" onChange={handleChangeSearch} />
                            </div>
                        </div>
                        <div>
                            <button onClick={handleLogout} className="bg-[#b23b3b] hover:bg-red-600 text-white py-2 px-4 rounded-md flex items-center">
                                <span>Logout</span>
                                <FaSignOutAlt className="ml-2" />
                            </button>
                        </div>
                    </div>
                </div>
                <div className="mt-8 max-w-full overflow-x-auto">
                    <div className="flex space-x-4">
                        <input type="date" id="startDate" className="border px-4 py-2 text-black" />
                        <input type="date" id="endDate" className="border px-4 py-2 text-black" />
                        <button onClick={handleFilterByDate} className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-md">
                            Filter by Date
                        </button>
                    </div>
                    <div className='flex overflow-x-auto'>
                        <table className="w-full border-collapse border rounded-lg shadow-lg mt-4 print-table">
                            <thead>
                                <tr>
                                    <th className="border px-4 py-2 text-black text-center bg-gray-300" style={{ borderColor: 'black', color: 'black' }}>No</th>
                                    <th className="border px-4 py-2 text-black text-center bg-gray-300" style={{ borderColor: 'black', color: 'black' }}>Tgl Peminjaman</th>
                                    <th className="border px-4 py-2 text-black text-center bg-gray-300" style={{ borderColor: 'black', color: 'black' }}>Tgl Pengembalian</th>
                                    <th className="border px-4 py-2 text-black text-center bg-gray-300" style={{ borderColor: 'black', color: 'black' }}>Nama Peminjam</th>
                                    <th className="border px-4 py-2 text-black text-center bg-gray-300" style={{ borderColor: 'black', color: 'black' }}>Nama Peminjaman</th>
                                    <th className="border px-4 py-2 text-black text-center bg-gray-300" style={{ borderColor: 'black', color: 'black' }}>Jumlah</th>
                                    <th className="border px-4 py-2 text-black text-center bg-gray-300" style={{ borderColor: 'black', color: 'black' }}>Jenis Peminjaman</th>
                                    <th className="border px-4 py-2 text-black text-center bg-gray-300" style={{ borderColor: 'black', color: 'black' }}>Keterangan</th>
                                    <th className="border px-4 py-2 text-black text-center bg-gray-300" style={{ borderColor: 'black', color: 'black' }}>Status Pengembalian</th>
                                    <th className="border px-4 py-2 text-black text-center bg-gray-300" style={{ borderColor: 'black', color: 'black' }}>Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentItems.map((item, index) => (
                                    <tr key={item.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-300"}>
                                        <td className="border px-4 py-2 text-black text-center" style={{ borderColor: 'black', color: 'black' }}>{indexOfFirstItem + index + 1}</td>
                                        <td className="border px-4 py-2 text-black text-center" style={{ borderColor: 'black', color: 'black' }}>{item.tglPeminjaman}</td>
                                        <td className="border px-4 py-2 text-black text-center" style={{ borderColor: 'black', color: 'black' }}>{item.tglPengembalian}</td>
                                        <td className="border px-4 py-2 text-black text-center" style={{ borderColor: 'black', color: 'black' }}>{item.namaPeminjam}</td>
                                        <td className="border px-4 py-2 text-black text-center" style={{ borderColor: 'black', color: 'black' }}>{item.namaPeminjaman}</td>
                                        <td className="border px-4 py-2 text-black text-center" style={{ borderColor: 'black', color: 'black' }}>{item.jumlah}</td>
                                        <td className="border px-4 py-2 text-black text-center" style={{ borderColor: 'black', color: 'black' }}>{item.jenisPeminjaman}</td>
                                        <td className="border px-4 py-2 text-black text-center" style={{ borderColor: 'black', color: 'black' }}>{item.keterangan}</td>
                                        <td className={`border border-black px-4 py-2 text-center ${item.statusPengembalian === 'Belum Dikembalikan' ? 'text-red-500' : 'text-green-500'}`}>{item.statusPengembalian}</td>
                                        <td className="border px-4 py-2 text-black text-center" style={{ borderColor: 'black', color: 'black' }}>
                                            {item.statusPengembalian === 'Belum Dikembalikan' ? (
                                                <button onClick={() => handleKembalikan(item.id)} className="bg-green-500 hover:bg-green-700 text-white py-1 px-2 rounded-md">
                                                    Kembalikan
                                                </button>
                                            ) : (
                                                <FaCheck className="text-green-500" />
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="flex items-center mt-4 space-x-4">
                        <button
                            onClick={exportToExcel}
                            className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-md"
                        >
                            Export to Excel
                        </button>
                        <button
                            onClick={() => window.print()}
                            className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-md"
                        >
                            Print
                        </button>
                        <button
                            onClick={fetchData}
                            className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-md"
                        >
                            Fetch Data
                        </button>
                    </div>
                    <div className="flex justify-center mt-4">
                        <nav>
                            <ul className="flex list-none space-x-2">
                                {Array.from({ length: Math.ceil(dataToRender.length / itemsPerPage) }).map((_, index) => (
                                    <li key={index}>
                                        <button
                                            onClick={() => paginate(index + 1)}
                                            className={`px-3 py-1 rounded-md ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'}`}
                                        >
                                            {index + 1}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DataPeminjaman;
