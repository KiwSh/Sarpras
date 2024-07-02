//import react
import React, { lazy, Suspense } from 'react';

//import react router dom
import { Routes, Route } from "react-router-dom";

//import loader component
const Loader = lazy(() => import('../components/Loader.jsx'));

//import view Login
const Login = lazy(() => import('../views/Auth/Login.jsx'));

//import view Barang
import DataBarang from "../pages/DataBarang.jsx"
//import view Ruangan
import DataRuangan from "../pages/DataRuangan.jsx"
//import view Peminjaman
import DataPeminjaman from "../pages/DataPeminjaman.jsx"
//import view User
import DataUser from "../pages/DataUser.jsx"

//import view WajibBaca!
import Readme from "../views/Auth/Readme.jsx"
//import view Help?
import Help from "../views/Auth/Help.jsx"

//import view admin
import TambahUser from "../pages/TambahUser.jsx"
//import view EditPeminjaman
// import EditPeminjaman from "../pages/EditPeminjaman.jsx"
//import view EditUser
// import EditUser from "../pages/EditUser.jsx"

//import View User
import BarangSiswa from '../pages/BarangSiswa';
import RuanganSiswa from '../pages/RuanganSiswa.jsx';
import LaporanSiswa from  '../pages/LaporanSiswa.jsx';


/// Import your components
import AdminDashboard from "../views/Dashboard/AdminDashboard.jsx";
import UserDashboard from "../views/Dashboard/UserDashboard.jsx";


// Define your routes
export default function RoutesIndex() {
  return (
    <Routes>
      {/* route "/" */}
      <Route
        path="/"
        element={
          <Suspense fallback={<Loader />}>
            <Login />
          </Suspense>
        }
      />
      <Route path="/UserDashboard" element={<UserDashboard />} />
       <Route path="/AdminDashboard" element={<AdminDashboard />} />
       <Route path="/DataBarang" element={<DataBarang />} />
       <Route path="/DataRuangan" element={<DataRuangan />} />
       <Route path="/DataPeminjaman" element={<DataPeminjaman />} />
       <Route path="/DataUser" element={<DataUser />} />
       <Route path="/Readme" element={<Readme />} />
       <Route path="/Help" element={<Help />} />
       <Route path='/TambahUser' element={<TambahUser/>} />
       {/* <Route path='/EditPeminjaman' element={<EditPeminjaman/>} /> */}
       {/* <Route path='/EditUser' element={<EditUser/>} /> */}
       <Route path='/BarangSiswa' element={<BarangSiswa/>} />
       <Route path='/RuanganSiswa' element={<RuanganSiswa/>} />
       <Route path='/LaporanSiswa' element={<LaporanSiswa/>} />
    </Routes>
  );
}