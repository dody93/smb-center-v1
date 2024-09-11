import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import backgroundImage from '../background_login.jpeg';
import Logo1 from '../svurga.png'; // Logo untuk sektor bisnis dengan id 2
import Logo2 from '../k6h.png'; // Logo untuk sektor bisnis dengan id 1
import '../styles/custome.css';

const BusinessSectorSelection = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedSector, setSelectedSector] = useState(null);

  // Proteksi halaman, arahkan ke login jika tidak ada token
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    console.log('Token in BusinessSectorSelection:', token);
    if (!token) {
      navigate('/');
    }
  }, [navigate]);

  // Ambil data sektor bisnis dari state yang dikirim saat navigasi dari halaman login
  const businessSectors = location.state?.businessSectors || [];

  const handleSelectSector = (sectorId) => {
    setSelectedSector(sectorId);
  };

  const handleProceed = () => {
    if (selectedSector) {
      console.log("Sektor bisnis yang dipilih:", selectedSector);
      // Arahkan ke halaman berikutnya atau lakukan tindakan yang sesuai
      navigate('/dashboard', { state: { selectedSector } });
    }
  };

  const getLogoBySectorId = (id) => {
    switch (id) {
      case 1:
        return Logo2; // Logo untuk sektor bisnis dengan id 1
      case 2:
        return Logo1; // Logo untuk sektor bisnis dengan id 2
      default:
        return null;
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
              <div className="box">
                <h4 className="welcome-text">Pilih Sektor Bisnis!</h4>
                <h4 className="welcome-text-2">Silahkan pilih sektor bisnis yang ingin digunakan.</h4>
                <div className="columns is-centered mt-5">
                  {businessSectors.map((sector) => (
                    <div className="column is-5" key={sector.id}>
                      <div
                        className={`card ${selectedSector === sector.id ? 'is-selected' : ''}`}
                        onClick={() => handleSelectSector(sector.id)}
                        style={{
                          border: selectedSector === sector.id ? '2px solid #4A90E2' : '2px solid transparent',
                          padding: '10px',
                          cursor: 'pointer',
                        }}
                      >
                        <div className="card-content has-text-centered">
                          <img src={getLogoBySectorId(sector.id)} alt={sector.name} style={{ width: '100%' }} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="field mt">
                  <button
                    className="button is-fullwidth button-login"
                    disabled={!selectedSector}
                    onClick={handleProceed}
                    style={{ backgroundColor: '#4A3F35', color: '#FFFFFF' }}
                  >
                    Pilih Sektor Bisnis
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BusinessSectorSelection;
