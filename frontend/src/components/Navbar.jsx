import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../Logo.png'; // Pastikan pathnya benar
import '../styles/custome.css';

const Navbar = () => {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);
  const dropdownRef = useRef(null);

  // Ambil data pengguna dari API
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('v1/my-info/profile', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`, // Jika diperlukan header token
          },
        });
        const result = await response.json();
        if (result.meta.code === 200) {
          setUser(result.data);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    navigate('/');
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="app-header">
      <div className="main-header-container container-fluid">
        <div className="header-content-left">
          <div className="header-element">
            <button
              aria-label="Hide Sidebar"
              className="sidemenu-toggle header-link animated-arrow hor-toggle horizontal-navtoggle"
              data-bs-toggle="sidebar"
              onClick={() => document.body.classList.toggle('sidebar-open')}
            >
              <span></span>
            </button>
          </div>
        </div>
        <div className="header-element dropdown" ref={dropdownRef}>
          <button
            className="header-link dropdown-toggle"
            id="mainHeaderProfile"
            aria-expanded={dropdownOpen}
            onClick={toggleDropdown}
          >
            <div className="d-flex align-items-center">
              <div className="me-sm-2 me-0">
                <img
                  src={user?.photo || Logo}
                  alt="Profile"
                  width="32"
                  height="32"
                  className="rounded-circle"
                />
              </div>
              <div className="d-sm-block d-none">
                <p className="fw-semibold mb-0 lh-1">{user?.first_name || 'Loading...'}</p>
              </div>
            </div>
          </button>
          <ul
            className={`custom-dropdown-menu ${dropdownOpen ? 'show' : ''}`}
            aria-labelledby="mainHeaderProfile"
          >
            <li>
              <Link className="custom-dropdown-item d-flex" to="/profile">
                <i className="ti ti-user-circle fs-18 me-2 op-7"></i>Profile
              </Link>
            </li>
            <li>
              <Link className="custom-dropdown-item d-flex border-block-end" to="/to-do-list">
                <i className="ri-briefcase-line fs-18 me-2 op-7"></i>Ganti Jabatan
              </Link>
            </li>
            <li>
              <Link className="custom-dropdown-item d-flex" to="/chat">
                <i className="ti ti-headset fs-18 me-2 op-7"></i>Support
              </Link>
            </li>
            <li>
              <button onClick={handleLogout} className="custom-dropdown-item d-flex">
                <i className="ti ti-logout fs-18 me-2 op-7"></i>Log Out
              </button>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
