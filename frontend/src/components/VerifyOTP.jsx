import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import backgroundImage from "../background_login.jpeg";
import '../styles/custome.css';

const VerifyOTP = () => {
  const [otp, setOtp] = useState(new Array(6).fill(''));
  const [timer, setTimer] = useState(60);
  const [error, setError] = useState('');
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const location = useLocation(); // Mengambil state dari navigasi
  
  // Mengambil token dari state yang diteruskan dari ForgotPassword
  const token = location.state?.token; // Pastikan token tersedia

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer(timer - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (/[^0-9]/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value !== '' && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && index > 0 && otp[index] === '') {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    const otpValue = otp.join('');

    if (!token) {
      setError('Token tidak ditemukan. Silakan coba lagi.');
      return;
    }

    try {
      console.log('Token:', token); // Log token
      const response = await fetch(`/v1/auth/forgot-password/verify/${token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ otp: otpValue }), // Kirim OTP sebagai objek
      });

      if (!response.ok) {
        const result = await response.json();
        setError(result.meta.message || 'Kode OTP tidak valid, silakan coba lagi.');
        return;
      }

      // Navigasi ke halaman NewPassword setelah OTP berhasil diverifikasi
      navigate('/new-password', { state: { token } }); // Kirim token ke NewPassword
    } catch (err) {
      setError('Terjadi kesalahan, silakan coba lagi.');
    }
  };

  return (
    <section
      className="hero is-fullheight is-fullwidth"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="hero-body">
        <div className="container">
          <div className="columns is-centered">
            <div className="column is-4">
              <form className="box" onSubmit={handleVerify}>
                <h4 className="Welcome-text">Masukan Kode OTP</h4>
                <p className="welcome-text-2">Periksa email anda dan masukan kode yang di terima</p>
                <div className="field">
                  <div className="control" style={{ display: 'flex', justifyContent: 'space-between' }}>
                    {otp.map((data, index) => (
                      <input
                        key={index}
                        type="text"
                        className="input"
                        value={data}
                        onChange={(e) => handleChange(e, index)}
                        onKeyDown={(e) => handleKeyDown(e, index)}
                        maxLength="1"
                        ref={(el) => (inputRefs.current[index] = el)}
                        style={{ width: '3rem', textAlign: 'center' }}
                      />
                    ))}
                  </div>
                </div>
                {error && <p className="help is-danger">{error}</p>}
                <div className="has-text-centered">
                  <p className="help-text">Belum menerima kode OTP? Tunggu <span style={{ color: 'brown' }}>{timer} detik</span></p>
                </div>
                <div className="field mt">
                  <button className="button is-fullwidth button-login" type="submit">
                    Verifikasi Kode
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VerifyOTP;
