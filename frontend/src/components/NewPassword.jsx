import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import backgroundImage from "../background_login.jpeg";
import '../styles/custome.css';

const NewPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // Mengambil token dari state yang diteruskan dari VerifyOTP
  const token = location.state?.token;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setError('Kata sandi tidak cocok.');
      return;
    }

    try {
      const response = await fetch(`/v1/auth/reset-password/${token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          password: newPassword, 
          password_confirmation: confirmPassword 
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setSuccess(result.meta.message);
        setError('');
        navigate('/password-change-success');
      } else {
        setError(result.meta.error_messages.password?.[0] || 'Gagal mengatur ulang kata sandi.');
        setSuccess('');
      }
    } catch (err) {
      setError('Terjadi kesalahan, silakan coba lagi.');
      setSuccess('');
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
                <h4 className="Welcome-text">Buat Kata Sandi Baru!</h4>
                <h4 className="welcome-text-2">Masukan kata sandi baru untuk akun anda.</h4>
                <div className="field">
                  <label className="label">Kata Sandi Baru</label>
                  <div className="control">
                    <input
                      type="password"
                      className="input"
                      placeholder="********"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="field">
                  <label className="label">Konfirmasi Kata Sandi</label>
                  <div className="control">
                    <input
                      type="password"
                      className="input"
                      placeholder="********"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>
                {error && <p className="help-text has-text-danger">{error}</p>}
                {success && <p className="help-text has-text-success">{success}</p>}
                <div className="field mt">
                  <button className="button is-fullwidth button-login" type="submit">
                    Atur Ulang Kata Sandi
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

export default NewPassword;
