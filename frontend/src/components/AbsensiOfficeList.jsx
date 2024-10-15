import React, { useEffect, useState, useCallback, useMemo } from 'react';
import axios from 'axios';
import { FaCalendarAlt, FaStore, FaFilter } from 'react-icons/fa'; 
import '../styles/Shift.css';

const FilterSection = ({
  date,
  handleDateChange,
  locations,
  selectedLocation,
  handleLocationChange,
  category,
  handleCategoryChange,
}) => {
  return (
    <div className="filter-container">
      <div className="filter-item">
        <FaCalendarAlt className="filter-icon" />
        <div className="filter-content">
          <input
            type="month"
            value={date}
            onChange={handleDateChange}
            onClick={(e) => e.target.showPicker()} 
            className="form-control"
          />
          
        </div>
      </div>
      <div className="filter-item">
        <FaStore className="filter-icon" />
        <div className="filter-content">
          <select
            value={selectedLocation}
            onChange={handleLocationChange}
            className="filter-select"
          >
            <option value="">Pilih Lokasi</option>
            {locations.map((location) => (
              <option key={location.ulid} value={location.ulid}>
                {location.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="filter-item">
        <FaFilter className="filter-icon" />
        <div className="filter-content">
          <select
            value={category}
            onChange={handleCategoryChange}
            className="filter-select"
          >
            <option value="all">Semua</option>
            <option value="terlambat">Terlambat</option>
            <option value="pulang_cepat">Pulang Cepat</option>
          </select>
        </div>
      </div>
    </div>
  );
};

const AbsensiOfficeList = () => {
  const [date, setDate] = useState('');
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [absenData, setAbsenData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState('all');

  const handleDateChange = (event) => {
    const selectedMonth = event.target.value;
    setDate(selectedMonth); // Menyimpan dalam format YYYY-MM
  };
  

  const handleLocationChange = (event) => {
    setSelectedLocation(event.target.value);
  };

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
  };

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

  const fetchAbsenData = useCallback(async () => {
    if (!date || !selectedLocation) return;
  
    setLoading(true);
    setError(null);
  
    try {
      // Menggunakan date yang sekarang berupa format bulan (YYYY-MM)
      const response = await axios.get(
        `/v1/report/absensi-office/summary/${date}-01?location=${selectedLocation}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        }
      );
  
      if (response.status !== 200) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const result = response.data;
      console.log('API Response:', result);
  
      setAbsenData(result);
    } catch (error) {
      console.error('Error fetching absensi data:', error);
      setError('Gagal mengambil data absensi');
      setAbsenData([]);
    } finally {
      setLoading(false);
    }
  }, [date, selectedLocation]);
  
  useEffect(() => {
    fetchAbsenData();
  }, [date, selectedLocation, fetchAbsenData]);



  const filteredAbsenData = absenData.filter((data) => {
    if (category === 'all') return true;
    if (category === 'terlambat') return data.terlambat > 0;
    if (category === 'pulang_cepat') return data.pulang_cepat > 0;
    return false;
  });

  // Fungsi untuk download laporan
  const handleDownload = async () => {
    try {
      const response = await axios({
        url: `/v1/report/absensi/download/${date}`,
        method: 'GET',
        responseType: 'blob',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `laporan-absensi-${date}.xlsx`);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error('Error downloading the report:', error);
      setError('Gagal mendownload laporan.');
    }
  };

  // Paginasi menggunakan filteredAbsenData
  const [currentPage, setCurrentPage] = useState(1);
  const [tasksPerPage] = useState(10);

  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = filteredAbsenData.slice(indexOfFirstTask, indexOfLastTask);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const pageNumbers = useMemo(() => {
    return Array.from(
      { length: Math.ceil(filteredAbsenData.length / tasksPerPage) },
      (_, i) => i + 1
    );
  }, [filteredAbsenData.length, tasksPerPage]);

  return (
    <div className="row">
      <div className="col-xl-12">
        <div className="card custom-card">
          <div className="card-header">
            <div className="card-title">Data Absensi</div>
          </div>
          <div className="card-body">
            <FilterSection
              date={date}
              handleDateChange={handleDateChange}
              locations={locations}
              selectedLocation={selectedLocation}
              handleLocationChange={handleLocationChange}
              category={category}
              handleCategoryChange={handleCategoryChange}
            />
            <div className="table-responsive">
              <table
                id="absen-table"
                className="table table-bordered text-nowrap w-100"
              >
                <thead className="table-primary">
                  <tr>
                    <th>Nama Karyawan</th>
                    <th>Posisi Code</th>
                    <th>Masuk</th>
                    <th>Izin</th>
                    <th>Sakit</th>
                    <th>Cuti</th>
                    <th>Absen</th>
                    <th>Keterlambatan</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="13">Loading...</td>
                    </tr>
                  ) : error ? (
                    <tr>
                      <td colSpan="13">{error}</td>
                    </tr>
                  ) : Array.isArray(currentTasks) && currentTasks.length > 0 ? (
                    currentTasks.map((data, index) => (
                      <tr key={index}>
                        <td>{data.name || 'Nama tidak tersedia'}</td>
                        <td>{data.posisi_code || 0}</td>
                        <td>{data.masuk || 0}</td>
                        <td>{data.izin || 0}</td>
                        <td>{data.sakit || 0}</td>
                        <td>{data.cuti || 0}</td>
                        <td>{data.absen || 0}</td>
                        <td>{data.terlambat || 0}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="13">Tidak ada data absensi yang tersedia.</td>
                    </tr>
                  )}
                </tbody>
              </table>
              <div className="card-footer">
                <nav aria-label="Page navigation">
                  <ul className="pagination mb-0 float-end">
                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                      <button
                        className="page-link"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        Previous
                      </button>
                    </li>
                    {pageNumbers.map((number) => (
                      <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
                        <button className="page-link" onClick={() => handlePageChange(number)}>
                          {number}
                        </button>
                      </li>
                    ))}
                    <li className={`page-item ${currentPage === pageNumbers.length ? 'disabled' : ''}`}>
                      <button
                        className="page-link"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === pageNumbers.length}
                      >
                        Next
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
               {/* Tambahkan tombol download */}
              <div className="d-flex justify-content-end">
                <button onClick={handleDownload} className="btn btn-primary">
                  Download Laporan
                </button>
              </div>
          </div>
        </div>
        
      {/* Modal detail */}
      <div
        className="modal fade"
        id="detailTaskModal"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="detailTaskModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="detailTaskModalLabel">
                Detail Absensi
              </h5>
              <button
                type="button"
                className="close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
          
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AbsensiOfficeList;
