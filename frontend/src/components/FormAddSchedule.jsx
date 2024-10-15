import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';

const FormAddSchedule = () => {
  const [locations, setLocations] = useState([]);
  const [users, setUsers] = useState([]);
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [scheduleData, setScheduleData] = useState(null);
  const [shifts, setShifts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedUsers, setSelectedUsers] = useState({});

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await axios.get('/v1/select/location');
        setLocations(response.data);
      } catch (err) {
        setError('Gagal mengambil lokasi.');
      }
    };
    fetchLocations();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('/v1/select/user');
        setUsers(response.data); // Pastikan posisi_code juga ikut diambil
      } catch (err) {
        setError('Gagal mengambil daftar user.');
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchShifts = async () => {
      try {
        const response = await axios.get('/v1/jadwal-shift');
        setShifts(response.data);
      } catch (err) {
        setError('Gagal mengambil daftar shift.');
      }
    };
    fetchShifts();
  }, []);

  useEffect(() => {
    if (location && date) {
      setLoading(true);
      setError(null);

      const fetchSchedule = async () => {
        try {
          const response = await axios.get(`/v1/jadwal/${location}/${date}`);
          setScheduleData(response.data);

          const getUser = (userUlid) => {
            const user = users.find(u => u.ulid === userUlid);
            return {
              value: user.ulid,
              label: user.first_name, // Tampilkan hanya nama di input
              posisi_code: user.posisi_code // Sertakan posisi_code
            };
          };

          const updatedUsers = {};
          shifts.forEach(shift => {
            ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'].forEach(day => {
              updatedUsers[`${day}-${shift.slug}`] = response.data[`${day.toLowerCase()}_${shift.slug}`]?.map(userUlid => getUser(userUlid)) || [];
            });
          });
          setSelectedUsers(updatedUsers);

        } catch (err) {
          setError('Terjadi kesalahan saat mengambil data jadwal.');
        } finally {
          setLoading(false);
        }
      };
      fetchSchedule();
    }
  }, [location, date, users, shifts]);

  const handleAssignChange = (selectedOptions, { name }) => {
    const updatedSelection = selectedOptions?.map(option => ({
      value: option.value,
      label: option.label,
      posisi_code: option.posisi_code // Simpan posisi_code saat perubahan
    })) || [];

    setSelectedUsers(prevState => ({
      ...prevState,
      [name]: updatedSelection
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      start: date,
      location_ulid: location,
    };

    shifts.forEach(shift => {
      ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'].forEach(day => {
        payload[`${day.toLowerCase()}_${shift.slug}`] = selectedUsers[`${day}-${shift.slug}`]?.map(user => user.value) || [];
      });
    });

    try {
      const response = await axios.post(`/v1/jadwal/${location}/${date}`, payload);
      if (response.status === 200) {
        alert('Jadwal berhasil disimpan');
      } else {
        alert('Gagal menyimpan jadwal');
      }
    } catch (err) {
      console.error('Error:', err);
      alert('Terjadi kesalahan saat menyimpan jadwal');
    }
  };

  const userOptions = users.map(user => ({
    value: user.ulid,
    label: `${user.first_name} ${user.last_name || ''}`, // Tampilkan nama dan email di dropdown
    posisi_code: user.posisi_code // Sertakan posisi_code untuk styling
  }));

  // Custom styles for react-select based on posisi_code
  const customStyles = {
    multiValue: (styles, { data }) => {
      let backgroundColor;
      switch (data.posisi_code) {
        case 'FT':
          backgroundColor = '#23B7E5'; // Biru untuk FT
          break;
        case 'PT':
          backgroundColor = '#8CC63F'; // Hijau untuk PT
          break;
        case 'HB':
          backgroundColor = '#F3A712'; // Orange untuk HB
          break;
        case 'DIR':
          backgroundColor = '#ff4507'; // Kuning untuk DIR
          break;
        default:
          backgroundColor = '#6c757d'; // Warna default (abu-abu)
      }
      return {
        ...styles,
        backgroundColor,
        color: 'white' // Warna teks putih untuk kontras
      };
    },
    multiValueLabel: (styles) => ({
      ...styles,
      color: 'white' // Teks tetap putih
    }),
    multiValueRemove: (styles) => ({
      ...styles,
      color: 'white',
      ':hover': {
        backgroundColor: '#0056b3',
        color: 'white'
      }
    })
  };

  return (
    <div>
      <div className="card custom-card">
        <div className="card-header justify-content-between">
          <div className="card-title">Assign Jadwal</div>
          <div className="row">
            <div className="col-md-6">
              <label>Lokasi:</label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="form-control"
              >
                <option value="">Pilih lokasi</option>
                {Array.isArray(locations) && locations.map((loc) => (
                  <option key={loc.ulid} value={loc.ulid}>
                    {loc.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-6">
              <label>Tanggal:</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                onClick={(e) => e.target.showPicker()} // Pastikan ini dipanggil dari onClick
                className="form-control"
              />
            </div>
          </div>
        </div>

        {loading && <p>Loading...</p>}
        {error && <p>{error}</p>}

        {location && date && scheduleData && (
          <table className="table">
            <thead>
              <tr>
                <th>Shift</th>
                <th>Minggu</th>
                <th>Senin</th>
                <th>Selasa</th>
                <th>Rabu</th>
                <th>Kamis</th>
                <th>Jumat</th>
                <th>Sabtu</th>
              </tr>
            </thead>
            <tbody>
              {shifts.map(shift => (
                <tr key={shift.slug}>
                  <td>{shift.name} </td>
                  {['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'].map(day => (
                    <td key={day}>
                      <Select
                        isMulti
                        name={`${day}-${shift.slug}`}
                        options={userOptions}
                        className="basic-multi-select"
                        classNamePrefix="select"
                        value={selectedUsers[`${day}-${shift.slug}`]}
                        onChange={handleAssignChange}
                        styles={customStyles} // Apply custom styles
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}

          {location && date && (
          <button onClick={handleSubmit} className="btn btn-primary mt-3">
            Submit Jadwal
          </button>
        )}
      </div>
      {/* Tambahkan keterangan warna di sini */}
      <div className="legend mt-4">
        <h5>Keterangan:</h5>
        <div className="d-flex flex-wrap">
          <div className="legend-item mr-3">
            <span className="legend-color" style={{ backgroundColor: '#23B7E5' }}></span>
            FT (Full-time)
          </div>
          <div className="legend-item mr-3">
            <span className="legend-color" style={{ backgroundColor: '#8CC63F' }}></span>
            PT (Part-time)
          </div>
          <div className="legend-item mr-3">
            <span className="legend-color" style={{ backgroundColor: '#F3A712' }}></span>
            HB (Honorer/Bebas)
          </div>
          <div className="legend-item mr-3">
            <span className="legend-color" style={{ backgroundColor: '#ff4507' }}></span>
            DIR (Direktur)
          </div>
        </div>
      </div>



       {/* CSS Inline untuk styling keterangan */}
    <style jsx>{`
      .legend {
        margin-top: 20px;
      }
      .legend-item {
        display: flex;
        align-items: center;
        margin-bottom: 10px;
      }
      .legend-color {
        display: inline-block;
        width: 20px;
        height: 20px;
        margin-right: 8px;
        border-radius: 3px;
      }
    `}</style>
    </div>
  );
};

export default FormAddSchedule;
