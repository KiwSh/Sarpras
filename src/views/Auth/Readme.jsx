import React from 'react';
import whatsappLogo from "../../assets/images/whatsapp.png";

const Readme = () => {
  const handleWhatsAppClick = () => {
    const phoneNumber = '+6281584903592'; // Nomor telepon admin
    const message = encodeURIComponent('Halo, saya butuh bantuan terkait akses ke web, saya adalah perwakilan dari kelas (ISI NAMA KELAS KALIAN)'); // Pesan yang akan dikirim
    
    // URL untuk membuka WhatsApp dengan nomor telepon dan pesan yang sudah terisi
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    
    // Buka WhatsApp di tab baru
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="bg-black p-8 rounded-lg shadow-md">
        <p className="text-lg text-white font-semibold my-4">Wajib Baca!!!</p>
        <hr style={{ marginTop: '5px', marginBottom: '20px', textAlign: 'center' }} />
        <p className="mb-4 text-white">Web ini hanya bisa diakses seizin admin dan</p>
        <p className="mb-4 text-white">admin hanya memberi izin perwakilan kelas. 1 kelas mendapatkan 1 akun</p>
        <div className="flex items-center mb-4 text-white" onClick={handleWhatsAppClick} style={{cursor: 'pointer'}}>
          <img src={whatsappLogo} alt="WhatsApp Logo" className="mr-2 h-6 w-6" />
          <p>Kontak Admin: +62 815-8490-3592</p>
        </div>
        <button className="bg-white hover:bg-blue-700 text-black py-2 px-4 rounded focus:outline-none focus:shadow-outline" onClick={() => window.history.back()}>Kembali ke Halaman Login</button>
      </div>
    </div>
  );
};

export default Readme;
