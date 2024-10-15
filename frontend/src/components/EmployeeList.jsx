import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const UserList = () => {
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showUserModal, setShowUserModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false); // State for edit modal
  const [positions, setPositions] = useState([]);
  const [locations, setLocations] = useState([]);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    position_ulid: '',
    location_ulid: ''
  });
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10); // Set the number of users per page to 10

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/v1/select/user', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          },
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const result = await response.json();
        if (Array.isArray(result)) setUserData(result);
        else setError('Unexpected response format');
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('Error fetching user data');
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  // Fetch positions
  useEffect(() => {
    const fetchPositions = async () => {
      try {
        const response = await fetch('/v1/select/position', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          },
        });
        const result = await response.json();
        setPositions(result);
      } catch (error) {
        console.error('Error fetching positions:', error);
      }
    };
    fetchPositions();
  }, []);

  // Fetch locations
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await fetch('/v1/select/location', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          },
        });
        const result = await response.json();
        setLocations(result);
      } catch (error) {
        console.error('Error fetching locations:', error);
      }
    };
    fetchLocations();
  }, []);

  const handleSearch = (e) => setSearchTerm(e.target.value);
  const handleShowUserModal = () => setShowUserModal(true);
  const handleCloseUserModal = () => setShowUserModal(false);

  
  const handleShowEditModal = () => setShowEditModal(true);
  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setFormData({ ulid: '', first_name: '', last_name: '', email: '', position_ulid: '', location_ulid: '' });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/v1/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify(formData)
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const result = await response.json();
      console.log('User added successfully:', result);
      handleCloseUserModal();
      // Fetch updated user data
      setLoading(true);
      const fetchUpdatedUserData = async () => {
        const response = await fetch('/v1/select/user', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          },
        });
        const result = await response.json();
        setUserData(result);
        setLoading(false);
      };
      fetchUpdatedUserData();
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

   // Handle Edit Click
   const handleEditClick = (user) => {console.log(user);
    setFormData({
      ulid: user.ulid,  // Simpan ulid ke dalam formData
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      position_ulid: user.position_ulid || '',  // Ambil nilai dari user atau default ke yang pertama
      location_ulid: user.location_ulid || '' // Ambil nilai dari user atau default ke yang pertama
    });
    handleShowEditModal();
  };

 // Handle Edit Submission
 const handleEditSubmit = async (e) => {
  e.preventDefault();
  try {
    const response = await fetch(`/v1/user/${formData.ulid}`, {  // Gunakan ulid dari formData
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      },
      body: JSON.stringify(formData)
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const result = await response.json();
    console.log('User edited successfully:', result);
    handleCloseEditModal();
    // Fetch updated user data
    await fetchUserData();
  } catch (error) {
    console.error('Error editing user:', error);
  }
};

const fetchUserData = async () => {
  try {
    setLoading(true);
    const response = await fetch('/v1/select/user', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
      },
    });
    const result = await response.json();
    setUserData(result);
  } catch (error) {
    console.error('Error fetching updated user data:', error);
  } finally {
    setLoading(false);
  }
};

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  const filteredUsers = userData.filter(user =>
    user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.last_name && user.last_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  // Page numbers for pagination
  const pageNumbers = [...Array(totalPages).keys()].map(i => i + 1);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="row">
      <div className="col-xl-12">
        <div className="card custom-card">
          <div className="card-header d-flex justify-content-between align-items-center">
            <div className="card-title">Management Karyawan</div>
            <div className="d-flex">
              <input
                type="text"
                className="form-control form-control-sm w-auto mr-2"
                placeholder="Search Karyawan..."
                value={searchTerm}
                onChange={handleSearch}
              />
              <Button className="btn btn-primary btn-sm" onClick={handleShowUserModal}>
                <i className="ri-add-line me-1 fw-semibold align-middle"></i>Tambah Karyawan
              </Button>
            </div>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              <table id="user-table" className="table table-bordered text-nowrap w-100">
                <thead className="table-primary">
                  <tr>
                    <th style={{ width: '30%' }}>Nama Depan</th>
                    <th style={{ width: '30%' }}>Nama Belakang</th>
                    <th style={{ width: '30%' }}>Email</th>
                    <th scope="col" style={{ width: '10%' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {currentUsers.length > 0 ? (
                    currentUsers.map((user) => (
                      <tr key={user.ulid}>
                        <td>{user.first_name}</td>
                        <td>{user.last_name ? user.last_name : '-'}</td>
                        <td>{user.email}</td>
                        <td>
                          <button className="btn btn-sm btn-primary me-2" onClick={() => handleEditClick(user)}>
                          <i className="bi bi-pencil"></i>
                          </button>
                      
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3">No user data available</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          {/* Pagination Controls */}
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
                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>

      {/* Modal untuk Tambah Karyawan */}
      <Modal show={showUserModal} onHide={handleCloseUserModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Tambah Karyawan</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formFirstName">
              <Form.Label>Nama Depan</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter first name"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formLastName">
              <Form.Label>Nama Belakang</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter last name"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formPosition">
              <Form.Label>Jabatan</Form.Label>
              <Form.Control
                as="select"
                name="position_ulid"
                value={formData.position_ulid}
                onChange={handleChange}
                required
              >
                <option value="">Pilih Jabatan</option>
                {positions.map(position => (
                  <option key={position.ulid} value={position.ulid}>
                    {position.name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formLocation">
              <Form.Label>Lokasi</Form.Label>
              <Form.Control
                as="select"
                name="location_ulid"
                value={formData.location_ulid}
                onChange={handleChange}
                required
              >
                <option value="">Pilih Lokasi</option>
                {locations.map(location => (
                  <option key={location.ulid} value={location.ulid}>
                    {location.name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <div className="modal-footer">
              <Button variant="secondary" onClick={handleCloseUserModal}>
                Close
              </Button>
              <Button variant="primary" type="submit">
                Tambah
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Modal Edit */}
      <Modal show={showEditModal} onHide={handleCloseEditModal}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Karyawan</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleEditSubmit}>
            <Form.Group>
              <Form.Label>Nama Depan</Form.Label>
              <Form.Control
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Nama Belakang</Form.Label>
              <Form.Control
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Posisi</Form.Label>
              <Form.Control
                as="select"
                name="position_ulid"
                value={formData.position_ulid}
                onChange={handleChange}
                required
              >
                <option value="">Pilih Posisi</option>
                {positions.map((position) => (
                  <option key={position.ulid} value={position.ulid}>
                    {position.name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>Lokasi</Form.Label>
              <Form.Control
                as="select"
                name="location_ulid"
                value={formData.location_ulid}
                onChange={handleChange}
                required
              >
                <option value="">Pilih Lokasi</option>
                {locations.map((location) => (
                  <option key={location.ulid} value={location.ulid}>
                    {location.name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <div className='modal-footer'>
            <Button variant="secondary" onClick={handleCloseEditModal}>
                Close
            </Button>
            <Button variant="primary" type="submit">
              Simpan Perubahan
            </Button>
            </div>
            
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default UserList;
