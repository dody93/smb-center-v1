import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const ShiftList = () => {
  const [shiftData, setShiftData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showShiftModal, setShowShiftModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    start: '',
    end: ''
  });
  const [assignData, setAssignData] = useState({
    employee: '',
    outlet: '',
    date: ''
  });
  //const [outlets, setOutlets] = useState([]); // Untuk data outlet

  useEffect(() => {
    const fetchShiftData = async () => {
      try {
        const response = await fetch('/v1/scheduling/shift', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (Array.isArray(result)) {
          setShiftData(result);
        } else {
          setError('Unexpected response format');
        }
      } catch (error) {
        console.error('Error fetching shift data:', error);
        setError('Error fetching shift data');
      } finally {
        setLoading(false);
      }
    };

    // Hapus atau nonaktifkan bagian ini sementara jika endpoint outlet menyebabkan masalah
    // const fetchOutlets = async () => {
    //   try {
    //     const response = await fetch('/v1/outlets'); // Ganti dengan endpoint yang sesuai
    //     const result = await response.json();
    //     if (Array.isArray(result)) {
    //       setOutlets(result);
    //     } else {
    //       setError('Unexpected outlets response format');
    //     }
    //   } catch (error) {
    //     console.error('Error fetching outlets data:', error);
    //     setError('Error fetching outlets data');
    //   }
    // };

    fetchShiftData();
    // fetchOutlets(); // Hapus atau nonaktifkan sementara
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleShowShiftModal = () => setShowShiftModal(true);
  const handleCloseShiftModal = () => setShowShiftModal(false);

  const handleShowAssignModal = () => setShowAssignModal(true);
  const handleCloseAssignModal = () => setShowAssignModal(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAssignChange = (e) => {
    const { name, value } = e.target;
    setAssignData({ ...assignData, [name]: value });
  };

  const handleShiftFormSubmit = (e) => {
    e.preventDefault();
    // Implementasi untuk mengirim data shift form
    console.log('Shift Form Data:', formData);
    handleCloseShiftModal();
  };

  const handleAssignFormSubmit = (e) => {
    e.preventDefault();
    // Implementasi untuk mengirim data assign form
    console.log('Assign Form Data:', assignData);
    handleCloseAssignModal();
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const filteredShifts = shiftData.filter(shift =>
    shift.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="row">
      <div className="col-xl-12">
        <div className="card custom-card">
          <div className="card-header d-flex justify-content-between align-items-center">
            <div className="card-title">
              Management Karyawan
            </div>
            <div className="d-flex">
              <input
                type="text"
                className="form-control form-control-sm w-auto mr-2"
                placeholder="Search Karyawan..."
                value={searchTerm}
                onChange={handleSearch}
              />
              <Button className="btn btn-primary btn-sm" onClick={handleShowShiftModal}>
                <i className="ri-add-line me-1 fw-semibold align-middle"></i>Tambah Karyawan
              </Button>
            </div>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              <table id="shift-table" className="table table-bordered text-nowrap w-100">
                <thead>
                  <tr>
                  <th style={{ width: '10%' }}>Shift ID</th>
                    <th style={{ width: '30%' }}>Nama Shift</th>
                    <th style={{ width: '20%' }}>Start Time</th>
                    <th style={{ width: '20%' }}>End Time</th>
                    <th style={{ width: '20%' }}>Actions</th> 
                  </tr>
                </thead>
                <tbody>
                  {filteredShifts.length > 0 ? (
                    filteredShifts.map((shift, index) => (
                      <tr key={shift.id}>
                        <td>{shift.id}</td>
                        <td>{shift.name}</td>
                        <td>{shift.start}</td>
                        <td>{shift.end}</td>
                        <td>
                          <Button 
                            variant="secondary" 
                            onClick={handleShowAssignModal}
                          >
                            Assign Schedule
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5">No shift data available</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Modal untuk Tambah Shift */}
      <Modal show={showShiftModal} onHide={handleCloseShiftModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Tambah Karyawan</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleShiftFormSubmit}>
            <Form.Group controlId="formShiftName">
              <Form.Label>Shift Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter shift name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formStartTime">
              <Form.Label>Start Time</Form.Label>
              <Form.Control
                type="time"
                name="start"
                value={formData.start}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formEndTime">
              <Form.Label>End Time</Form.Label>
              <Form.Control
                type="time"
                name="end"
                value={formData.end}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseShiftModal}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Save Shift
              </Button>
            </Modal.Footer>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Modal untuk Assign Schedule */}
      <Modal show={showAssignModal} onHide={handleCloseAssignModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Assign Schedule</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAssignFormSubmit}>
            <Form.Group controlId="formEmployee">
              <Form.Label>Employee  <span className="text-danger">*</span></Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter employee name"
                name="employee"
                value={assignData.employee}
                onChange={handleAssignChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formOutlet">
              <Form.Label>Outlet  <span className="text-danger">*</span></Form.Label>
              <Form.Control
                as="select"
                name="outlet"
                value={assignData.outlet}
                onChange={handleAssignChange}
                required
              >
                <option value="">Select Outlet</option>
               
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formDate">
              <Form.Label>Date  <span className="text-danger">*</span></Form.Label>
              <Form.Control
                type="date"
                name="date"
                value={assignData.date}
                onChange={handleAssignChange}
                required
              />
            </Form.Group>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseAssignModal}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Assign
              </Button>
            </Modal.Footer>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ShiftList;
