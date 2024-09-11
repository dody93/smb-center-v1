import React from 'react';
import backgroundImage from '../background_login.jpeg';
import Logo from '../ceklist-removebg-preview.png';
import '../styles/custome.css';

const PasswordChangeSuccess = () => {
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
              <div className="box">
                <div className="has-text-centered">
                  <img src={Logo} alt="Logo" style={{ width: '150px', marginBottom: '20px' }} />
                </div>
                <h4 className="Welcome-text text-centered">Perubahan Kata Sandi Berhasil!</h4>
                <p className="welcome-text-2 text-centered">
                  Kata sandi anda telah berhasil diubah. Silahkan masuk <br/>menggunakan kata sandi baru anda.
                </p>
                <div className="field mt">
                  <a href="/" className="button is-fullwidth button-login">Masuk Sekarang</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PasswordChangeSuccess;
