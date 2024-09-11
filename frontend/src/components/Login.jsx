import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import backgroundImage from "../background_login.jpeg";
import Logo from "../Logo.png";
import '../styles/custome.css';
import "bulma/css/bulma.css";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    setLoading(true);
    setError('');
  
    try {
      // Kirim permintaan login
      const loginResponse = await axios.post('/v1/auth/token', { email, password });
  
      if (loginResponse.status === 200) {
        const token = loginResponse.data.data.token;
        localStorage.setItem('accessToken', token);

        // Setelah login berhasil, ambil data sektor bisnis
        const sectorsResponse = await axios.get('/v1/my-info/business-sectors', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (sectorsResponse.status === 200) {
          const businessSectors = sectorsResponse.data.data;

          // Arahkan pengguna ke halaman BusinessSectorSelection dengan data sektor bisnis
          navigate('/business-sector-selection', { state: { businessSectors } });
        }
      }
    } catch (error) {
      if (error.response) {
        const { status } = error.response;
  
        switch (status) {
          case 401:
            setError('Email atau kata sandi tidak valid.');
            break;
          case 403:
            setError('Pengguna sudah terautentikasi.');
            break;
          case 422:
            setError('Terjadi kesalahan validasi.');
            break;
          default:
            setError('Terjadi kesalahan, silahkan coba lagi.');
            break;
        }
      } else {
        setError('Tidak dapat menghubungi server.');
      }
    } finally {
      setLoading(false);
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
              <form className='box' onSubmit={handleSubmit}>
                <div className="has-text-centered">
                  <img src={Logo} alt="Logo" style={{ width: '150px', marginBottom: '20px' }} />
                </div>
                <h4 className='Welcome-text'>Selamat Datang!</h4>
                <h4 className='welcome-text-2'>Silahkan masuk untuk melanjutkan.</h4>
                <div className="field">
                  <label className="label">Email</label>
                  <div className="control">
                    <input
                      type="text"
                      className="input"
                      placeholder='karyawan@gmail.com'
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="field">
                  <label className="label">Kata Sandi</label>
                  <div className="control">
                    <input
                      type="password"
                      className="input"
                      placeholder='********'
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="field checkbox-remember">
                  <label className="checkbox">
                    <input type="checkbox" />
                    <span className="checkbox-label"> Ingat Saya</span>
                  </label>
                </div>
                <div className="field mt">
                  <button className="button is-fullwidth button-login" type="submit" disabled={loading}>
                    {loading ? 'Memuat...' : 'Masuk'}
                  </button>
                </div>
                {error && <p className="help-text has-text-danger">{error}</p>}
                <p className="help-text">Lupa kata sandi anda? Jangan khawatir, kami siap membantu anda.</p>
                <a href="/forgot-password" className="reset-link">Atur Ulang Kata Sandi</a>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Login;
