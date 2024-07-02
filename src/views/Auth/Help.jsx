import React from 'react';
import whatsappLogo from "../../assets/images/whatsapp.png";

const Help = () => {
  const handleWhatsAppClick = () => {
    const phoneNumber = '+6281584903592'; // Nomor telepon admin
    const message = encodeURIComponent('Halo, saya mengalami masalah saat login ke akun Sarpras. Bisakah Anda membantu saya?'); // Pesan yang akan dikirim
    
    // URL untuk membuka WhatsApp dengan nomor telepon dan pesan yang sudah terisi
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    
    // Buka WhatsApp di tab baru
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="bg-black p-8 rounded-lg shadow-md">
        <p className="text-lg text-white font-semibold my-4">Saya tidak bisa login?</p>
        <hr className="my-4 border-t border-white" />
        <p className="mb-4 text-white">Jika mengalami masalah saat login ke akun Sarpras,</p>
        <p className="mb-4 text-white">anda bisa menghubungi kontak admin yang nomer nya sudah tertera di bawah ini</p>
        <div className="flex items-center mb-4 text-white" onClick={handleWhatsAppClick} style={{cursor: 'pointer'}}>
          <img src={whatsappLogo} alt="WhatsApp Logo" className="mr-2 h-6 w-6" />
          <p>Kontak Admin: +62 815-8490-3592</p>
        </div>
        <button className="bg-white hover:bg-blue-700 text-black py-2 px-4 rounded focus:outline-none focus:shadow-outline" onClick={() => window.history.back()}>Kembali ke Halaman Login</button>
      </div>
    </div>
  );
};

export default Help;
