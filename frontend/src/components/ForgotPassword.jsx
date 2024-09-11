import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import backgroundImage from "../background_login.jpeg";
import '../styles/custome.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch('/v1/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage(result.meta.message);
        setError('');
        // Navigasi ke halaman VerifyOTP dengan token
        navigate('/verify-otp', { state: { token: result.data.token } });
      } else {
        setError(result.meta.message || 'Terjadi kesalahan, silakan coba lagi.');
        setMessage('');
      }
    } catch (err) {
      setError('Terjadi kesalahan, silakan coba lagi.');
      setMessage('');
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
              <form className="box" onSubmit={handleSubmit}>
                <h4 className="welcome-text">Lupa Kata Sandi?</h4>
                <h4 className="welcome-text-2">Masukan email Anda untuk mendapatkan kode OTP.</h4>
                <div className="field">
                  <label className="label">Email</label>
                  <div className="control">
                    <input 
                      type="email" 
                      className="input" 
                      placeholder="karyawan@gmail.com" 
                      aria-label="Email" 
                      required 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                    />
                  </div>
                </div>
                {message && <p className="help is-success">{message}</p>}
                {error && <p className="help is-danger">{error}</p>}
                <div className="field mt">
                  <button className="button is-fullwidth button-login" type="submit">Kirim OTP</button>
                </div>
                <a href="/" className="reset-link">Kembali Masuk</a>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ForgotPassword;
