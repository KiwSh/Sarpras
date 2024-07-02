import React from "react";
import SidebarSiswa from "../../components/SidebarSiswa";
import Swal from 'sweetalert2';
import { useNavigate } from "react-router-dom";
import { FaSignOutAlt, FaBox, FaDoorOpen } from 'react-icons/fa';
import 'react-toastify/dist/ReactToastify.css'; 
import { toast } from 'react-toastify'; 
import backgroundImage from "../../assets/images/sarpras2.png"; // Import the background image

export default function UserDashboard() {
  const navigate = useNavigate();
  
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
        navigate("/");
        Swal.fire(
          'Logout Berhasil!',
          'Anda telah berhasil logout.',
          'success'
        );
      }
    });
  };

  const handleNavigateToPeminjamanBarang = () => {
    navigate("/BarangSiswa");
  };

  const handleNavigateToPeminjamanRuangan = () => {
    navigate("/RuanganSiswa");
  };

  return (
    <div className="relative flex bg-white min-h-screen">
      <SidebarSiswa />
      <div className="flex-1 p-8 relative">
        <div className="absolute inset-0 z-0">
          <img src={backgroundImage} alt="Background" className="w-full h-full object-cover opacity-50" />
        </div>
        <div className="relative z-10">
          <div className="text-2xl font-bold mb-5 bg-gray-300 border-b-2 pb-5 text-black p-2 rounded">
            <center>SELAMAT DATANG DI SARPRAS SKANIC</center>
            <div className="text-left">
              <h1 className="text-sm" style={{ textAlign: 'center' }}>
                Aplikasi sarana & prasarana sekolah dibuat untuk mempermudah peminjaman barang/alat disekolah
              </h1>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center mt-16">
            <div 
              className="text-center mb-4 bg-blue-500 text-white mx-auto rounded-md p-4 cursor-pointer hover:bg-blue-600 transition duration-300" 
              style={{ maxWidth: '300px' }}
              onClick={handleNavigateToPeminjamanBarang}
            >
              <FaBox className="text-4xl mx-auto mb-2" /> {/* Icon for items */}
              <h2 className="text-lg font-semibold">Total Barang yang Bisa Dipinjam</h2>
              <p className="text-2xl font-bold">25</p> {/* Replace with actual count */}
            </div>
            <div 
              className="text-center mt-8 bg-green-500 text-white mx-auto rounded-md p-4 cursor-pointer hover:bg-green-600 transition duration-300" 
              style={{ maxWidth: '300px' }}
              onClick={handleNavigateToPeminjamanRuangan}
            >
              <FaDoorOpen className="text-4xl mx-auto mb-2" /> {/* Icon for rooms */}
              <h2 className="text-lg font-semibold">Total Ruangan yang Bisa Dipinjam</h2>
              <p className="text-2xl font-bold">10</p> {/* Replace with actual count */}
            </div>
          </div>
          <div className="absolute top-0 right-0 mt-[25px] mr-[15px] z-50">
            <button onClick={handleLogout} className="bg-[#b23b3b] hover:bg-red-500 text-white py-2 px-4 rounded-md flex items-center transition duration-300">
              <span>Logout</span>
              <FaSignOutAlt className="ml-2" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
