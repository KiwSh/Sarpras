import React, { useState, useEffect } from "react";
import { FaSignOutAlt } from 'react-icons/fa';
import axios from "axios";
import Cookies from "js-cookie";
import Sidebar from "../../components/Sidebar";
import BoxRuangan from "../../pages/BoxRuangan";
import BoxBarang from "../../pages/BoxBarang";
import BoxPeminjaman from "../../pages/BoxPeminjaman";
import Swal from 'sweetalert2';
import { useNavigate } from "react-router-dom";
import { PieChart, Pie, ResponsiveContainer, Cell } from 'recharts';
import { ToastContainer, toast } from 'react-toastify'; // Import toast and ToastContainer
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS for react-toastify
import { startTransition } from 'react';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [countBarang, setCountBarang] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = Cookies.get("token");
  const [networkStatus, setNetworkStatus] = useState(navigator.onLine); // Status jaringan
  const isAuthenticated = token !== undefined; // Memeriksa apakah pengguna sudah terotentikasi

  const fetchData = async () => {
    try {
      const response = await axios.get("/api/data_barangs/count-data");
      setCountBarang(response.data.countBarang);
    } catch (error) {
      setError("Error fetching data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const handleNetworkChange = () => {
      setNetworkStatus(navigator.onLine); // Update status jaringan
      if (navigator.onLine && !loading) { // Hanya munculkan notifikasi jika tidak dalam proses loading
        toast.success('Jaringan tersambung', { position: 'top-center' });
      } else if (!navigator.onLine && !loading) { // Hanya munculkan notifikasi jika tidak dalam proses loading
        toast.error('Jaringan tidak terhubung', { position: 'top-center' });
      }
    };
    window.addEventListener("online", handleNetworkChange); // Event listener ketika kembali online
    window.addEventListener("offline", handleNetworkChange); // Event listener ketika kehilangan koneksi
    return () => {
      window.removeEventListener("online", handleNetworkChange); // Membersihkan event listener saat komponen tidak lagi digunakan
      window.removeEventListener("offline", handleNetworkChange);
    };
  }, [loading]); // Menambahkan loading sebagai dependency

  const handleLogout = async () => {
    try {
      await startTransition(() => {
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
            Cookies.remove("token");
            navigate("/");
            Swal.fire(
              'Logout Berhasil!',
              'Anda telah berhasil logout.',
              'success'
            );
          }
        });
      });
    } catch (error) {
      console.error('Error during logout:', error);
      // Handle error
    }
  };
  
  

  const chartData = [
    { name: 'Ruangan', value: 20 },
    { name: 'Barang', value: 30 },
    { name: 'Peminjaman', value: 10 },
  ];

  const COLORS = ['#FF5733', '#3498DB', '#58D68D']; // warna untuk setiap bagian diagram

  return (
    <div className="flex bg-[#F5F5F5]">
      <Sidebar />
      <div className="flex flex-col flex-1" style={{ backgroundColor: '#F3F4F6' }}>
        <nav className="bg-[#C0C0C0] p-4">
          <div className="flex justify-between items-center">
            <h1 className="text-black font-bold text-2xl ml-[10px]">Home</h1>
            <button onClick={handleLogout} className="bg-[#b23b3b] hover:bg-red-600 text-white py-2 px-4 rounded-md flex items-center">
              <FaSignOutAlt className="mr-2" />
              <span>Logout</span>
            </button>
          </div>
        </nav>
        <ToastContainer />
        <br></br>
        <div className="p-8 ml-8 mr-8">
          <div className="text-2xl mb-5 border-b-2 pb-3 text-black rounded" style={{ position: 'relative', top: '-20px' }}>
            <center><h2 className="text-4xl font-bold">SELAMAT DATANG DI SARPRAS SKANIC</h2></center>
            <h5 className="text-xs text-center" style={{ lineHeight: '1.5' }}>
              Aplikasi sarana & prasarana sekolah dibuat untuk mempermudah peminjaman<br />barang/alat disekolah
            </h5>
          </div>
          <div className="bg-[#3D3B40] p-8 rounded-md mt-5" style={{ marginTop: '-40px' }}> {/* Tambahkan style marginTop */}
            <div className="flex flex-wrap justify-center">
              <div className="w-5 md:w-1/3">
                <BoxRuangan />
              </div>
              <div className="w-5 md:w-1/3">
                <BoxBarang countBarang={countBarang} />
              </div>
              <div className="w-5 md:w-1/3">
                <BoxPeminjaman />
              </div>
            </div>
            <div className="chart-container mt-8">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    animationBegin={0}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
