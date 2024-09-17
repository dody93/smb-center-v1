import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import Select from 'react-select'; // Import react-select untuk multi-select
import 'bootstrap/dist/css/bootstrap.min.css';

const ShiftList = () => {
  const [shiftData, setShiftData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [setShowShiftModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    start: '',
    end: ''
  });
  const [assignData, setAssignData] = useState({
    employees: [], // Mengubah dari string ke array untuk multiple employees
    outlet: '',
    date: ''
  });
  const [userOptions, setUserOptions] = useState([]); // Menyimpan opsi user

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

    const fetchUserData = async () => {
      try {
        const response = await fetch('/v1/select/user', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          },
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const users = await response.json();
        const userOptions = users.map(user => ({
          value: user.ulid,
          label: `${user.first_name} ${user.last_name || ''}`.trim()
        }));
        setUserOptions(userOptions);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchShiftData();
    fetchUserData(); // Ambil data pengguna saat komponen di-mount
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleShowShiftModal = () => setShowShiftModal(true);
  

  const handleShowAssignModal = () => setShowAssignModal(true);
  const handleCloseAssignModal = () => setShowAssignModal(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAssignChange = (selectedOptions) => {
    const selectedEmployees = selectedOptions ? selectedOptions.map(option => option.value) : [];
    setAssignData({ ...assignData, employees: selectedEmployees });
  };

  const handleAssignFormSubmit = (e) => {
    e.preventDefault();
    // Implementasi untuk mengirim data assign form
    console.log('Assign Form Data:', assignData);
    
    // Implement POST request dengan assignData.employees (array of ulids)
    fetch('/v1/assign-task', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
      },
      body: JSON.stringify(assignData),
    })
    .then(response => response.json())
    .then(data => {
      console.log('Success:', data);
      handleCloseAssignModal();
    })
    .catch((error) => {
      console.error('Error:', error);
    });
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
              Management Shift
            </div>
            <div className="d-flex">
              <input
                type="text"
                className="form-control form-control-sm w-auto mr-2"
                placeholder="Search Shift..."
                value={searchTerm}
                onChange={handleSearch}
              />
              <Button className="btn btn-primary btn-sm" onClick={handleShowShiftModal}>
                <i className="ri-add-line me-1 fw-semibold align-middle"></i>Tambah Shift
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

      {/* Modal untuk Assign Schedule */}
      <Modal show={showAssignModal} onHide={handleCloseAssignModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Assign Schedule</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAssignFormSubmit}>
            <Form.Group controlId="formEmployee">
              <Form.Label>Employees  <span className="text-danger">*</span></Form.Label>
              <Select
                isMulti
                name="employees"
                options={userOptions}
                className="basic-multi-select"
                classNamePrefix="select"
                onChange={handleAssignChange}
              />
            </Form.Group>
            <Form.Group controlId="formOutlet">
              <Form.Label>Outlet  <span className="text-danger">*</span></Form.Label>
              <Form.Control
                as="select"
                name="outlet"
                value={assignData.outlet}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Outlet</option>
                {/* Tambahkan opsi outlet */}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formDate">
              <Form.Label>Date  <span className="text-danger">*</span></Form.Label>
              <Form.Control
                type="date"
                name="date"
                value={assignData.date}
                onChange={handleInputChange}
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
