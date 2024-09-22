import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const UserList = () => {
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showUserModal, setShowUserModal] = useState(false);

  useEffect(() => {
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

        const result = await response.json();

        if (Array.isArray(result)) {
          setUserData(result);
        } else {
          setError('Unexpected response format');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('Error fetching user data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleShowUserModal = () => setShowUserModal(true);
  const handleCloseUserModal = () => setShowUserModal(false);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const filteredUsers = userData.filter(user =>
    user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.last_name && user.last_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
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
              <Button className="btn btn-primary btn-sm" onClick={handleShowUserModal}>
                <i className="ri-add-line me-1 fw-semibold align-middle"></i>Tambah Karyawan
              </Button>
            </div>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              <table id="user-table" className="table table-bordered text-nowrap w-100">
                <thead>
                  <tr>
                    <th style={{ width: '10%' }}>User ID</th>
                    <th style={{ width: '30%' }}>Nama Depan</th>
                    <th style={{ width: '30%' }}>Nama Belakang</th>
                    <th style={{ width: '30%' }}>Email</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user, index) => (
                      <tr key={user.ulid}>
                        <td>{user.ulid}</td>
                        <td>{user.first_name}</td>
                        <td>{user.last_name ? user.last_name : '-'}</td>
                        <td>{user.email}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4">No user data available</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Modal untuk Tambah Karyawan */}
      <Modal show={showUserModal} onHide={handleCloseUserModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Tambah Karyawan</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {/* Form input untuk data karyawan */}
            <Form.Group controlId="formFirstName">
              <Form.Label>Nama Depan</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter first name"
                name="first_name"
                required
              />
            </Form.Group>
            <Form.Group controlId="formLastName">
              <Form.Label>Nama Belakang</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter last name"
                name="last_name"
              />
            </Form.Group>
            <Form.Group controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                name="email"
                required
              />
            </Form.Group>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseUserModal}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Save Karyawan
              </Button>
            </Modal.Footer>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default UserList;
