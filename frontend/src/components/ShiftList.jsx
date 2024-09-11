import React, { useState, useEffect } from 'react';

const ShiftList = () => {
  const [shiftData, setShiftData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchShiftData = async () => {
      try {
        const response = await fetch('/v1/attendance/shift', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          },
        });
        const result = await response.json();
        
        console.log('API Response:', result);

        if (result.meta.code === 200) {
          setShiftData(result.data.shift);
        } else {
          setError('Failed to load shift data');
        }
      } catch (error) {
        console.error('Error fetching shift data:', error);
        setError('Error fetching shift data');
      } finally {
        setLoading(false);
      }
    };

    fetchShiftData();
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    // Implementasi pencarian bisa dilakukan di sini jika ada logika tambahan
  };

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
          <div className="card-header d-flex justify-content-between align-items-center">
            <div className="card-title">
              Management Shift
            </div>
            <div className="d-flex"> {/* Pastikan tombol dan search berada dalam container flex */}
              <input
                type="text"
                className="form-control form-control-sm w-auto mr-2" // Batasi ukuran search input
                placeholder="Search Shift..."
                value={searchTerm}
                onChange={handleSearch}
              />
              <a href="/addshift" className="btn btn-primary btn-sm">+ Tambah Shift</a> {/* Tambahkan btn-sm untuk ukuran kecil */}
            </div>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              <table id="shift-table" className="table table-bordered text-nowrap w-100">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Nama Shift</th>
                    <th>Clock In</th>
                    <th>Clock Out</th>
                    <th>Break Start</th>
                    <th>Break End</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {shiftData ? (
                    <tr>
                      <td>1</td>
                      <td>{shiftData.name}</td>
                      <td>{shiftData.clock_in}</td>
                      <td>{shiftData.clock_out}</td>
                      <td>{shiftData.break_start}</td>
                      <td>{shiftData.break_end}</td>
                      <td>{shiftData.status}</td>
                    </tr>
                  ) : (
                    <tr>
                      <td colSpan="7">No shift data available</td>
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

export default ShiftList;
