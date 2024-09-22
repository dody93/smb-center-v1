import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const AbsenList = () => {
  const [absenData, setAbsenData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAbsenData = async () => {
      try {
        const response = await fetch('/v1/tmp/absen/raw', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (Array.isArray(result)) {
          setAbsenData(result);
        } else {
          setError('Unexpected absensi response format');
        }
      } catch (error) {
        console.error('Error fetching absensi data:', error);
        setError('Error fetching absensi data');
      } finally {
        setLoading(false);
      }
    };

    fetchAbsenData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="row">
      <div className="col-xl-12">
        <div className="card custom-card">
          <div className="card-header">
            <div className="card-title">
              Data Absensi
            </div>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              <table id="absen-table" className="table table-bordered text-nowrap w-100">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>User ULID</th>
                    <th>Tanggal</th>
                    <th>Waktu</th>
                    <th>Tipe</th>
                    <th>Catatan</th>
                  </tr>
                </thead>
                <tbody>
                  {absenData.length > 0 ? (
                    absenData.map((absen) => (
                      <tr key={absen.id}>
                        <td>{absen.id}</td>
                        <td>{absen.user_ulid}</td>
                        <td>{absen.tanggal}</td>
                        <td>{absen.waktu}</td>
                        <td>{absen.tipe}</td>
                        <td>{absen.catatan || 'Tidak ada catatan'}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6">No absensi data available</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AbsenList;
