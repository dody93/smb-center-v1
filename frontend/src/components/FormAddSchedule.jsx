import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';

const FormAddSchedule = () => {
  const [locations, setLocations] = useState([]);
  const [users, setUsers] = useState([]);
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [scheduleData, setScheduleData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [selectedUsers, setSelectedUsers] = useState({
    'Minggu-Opening': [],
    'Senin-Opening': [],
    'Selasa-Opening': [],
    'Rabu-Opening': [],
    'Kamis-Opening': [],
    'Jumat-Opening': [],
    'Sabtu-Opening': [],
    'Minggu-Middle': [],
    'Senin-Middle': [],
    'Selasa-Middle': [],
    'Rabu-Middle': [],
    'Kamis-Middle': [],
    'Jumat-Middle': [],
    'Sabtu-Middle': [],
    'Minggu-Closing': [],
    'Senin-Closing': [],
    'Selasa-Closing': [],
    'Rabu-Closing': [],
    'Kamis-Closing': [],
    'Jumat-Closing': [],
    'Sabtu-Closing': []
  });

  // Fetch locations when component mounts
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

  // Fetch users for the multiple selection
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('/v1/select/user');
        setUsers(response.data);
      } catch (err) {
        setError('Gagal mengambil daftar user.');
      }
    };

    fetchUsers();
  }, []);

  // Convert user data for react-select
  const userOptions = users.map(user => ({
    value: user.ulid,
    label: `${user.first_name} ${user.last_name || ''}`
  }));

  // Fetch schedule based on selected location and date
  useEffect(() => {
    if (location && date) {
      setLoading(true);
      setError(null);

      const fetchSchedule = async () => {
        try {
          const response = await axios.get(`/v1/location/${location}/${date}`);
          setScheduleData(response.data);
        } catch (err) {
          setError('Terjadi kesalahan saat mengambil data jadwal.');
        } finally {
          setLoading(false);
        }
      };

      fetchSchedule();
    }
  }, [location, date]);

  // Function to handle user selection change
  const handleAssignChange = (selectedOptions, { name }) => {
    setSelectedUsers(prevState => ({
      ...prevState,
      [name]: selectedOptions
    }));
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
              {/* Contoh shift */}
              {['Opening', 'Middle', 'Closing'].map((shift) => (
                <tr key={shift}>
                  <td>{shift} 07:00 - 16:00</td>
                  {['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'].map((day) => (
                    <td key={day}>
                      {/* React-Select dropdown untuk memilih user */}
                      <Select
                        isMulti
                        name={`${day}-${shift}`}
                        options={userOptions}
                        className="basic-multi-select"
                        classNamePrefix="select"
                        value={selectedUsers[`${day}-${shift}`]}
                        onChange={handleAssignChange}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default FormAddSchedule;
