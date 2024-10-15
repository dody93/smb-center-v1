import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import '../styles/Shift.css';

const ShiftTable = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [dates, setDates] = useState([]);
  const [summaryData, setSummaryData] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [locations, setLocations] = useState([]); // State untuk menyimpan data lokasi
  const [selectedLocation, setSelectedLocation] = useState(''); // State untuk lokasi yang dipilih
  const [error, setError] = useState(null);

  // Fetch lokasi dari API saat komponen di-mount
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await axios.get('/v1/select/location');
        setLocations(response.data); // Simpan data lokasi ke state
      } catch (err) {
        setError('Gagal mengambil lokasi.');
      }
    };

    fetchLocations();
  }, []);

  // Format bulan untuk API (YYYY-MM)
  const formatDateForAPI = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}-01`;
  };

  // Mengambil data absensi berdasarkan bulan dan lokasi yang dipilih
  const fetchAttendanceData = useCallback((date, locationUlid) => {
    const apiDate = formatDateForAPI(date);
    fetch(`/v1/report/absensi/jadwal/${apiDate}?location=${locationUlid}`)
      .then((response) => response.json())
      .then((data) => {
        const formattedData = formatAttendanceData(data);
        setAttendanceData(formattedData.attendance);
        setDates(formattedData.dates);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });

    // Mengambil summary berdasarkan lokasi yang dipilih
    fetch(`/v1/report/absensi/summary/${apiDate}?location=${locationUlid}`)
      .then((response) => response.json())
      .then((summary) => {
        setSummaryData(summary);
      })
      .catch((error) => {
        console.error('Error fetching summary data:', error);
      });
  }, []);

  // Fetch data saat currentDate atau selectedLocation berubah
  useEffect(() => {
    if (selectedLocation) {
      fetchAttendanceData(currentDate, selectedLocation);
    }
  }, [currentDate, selectedLocation, fetchAttendanceData]);

  // Fungsi untuk memformat data absensi dari API
  const formatAttendanceData = (data) => {
    const allDates = new Set();
    const attendance = data.map((employee) => {
      const absensi = Object.keys(employee.absensi).map((date) => {
        allDates.add(date);
        return {
          date,
          shift: employee.absensi[date].shift.charAt(0).toUpperCase(),
          jamMasuk: employee.absensi[date].masuk,
          jamPulang: employee.absensi[date].pulang,
          jadwalMasuk: employee.absensi[date].jadwal_masuk,
          jadwalPulang: employee.absensi[date].jadwal_pulang,
          terlambat: employee.absensi[date].terlambat,
          pulangCepat: employee.absensi[date].pulang_cepat,
        };
      });
      return {
        name: employee.name,
        absensi,
      };
    });

    const sortedDates = Array.from(allDates).sort();
    return { attendance, dates: sortedDates };
  };

  // Navigasi ke bulan sebelumnya
  const handlePreviousMonth = () => {
    const newDate = new Date(currentDate.setMonth(currentDate.getMonth() - 1));
    setCurrentDate(newDate);
  };

  // Navigasi ke bulan berikutnya
  const handleNextMonth = () => {
    const newDate = new Date(currentDate.setMonth(currentDate.getMonth() + 1));
    setCurrentDate(newDate);
  };

  // Fungsi untuk mengunduh laporan absensi berdasarkan lokasi dan bulan
  const handleDownload = () => {
    const apiDate = formatDateForAPI(currentDate);
    fetch(`/v1/report/absensi/download/${apiDate}?location=${selectedLocation}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.blob();
        }
        throw new Error('Gagal mengunduh file');
      })
      .then((blob) => {
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `absensi_report_${apiDate}_${selectedLocation}.csv`);
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
      })
      .catch((error) => {
        console.error('Error downloading file:', error);
      });
  };

  // Format bulan yang ditampilkan di UI
  const formatDateForDisplay = (date) => {
    return date.toLocaleDateString('id-ID', { year: 'numeric', month: 'long' });
  };

  return (
    <div className="shift-table-horizontal">
      <h2 className="shift-title">Kalender Kehadiran Karyawan</h2>

      {/* Dropdown Pilihan Lokasi */}
      <div className="location-select-container">
        <label htmlFor="location-select">Pilih Lokasi: </label>
        <select
          id="location-select"
          value={selectedLocation}
          onChange={(e) => setSelectedLocation(e.target.value)}
        >
          <option value="">--Pilih Lokasi--</option>
          {locations.map((location) => (
            <option key={location.ulid} value={location.ulid}>
              {location.name}
            </option>
          ))}
        </select>
        {error && <p className="error-message">{error}</p>}
      </div>

      {/* Navigasi Bulan */}
      <div className="month-navigation">
        <button className="month-button" onClick={handlePreviousMonth}>
          Bulan Sebelumnya
        </button>
        <span className="current-month">{formatDateForDisplay(currentDate)}</span>
        <button className="month-button" onClick={handleNextMonth}>
          Bulan Berikutnya
        </button>
      </div>

      {/* Kalender Kehadiran */}
      <table className="shift-table">
        <thead>
          <tr>
            <th>Karyawan</th>
            {dates.map((date, idx) => (
              <th key={idx}>{date.split('-')[2]}</th> // Menampilkan tanggal
            ))}
          </tr>
        </thead>
        <tbody>
          {attendanceData.map((employee, idx) => (
            <tr key={idx}>
              <td>{employee.name}</td>
              {dates.map((date, i) => {
                const absensi = employee.absensi.find((a) => a.date === date);
                if (absensi) {
                  return (
                    <td
                      key={i}
                      className={`shift-cell ${absensi.shift}`}
                      title={`Jam Masuk: ${absensi.jamMasuk}, Jam Pulang: ${absensi.jamPulang}, Status: ${absensi.terlambat ? 'Terlambat' : absensi.pulangCepat ? 'Pulang Cepat' : 'Tepat Waktu'}`}
                    >
                      {absensi.shift}
                    </td>
                  );
                } else {
                  return <td key={i}></td>; // Kosong jika tidak ada absensi
                }
              })}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Summary Kehadiran */}
      <h2 className="summary-title">Summary Kehadiran Karyawan</h2>
      <table className="summary-table">
        <thead>
          <tr>
            <th>Karyawan</th>
            <th>Posisi</th>
            <th>Opening</th>
            <th>Middle</th>
            <th>Closing</th>
            <th>Jumlah Shift C9</th>
            <th>Jumlah Shift C6/C7</th>
            <th>Day Off</th>
            <th>Keterlambatan</th>
          </tr>
        </thead>
        <tbody>
          {summaryData.length > 0 ? (
            summaryData.map((summary, idx) => (
              <tr key={idx}>
                <td>{summary.name}</td>
                <td>{summary.posisi_code}</td>
                <td>{summary.opening}</td>
                <td>{summary.middle}</td>
                <td>{summary.closing}</td>
                <td>{summary.c9}</td>
                <td>{summary.c6}</td>
                <td>{summary.day_off}</td>
                <td>{summary.terlambat}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="12">Loading summary...</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Tombol Download */}
      <div className="download-container">
        <button className="download-button" onClick={handleDownload}>
          Download Absensi
        </button>
      </div>
    </div>
  );
};

export default ShiftTable;
