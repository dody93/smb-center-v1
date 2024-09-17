import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Logo from '../logo_sidebar.png'; // Pastikan path ini benar

const Sidebar = () => {
  const location = useLocation();

  // Fungsi untuk menentukan apakah suatu link sedang aktif
  const isActive = (path) => location.pathname === path;

  return (
    <div>
      <aside className="app-sidebar sticky" id="sidebar">
        <div className="main-sidebar-header">
          <Link to="/index" className="header-logo">
            <img src={Logo} alt="logo" className="desktop-logo" />
            <img src={Logo} alt="logo" className="toggle-logo" />
            <img src={Logo} alt="logo" className="desktop-dark" />
            <img src={Logo} alt="logo" className="toggle-dark" />
            <img src={Logo} alt="logo" className="desktop-white" />
            <img src={Logo} alt="logo" className="toggle-white" />
          </Link>
        </div>
        <div className="main-sidebar" id="sidebar-scroll">
          <nav className="main-menu-container nav nav-pills flex-column sub-open">
            <div className="slide-left" id="slide-left">
              <svg xmlns="http://www.w3.org/2000/svg" fill="#7b8191" width="24" height="24" viewBox="0 0 24 24">
                <path d="M13.293 6.293 7.586 12l5.707 5.707 1.414-1.414L10.414 12l4.293-4.293z"></path>
              </svg>
            </div>
            <ul className="main-menu">
              <li className="slide__category"><span className="category-name">Main</span></li>
              <li className="slide has-sub">
                <Link to="/dashboard" className={`side-menu__item ${isActive('/dashboard') ? 'active' : ''}`}>
                  <i className="bx bx-home side-menu__icon"></i>
                  <span className="side-menu__label">Dashboards<span className="badge bg-warning-transparent ms-2">12</span></span>
                </Link>
              </li>
              <li className="slide__category"><span className="category-name">Pages</span></li>
              <li className="slide has-sub">
                <Link to="/employee" className={`side-menu__item ${isActive('/employee') ? 'active' : ''}`}>
                  <i className="bx bx-file-blank side-menu__icon"></i>
                  <span className="side-menu__label">Management Karyawan</span>
                </Link>
              </li>
              <li className="slide has-sub">
                <Link to="/shift" className={`side-menu__item ${isActive('/shift') ? 'active' : ''}`}>
                  <i className="bx bx-task side-menu__icon"></i>
                  <span className="side-menu__label">Management Shifting</span>
                </Link>
              </li>
              <li className="slide has-sub">
                <Link to="/AddSchedule" className={`side-menu__item ${isActive('/AddSchedule') ? 'active' : ''}`}>
                  <i className="bx bx-task side-menu__icon"></i>
                  <span className="side-menu__label">Assign Schedule</span>
                </Link>
              </li>
              <li className="slide has-sub">
                <Link to="/listtask" className={`side-menu__item ${isActive('/listtask') ? 'active' : ''}`}>
                  <i className="bx bx-box side-menu__icon"></i>
                  <span className="side-menu__label">To Do List</span>
                </Link>
              </li>
            </ul>
            <div className="slide-right" id="slide-right">
              <svg xmlns="http://www.w3.org/2000/svg" fill="#7b8191" width="24" height="24" viewBox="0 0 24 24">
                <path d="m10.707 6.293-1.414 1.414L13.586 12l-4.293 4.293 1.414 1.414L16.414 12z"></path>
              </svg>
            </div>
          </nav>
        </div>
      </aside>
    </div>
  );
}

export default Sidebar;
