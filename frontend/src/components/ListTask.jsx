import React, { useState, useEffect, useMemo  } from 'react';
import '../styles/custome.css';
//import Logo from '../Logo.png'; // Pastikan pathnya benar

const ListTask = () => {
  const [tasks, setTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all-tasks');
  const [editTask, setEditTask] = useState(null); // Menyimpan task yang sedang di-edit


  // State untuk form input
  const [newTask, setNewTask] = useState({
    judul: '',
    deskripsi: '',
    tanggal_mulai: '',
    tanggal_selesai: '',
    status: 'Pending',
    ditugaskan_ke: '',
    urgensi: '', // Nilai default
  });
  

  const [assignedUsers, setAssignedUsers] = useState([]); // State untuk pengguna yang ditugaskan
  const [user, setuser] = useState([]); // State untuk pengguna yang ditugaskan
  const [assignedToFilter, setAssignedToFilter] = useState('');
  const [selectedTask, setSelectedTask] = useState(null); // State untuk menyimpan task yang dipilih



  const handleViewDetails = (task) => {
    setSelectedTask(task); // Simpan task yang dipilih ke state
  };
  

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch('/v1/tugas', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log('Fetched tasks:', result); // Debugging: Lihat data yang diambil
        setTasks(result);
      } catch (error) {
        console.error('Error fetching tasks data:', error);
      }
    };

    const fetchUsers = async () => {
      try {
        const response = await fetch('/v1/select/user', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log('Fetched users:', result); // Debugging: Lihat data pengguna
        setAssignedUsers(result);
      } catch (error) {
        console.error('Error fetching users data:', error);
      }
    };

    const fetchUserData = async () => {
        try {
          const response = await fetch('v1/my-info/profile', {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('accessToken')}`, // Jika diperlukan header token
            },
          });
          const result = await response.json();
          if (result.meta.code === 200) {
            setuser(result.data);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      };

    fetchTasks();
    fetchUsers();
    fetchUserData();
  }, []);

  

  const handleSearch = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
  };

  const filteredTasks = tasks.filter((task) =>
    task.judul.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewTask({
      ...newTask,
      [name]: value,
    });
  };

  const handleCreateTask = async () => {
    try {
      // Validasi input
      if (
        !newTask.judul ||
        !newTask.deskripsi ||
        !newTask.tanggal_mulai ||
        !newTask.tanggal_selesai ||
        !newTask.status ||
        !newTask.ditugaskan_ke
      ) {
        alert("Semua field harus diisi.");
        return;
      }
  
      const selectedUser = assignedUsers.find(user => user.ulid === newTask.ditugaskan_ke);
  
      if (!selectedUser) {
        throw new Error('Selected user not found');
      }
  
      const taskData = {
        ...newTask,
        ditugaskan_ke: selectedUser.ulid, // Kirim hanya ID pengguna
      };
  
      const response = await fetch('/v1/tugas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify(taskData),
      });
  
      // Log the response for debugging
      const textResponse = await response.text(); 
      console.log('Raw response from server:', textResponse);
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const result = JSON.parse(textResponse); // Parse if it's valid JSON
      setTasks([...tasks, result]);
  
      setNewTask({
        judul: '',
        deskripsi: '',
        tanggal_mulai: '',
        tanggal_selesai: '',
        status: 'Pending',
        ditugaskan_ke: '',
        urgensi: '', 
      });
  
      // Tutup modal secara manual jika perlu
      // Anda bisa menggunakan state untuk mengontrol visibilitas modal
    } catch (error) {
      console.error('Error creating task:', error);
      alert(`Gagal membuat task: ${error.message}`);
      // Modal tetap terbuka untuk memperbaiki input jika terjadi kesalahan
    }
  };
  
  
  const handleEditClick = (task) => {
    console.log(task)
    setEditTask(task); // Mengisi state dengan data task yang ingin di-edit
  };

  const handleEditTask = async () => {
    try {
      const response = await fetch(`/v1/tugas/${editTask.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify(editTask),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const updatedTask = await response.json();
      setTasks(tasks.map(task => (task.id === updatedTask.id ? updatedTask : task)));
      setEditTask(null); // Reset state setelah edit selesai
    } catch (error) {
      console.error('Error editing task:', error);
    }
  };

  const handleDelete = async (taskId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this task?');
  
    if (confirmDelete) {
      try {
        const response = await fetch(`/v1/tugas/${taskId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          },
        });
  
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
  
        // Menghapus task dari state setelah berhasil dihapus
        setTasks(tasks.filter(task => task.id !== taskId));
  
        // Reset editTask ke null setelah penghapusan
        setEditTask(null);
  
        alert('Task deleted successfully.');
      } catch (error) {
        console.error('Error deleting task:', error);
        alert(`Failed to delete task: ${error.message}`);
      }
    }
  };
  
  
  

  
  
  
  
 

  const pendingTasks = filteredTasks.filter(task => {
    console.log(`Filtering task with status: ${task.status}`);
    return task.status.toLowerCase() === 'pending' && task.ditugaskan_ke === user.ulid;
  });

  const inProgressTasks = filteredTasks.filter(task => {
    console.log(`Filtering task with status: ${task.status}`);
    return task.status === 'In Progress' && task.ditugaskan_ke === user.ulid;
  });

  const completedTasks = filteredTasks.filter(task => {
    console.log(`Filtering task with status: ${task.status}`);
    return task.status.toLowerCase() === 'completed' && task.ditugaskan_ke === user.ulid;
  });






  //Fungsi untuk Page di Table
  const [currentPage, setCurrentPage] = useState(1);
  const [tasksPerPage] = useState(10);

  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = tasks.slice(indexOfFirstTask, indexOfLastTask);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const pageNumbers = useMemo(() => {
    return Array.from({ length: Math.ceil(tasks.length / tasksPerPage) }, (_, i) => i + 1);
  }, [tasks.length, tasksPerPage]);


  function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

 // Filter tasks based on search term
 const filtereTasks = currentTasks.filter(task => {
  const { judul, ditugaskan_ke_object } = task;
  const firstName = ditugaskan_ke_object?.first_name || '';
  const lastName = ditugaskan_ke_object?.last_name || '';

  return (
    judul.toLowerCase().includes(searchTerm.toLowerCase()) ||
    firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lastName.toLowerCase().includes(searchTerm.toLowerCase())
  );
});


const getStatusClass = (status) => {
  switch (status) {
    case 'Pending':
      return 'status-pending';
    case 'In Progress':
      return 'status-in-progress';
    case 'Completed':
      return 'status-completed';
    default:
      return '';
  }
};

  return (
    <div className="row">
      <div className="col-xl-12">
        <div className="card custom-card">
          <div className="card-body p-1 justify-content-between">
            <div className="d-flex p-3 align-items-center justify-content-between">
              <div>
                <h6 className="card-title">Task List View</h6>
              </div>
              <div>
                <ul className="nav nav-tabs nav-tabs-header mb-0 d-sm-flex d-block ms-auto" role="tablist">
                  <li className="nav-item m-1">
                    <a
                      className={`nav-link text-dark ${activeTab === 'all-tasks' ? 'active' : ''}`}
                      data-bs-toggle="tab"
                      role="tab"
                      aria-current="page"
                      href="#all-tasks"
                      aria-selected={activeTab === 'all-tasks'}
                      onClick={() => handleTabClick('all-tasks')}
                    >
                      All Tasks
                    </a>
                  </li>
                  <li className="nav-item m-1">
                    <a
                      className={`nav-link text-dark ${activeTab === 'pending' ? 'active' : ''}`}
                      data-bs-toggle="tab"
                      role="tab"
                      aria-current="page"
                      href="#pending"
                      aria-selected={activeTab === 'pending'}
                      onClick={() => handleTabClick('pending')}
                    >
                      Pending
                    </a>
                  </li>
                  <li className="nav-item m-1">
                    <a
                      className={`nav-link text-dark ${activeTab === 'in_progress' ? 'active' : ''}`}
                      data-bs-toggle="tab"
                      role="tab"
                      aria-current="page"
                      href="#in_progress"
                      aria-selected={activeTab === 'in_progress'}
                      onClick={() => handleTabClick('in_progress')}
                    >
                      In Progress
                    </a>
                  </li>
                  <li className="nav-item m-1">
                    <a
                      className={`nav-link text-dark ${activeTab === 'completed' ? 'active' : ''}`}
                      data-bs-toggle="tab"
                      role="tab"
                      aria-current="page"
                      href="#completed"
                      aria-selected={activeTab === 'completed'}
                      onClick={() => handleTabClick('completed')}
                    >
                      Completed
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="tab-content task-tabs-container">
        <div className={`tab-pane p-0 ${activeTab === 'all-tasks' ? 'active' : ''}`} id="all-tasks" role="tabpanel">
          <div className="d-flex mt-4">
            {/* Card pertama */}
            <div className="card custom-card w-70 me-2"> {/* Gunakan 'me-2' untuk memberikan jarak antara dua card */}
              <div className="card-body">
                <div className="d-flex mb-3">
                  <input
                    type="text"
                    className="form-control form-control-sm w-auto mr-2"
                    placeholder="Search Task..."
                    value={searchTerm}
                    onChange={handleSearch}
                  />

                    <button
                      type="button"
                      className="btn btn-primary btn-wave"
                      data-bs-toggle="modal"
                      data-bs-target="#filterModal"
                    >
                      <i className="ri-filter-3-fill me-2 align-middle d-inline-block"></i>Filters
                    </button>
                  
                   {/* Bagian kanan: Filters */}
                  <div className="ms-auto">
                    <button
                    className="btn btn-primary ms-2"
                    data-bs-toggle="modal"
                    data-bs-target="#createTaskModal"
                  >
                    Create Task
                  </button>
                  </div>
                </div>
                <div className="table-responsive">
                  <table className="table table-bordered text-nowrap w-100">
                    <thead>
                      <tr>
                        <th style={{ width: '10%' }}>Task ID</th>
                        <th style={{ width: '20%' }}>Judul Task</th>
                        <th style={{ width: '20%' }}>Tanggal Mulai</th>
                        <th style={{ width: '20%' }}>Tanggal Selesai</th>
                        <th style={{ width: '10%' }}>Status</th>
                        <th style={{ width: '20%' }}>Ditugaskan Ke</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtereTasks.length > 0 ? (
                        filtereTasks.map((task) => {
                          const { first_name, last_name } = task.ditugaskan_ke_object;
                          const initials = `${first_name?.charAt(0) || ''}${last_name?.charAt(0) || ''}`;
                          const fullName = `${first_name || ''} ${last_name || ''}`;
                          const color = getRandomColor(); // Generate random color
                             // Check if the task is overdue
                          const isOverdue = new Date(task.tanggal_selesai) < new Date();
                          return (
                            <tr key={task.id}>
                              <td>{task.id}</td>
                              <td>{task.judul}</td>
                              <td>{task.tanggal_mulai}</td>
                              <td style={{ color: isOverdue ? 'red' : 'inherit' }}>
                                  {task.tanggal_selesai}
                              </td>
                              <td className={getStatusClass(task.status)}>
                                {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                              </td>
                              <td>
                                <div className="initials-circle" style={{ backgroundColor: color }}>
                                  {initials}
                                  <div className="tooltip">{fullName}</div>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan="6">No task data available</td>
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
              </div>
            </div>

              {/* Card kedua */}
            <div className="card custom-card w-50 ms-2">
              <div class="card custom-card">
                <div class="card-body p-0">
                  <div class="p-4 border-bottom border-block-end-dashed d-flex align-items-top">
                    <div class="svg-icon-background bg-primary-transparent me-4"> 
                        <svg xmlns="http://www.w3.org/2000/svg" data-name="Layer 1" viewBox="0 0 24 24" class="svg-primary"><path d="M13,16H7a1,1,0,0,0,0,2h6a1,1,0,0,0,0-2ZM9,10h2a1,1,0,0,0,0-2H9a1,1,0,0,0,0,2Zm12,2H18V3a1,1,0,0,0-.5-.87,1,1,0,0,0-1,0l-3,1.72-3-1.72a1,1,0,0,0-1,0l-3,1.72-3-1.72a1,1,0,0,0-1,0A1,1,0,0,0,2,3V19a3,3,0,0,0,3,3H19a3,3,0,0,0,3-3V13A1,1,0,0,0,21,12ZM5,20a1,1,0,0,1-1-1V4.73L6,5.87a1.08,1.08,0,0,0,1,0l3-1.72,3,1.72a1.08,1.08,0,0,0,1,0l2-1.14V19a3,3,0,0,0,.18,1Zm15-1a1,1,0,0,1-2,0V14h2Zm-7-7H7a1,1,0,0,0,0,2h6a1,1,0,0,0,0-2Z"/></svg>
                    </div> 
                    <div class="flex-fill">
                        <h6 class="mb-2 fs-12">All Tasks
                          <span class="badge bg-primary fw-semibold float-end">
                                    {tasks.length}
                          </span> 
                        </h6> 
                        <div class="pb-0 mt-0"> 
                          <div> 
                            <h4 class="fs-18 fw-semibold mb-2"><span class="count-up" data-count="42">{tasks.length}</span><span class="text-muted float-end fs-11 fw-normal">Last Year</span></h4> 
                            <p class="text-muted fs-11 mb-0 lh-1">
                              <span class="text-success me-1 fw-semibold">
                                  <i class="ri-arrow-up-s-line me-1 align-middle"></i>3.25%
                              </span>
                              <span>this month</span>
                            </p>
                          </div> 
                        </div> 
                      </div>
                    </div>
                    <div class="p-4 border-bottom border-block-end-dashed d-flex align-items-top">
                      <div class="svg-icon-background bg-success-transparent me-4"> 
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="svg-success"><path d="M11.5,20h-6a1,1,0,0,1-1-1V5a1,1,0,0,1,1-1h5V7a3,3,0,0,0,3,3h3v5a1,1,0,0,0,2,0V9s0,0,0-.06a1.31,1.31,0,0,0-.06-.27l0-.09a1.07,1.07,0,0,0-.19-.28h0l-6-6h0a1.07,1.07,0,0,0-.28-.19.29.29,0,0,0-.1,0A1.1,1.1,0,0,0,11.56,2H5.5a3,3,0,0,0-3,3V19a3,3,0,0,0,3,3h6a1,1,0,0,0,0-2Zm1-14.59L15.09,8H13.5a1,1,0,0,1-1-1ZM7.5,14h6a1,1,0,0,0,0-2h-6a1,1,0,0,0,0,2Zm4,2h-4a1,1,0,0,0,0,2h4a1,1,0,0,0,0-2Zm-4-6h1a1,1,0,0,0,0-2h-1a1,1,0,0,0,0,2Zm13.71,6.29a1,1,0,0,0-1.42,0l-3.29,3.3-1.29-1.3a1,1,0,0,0-1.42,1.42l2,2a1,1,0,0,0,1.42,0l4-4A1,1,0,0,0,21.21,16.29Z"/></svg>
                      </div> 
                      <div class="flex-fill">
                          <h6 class="mb-2 fs-12">Completed Tasks
                             <span class="badge bg-success fw-semibold float-end">
                                  {tasks.filter(i=>i.status === "Completed").length}
                              </span> 
                          </h6> 
                          <div> 
                            <h4 class="fs-18 fw-semibold mb-2"><span class="count-up" data-count="319">{tasks.filter(i=>i.status === "Completed").length}</span><span class="text-muted float-end fs-11 fw-normal">Last Year</span></h4> 
                            <p class="text-muted fs-11 mb-0 lh-1">
                                <span class="text-danger me-1 fw-semibold">
                                      <i class="ri-arrow-down-s-line me-1 align-middle"></i>1.16%
                                </span>
                                <span>this month</span>
                            </p>
                          </div> 
                        </div>
                      </div>
                      <div class="d-flex align-items-top p-4 border-bottom border-block-end-dashed">
                        <div class="svg-icon-background bg-warning-transparent me-4"> 
                            <svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" viewBox="0 0 24 24" class="svg-warning"><path d="M19,12h-7V5c0-0.6-0.4-1-1-1c-5,0-9,4-9,9s4,9,9,9s9-4,9-9C20,12.4,19.6,12,19,12z M12,19.9c-3.8,0.6-7.4-2.1-7.9-5.9C3.5,10.2,6.2,6.6,10,6.1V13c0,0.6,0.4,1,1,1h6.9C17.5,17.1,15.1,19.5,12,19.9z M15,2c-0.6,0-1,0.4-1,1v6c0,0.6,0.4,1,1,1h6c0.6,0,1-0.4,1-1C22,5.1,18.9,2,15,2z M16,8V4.1C18,4.5,19.5,6,19.9,8H16z"/></svg>
                        </div> 
                        <div class="flex-fill">
                            <h6 class="mb-2 fs-12">Pending Tasks
                                <span class="badge bg-warning fw-semibold float-end">
                                        {tasks.filter(i=>i.status === "Pending").length}
                                </span> 
                            </h6> 
                            <div> 
                              <h4 class="fs-18 fw-semibold mb-2"><span class="count-up" data-count="81">{tasks.filter(i=>i.status === "Pending").length}</span><span class="text-muted float-end fs-11 fw-normal">Last Year</span></h4> 
                              <p class="text-muted fs-11 mb-0 lh-1">
                                    <span class="text-success me-1 fw-semibold">
                                        <i class="ri-arrow-up-s-line me-1 align-middle"></i>0.25%
                                    </span>
                                    <span>this month</span>
                                </p>
                            </div> 
                          </div>
                        </div>
                        <div class="d-flex align-items-top p-4 border-bottom border-block-end-dashed">
                          <div class="svg-icon-background bg-secondary-transparent me-4"> 
                                <svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" viewBox="0 0 24 24" class="svg-secondary"><path d="M19,12h-7V5c0-0.6-0.4-1-1-1c-5,0-9,4-9,9s4,9,9,9s9-4,9-9C20,12.4,19.6,12,19,12z M12,19.9c-3.8,0.6-7.4-2.1-7.9-5.9C3.5,10.2,6.2,6.6,10,6.1V13c0,0.6,0.4,1,1,1h6.9C17.5,17.1,15.1,19.5,12,19.9z M15,2c-0.6,0-1,0.4-1,1v6c0,0.6,0.4,1,1,1h6c0.6,0,1-0.4,1-1C22,5.1,18.9,2,15,2z M16,8V4.1C18,4.5,19.5,6,19.9,8H16z"/></svg>
                          </div> 
                          <div class="flex-fill">
                              <h6 class="mb-2 fs-12">Inprogress Tasks
                                <span class="badge bg-secondary fw-semibold float-end">
                                  {tasks.filter(i=>i.status === "In Progress").length}
                                </span> 
                              </h6> 
                              <div>    
                                <h4 class="fs-18 fw-semibold mb-2"><span class="count-up" data-count="32">{tasks.filter(i=>i.status === "In Progress").length}</span><span class="text-muted float-end fs-11 fw-normal">Last Year</span></h4> 
                                <p class="text-muted fs-11 mb-0 lh-1">
                                  <span class="text-success me-1 fw-semibFold">
                                      <i class="ri-arrow-down-s-line me-1 align-middle"></i>0.46%
                                  </span>
                                  <span>this month</span>
                                </p>
                            </div> 
                          </div>
                      </div>
                      {/* Tugas Melewati Deadline */}
                      <div className="p-4 border-bottom border-block-end-dashed d-flex align-items-top">
                        <div className="svg-icon-background bg-danger-transparent me-4">
                        <svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" viewBox="0 0 24 24" class="svg-secondary"><path fill="red" d="M19,12h-7V5c0-0.6-0.4-1-1-1c-5,0-9,4-9,9s4,9,9,9s9-4,9-9C20,12.4,19.6,12,19,12z M12,19.9c-3.8,0.6-7.4-2.1-7.9-5.9C3.5,10.2,6.2,6.6,10,6.1V13c0,0.6,0.4,1,1,1h6.9C17.5,17.1,15.1,19.5,12,19.9z M15,2c-0.6,0-1,0.4-1,1v6c0,0.6,0.4,1,1,1h6c0.6,0,1-0.4,1-1C22,5.1,18.9,2,15,2z M16,8V4.1C18,4.5,19.5,6,19.9,8H16z"/></svg>

                        </div>
                        <div className="flex-fill">
                          <h6 className="mb-2 fs-12">Overdue Tasks
                            <span className="badge bg-danger fw-semibold float-end">
                              {tasks.filter(task => new Date(task.tanggal_selesai) < new Date().setHours(0, 0, 0, 0)).length              }
                            </span>
                          </h6>
                          <div>
                            <h4 className="fs-18 fw-semibold mb-2">
                              <span className="count-up" data-count="0">{tasks.filter(task => new Date(task.tanggal_selesai) < new Date().setHours(0, 0, 0, 0)).length
                              }</span>
                              <span className="text-muted float-end fs-11 fw-normal">Overdue</span>
                            </h4>
                          </div>
                        </div>
                      </div>
                    <div class="p-4 pb-2">
                          <p class="fs-15 fw-semibold">Tasks Statistics <span class="text-muted fw-normal">(Last 6 months) :</span></p>
                        <div id="task-list-stats"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        

          {/* Pending Tasks Tab */}
          <div className={`tab-pane p-0 ${activeTab === 'pending' ? 'active' : ''}`} id="pending" role="tabpanel">
            <div className="card custom-card mt-4">
              <div className="card-body">
                <div className="d-flex mb-3">
                  <input
                    type="text"
                    className="form-control form-control-sm w-auto mr-2"
                    placeholder="Search Task..."
                    value={searchTerm}
                    onChange={handleSearch}
                  />
                </div>
                <div className="row">
                  {pendingTasks.length > 0 ? (
                    pendingTasks.map((task) => {
                      // Mendapatkan data dari task
                      const { first_name: firstNameDitugaskanKe, last_name: lastNameDitugaskanKe } = task.ditugaskan_ke_object || {};
                      const { first_name: firstNamePemberiTugas, last_name: lastNamePemberiTugas } = task.pemberi_tugas_object || {};
                      
                      // Mengambil inisial dan nama lengkap
                      const initialsDitugaskanKe = `${firstNameDitugaskanKe?.charAt(0) || ''}${lastNameDitugaskanKe?.charAt(0) || ''}`;
                      const fullNameDitugaskanKe = `${firstNameDitugaskanKe || ''} ${lastNameDitugaskanKe || ''}`;
                      const colorDitugaskanKe = getRandomColor(initialsDitugaskanKe);
                      
                      const initialsPemberiTugas = `${firstNamePemberiTugas?.charAt(0) || ''}${lastNamePemberiTugas?.charAt(0) || ''}`;
                      const fullNamePemberiTugas = `${firstNamePemberiTugas || ''} ${lastNamePemberiTugas || ''}`;
                      const colorPemberiTugas = getRandomColor(initialsPemberiTugas);

                      return (
                        <div className="col-md-6 col-lg-4 col-xl-3" key={task.id}>
                          <div className="card mb-4">
                            <div className="card-body">
                              <div className="d-flex justify-content-between">
                                <div>
                                  <h6 className="fw-semibold mb-0">{task.judul}</h6>
                                  <p className="mb-0">Tanggal Mulai: <span className="fs-12 mb-1 text-muted">{task.tanggal_mulai}</span></p>
                                  <p className="mb-3">Tanggal Selesai: <span className="fs-12 text-muted">{task.tanggal_selesai}</span></p>
                                </div>
                                <div className="dropdown ms-2">
                                  <button className="btn btn-icon btn-secondary-light btn-sm btn-wave waves-light" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    <i className="ti ti-dots-vertical"></i>
                                  </button>
                                  <ul className="dropdown-menu">
                                    <li>
                                    <button className="dropdown-item" onClick={() => handleViewDetails(task)} data-bs-toggle="modal" data-bs-target="#detailTaskModal">View Details </button>
                                    </li>

                                    <li>      
                                      <button className="dropdown-item" data-bs-toggle="modal" data-bs-target="#editTaskModal" onClick={() => handleEditClick(task)}>Edit Task</button>
                                    </li>
                                    <li>      
                                      <button className="dropdown-item" onClick={() => handleDelete(task.id)}>Delete Task</button>
                                    </li>
                                  </ul>
                                </div>
                              </div>
                              <div className="d-flex justify-content-between align-items-center">
                                
                                <div className="d-flex align-items-center">
                                  <div className="initials-circle" style={{ backgroundColor: colorPemberiTugas }}>
                                      {initialsPemberiTugas}
                                      <div className="tooltip">{fullNamePemberiTugas}</div>
                                  </div>
                                  <div className="initials-circle" style={{ backgroundColor: colorDitugaskanKe }}>
                                      {initialsDitugaskanKe}
                                      <div className="tooltip">{fullNameDitugaskanKe}</div>
                                  </div>       
                                </div>
                                <div className="d-flex align-items-center">
                                  <span className="badge bg-danger">{task.status}</span>
                                  <span className={`badge bg-warning-transparent d-block`}>{task.urgensi}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="col-12">
                      <p>No pending tasks available</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

         {/* In Progress Tasks Tab */}
         <div className={`tab-pane p-0 ${activeTab === 'in_progress' ? 'active' : ''}`} id="in_progress" role="tabpanel">
          <div className="card custom-card mt-4">
            <div className="card-body">
              <div className="d-flex mb-3">
                <input
                  type="text"
                  className="form-control form-control-sm w-auto mr-2"
                  placeholder="Search Task..."
                  value={searchTerm}
                  onChange={handleSearch}
                />
              </div>
              <div className="row">
                {inProgressTasks.length > 0 ? (
                  inProgressTasks.map((task) => {
                       // Mendapatkan data dari task
                    const { first_name: firstNameDitugaskanKe, last_name: lastNameDitugaskanKe } = task.ditugaskan_ke_object || {};
                    const { first_name: firstNamePemberiTugas, last_name: lastNamePemberiTugas } = task.pemberi_tugas_object || {};
                    
                    // Mengambil inisial dan nama lengkap
                    const initialsDitugaskanKe = `${firstNameDitugaskanKe?.charAt(0) || ''}${lastNameDitugaskanKe?.charAt(0) || ''}`;
                    const fullNameDitugaskanKe = `${firstNameDitugaskanKe || ''} ${lastNameDitugaskanKe || ''}`;
                    const colorDitugaskanKe = getRandomColor(initialsDitugaskanKe);
                    
                    const initialsPemberiTugas = `${firstNamePemberiTugas?.charAt(0) || ''}${lastNamePemberiTugas?.charAt(0) || ''}`;
                    const fullNamePemberiTugas = `${firstNamePemberiTugas || ''} ${lastNamePemberiTugas || ''}`;
                    const colorPemberiTugas = getRandomColor(initialsPemberiTugas);

                    return (
                    <div className="col-md-6 col-lg-4 col-xl-3" key={task.id}>
                      <div className="card mb-4">
                        <div className="card-body">
                          <div className="d-flex justify-content-between">
                            <div>
                              <h6 className="fw-semibold mb-0">{task.judul}</h6>
                              <p className="mb-0">Tanggal Mulai: <span className="fs-12 mb-1 text-muted">{task.tanggal_mulai}</span></p>
                              <p className="mb-3">Tanggal Selesai: <span className="fs-12 text-muted">{task.tanggal_selesai}</span></p>
                            </div>
                            <div className="dropdown ms-2">
                              <button className="btn btn-icon btn-secondary-light btn-sm btn-wave waves-light" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    <i className="ti ti-dots-vertical"></i>
                              </button>
                                <ul className="dropdown-menu">
                                  <li>
                                    <button className="dropdown-item" onClick={() => handleViewDetails(task)} data-bs-toggle="modal" data-bs-target="#detailTaskModal">View Details </button>
                                  </li>
                                  <li>      
                                     <button className="dropdown-item" data-bs-toggle="modal" data-bs-target="#editTaskModal" onClick={() => handleEditClick(task)}>Edit Task</button>
                                  </li>
                                  <li>      
                                     <button className="dropdown-item" onClick={() => handleDelete(task.id)}>Delete Task</button>
                                  </li>
                                </ul>
                            </div>
                          </div>
                          <div className="d-flex justify-content-between align-items-center">
                              
                              <div className="d-flex align-items-center">
                                <div className="initials-circle" style={{ backgroundColor: colorPemberiTugas }}>
                                    {initialsPemberiTugas}
                                    <div className="tooltip">{fullNamePemberiTugas}</div>
                                </div>
                                <div className="initials-circle" style={{ backgroundColor: colorDitugaskanKe }}>
                                    {initialsDitugaskanKe}
                                    <div className="tooltip">{fullNameDitugaskanKe}</div>
                                </div>       
                              </div>
                              <div className="d-flex align-items-center">
                                <span className="badge bg-warning">{task.status}</span>
                                <span className={`badge bg-warning-transparent d-block`}>{task.urgensi}</span>
                              </div>
                            </div>
                        </div>
                      </div>
                    </div>
                    );
                  })
                ) : (
                  <div className="col-12">
                    <p>No pending tasks available</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      

       {/* completed Tasks Tab */}
       <div className={`tab-pane p-0 ${activeTab === 'completed' ? 'active' : ''}`} id="completed" role="tabpanel">
          <div className="card custom-card mt-4">
            <div className="card-body">
              <div className="d-flex mb-3">
                <input
                  type="text"
                  className="form-control form-control-sm w-auto mr-2"
                  placeholder="Search Task..."
                  value={searchTerm}
                  onChange={handleSearch}
                />
              </div>
              <div className="row">
                {completedTasks.length > 0 ? (
                  completedTasks.map((task) => {

                     // Mendapatkan data dari task
                     const { first_name: firstNameDitugaskanKe, last_name: lastNameDitugaskanKe } = task.ditugaskan_ke_object || {};
                     const { first_name: firstNamePemberiTugas, last_name: lastNamePemberiTugas } = task.pemberi_tugas_object || {};
                     
                     // Mengambil inisial dan nama lengkap
                     const initialsDitugaskanKe = `${firstNameDitugaskanKe?.charAt(0) || ''}${lastNameDitugaskanKe?.charAt(0) || ''}`;
                     const fullNameDitugaskanKe = `${firstNameDitugaskanKe || ''} ${lastNameDitugaskanKe || ''}`;
                     const colorDitugaskanKe = getRandomColor(initialsDitugaskanKe);
                     
                     const initialsPemberiTugas = `${firstNamePemberiTugas?.charAt(0) || ''}${lastNamePemberiTugas?.charAt(0) || ''}`;
                     const fullNamePemberiTugas = `${firstNamePemberiTugas || ''} ${lastNamePemberiTugas || ''}`;
                     const colorPemberiTugas = getRandomColor(initialsPemberiTugas);

                     return (
                    <div className="col-md-6 col-lg-4 col-xl-3" key={task.id}>
                      <div className="card mb-4">
                        <div className="card-body">
                          <div className="d-flex justify-content-between">
                            <div>
                              <h6 className="fw-semibold mb-0">{task.judul}</h6>
                              <p className="mb-0">Tanggal Mulai: <span className="fs-12 mb-1 text-muted">{task.tanggal_mulai}</span></p>
                              <p className="mb-3">Tanggal Selesai: <span className="fs-12 text-muted">{task.tanggal_selesai}</span></p>
                            </div>
                            <div className="dropdown ms-2">
                              <button className="btn btn-icon btn-secondary-light btn-sm btn-wave waves-light" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    <i className="ti ti-dots-vertical"></i>
                              </button>
                                <ul className="dropdown-menu">
                                  <li>
                                    <button className="dropdown-item" onClick={() => handleViewDetails(task)} data-bs-toggle="modal" data-bs-target="#detailTaskModal">View Details </button>
                                  </li>
                                  <li>      
                                     <button className="dropdown-item" data-bs-toggle="modal" data-bs-target="#editTaskModal" onClick={() => handleEditClick(task)}>Edit Task</button>
                                  </li>
                                  <li>      
                                     <button className="dropdown-item" onClick={() => handleDelete(task.id)}>Delete Task</button>
                                  </li>
                                </ul>
                            </div>
                          </div>
                          <div className="d-flex justify-content-between align-items-center">
                              
                              <div className="d-flex align-items-center">
                                <div className="initials-circle" style={{ backgroundColor: colorPemberiTugas }}>
                                    {initialsPemberiTugas}
                                    <div className="tooltip">{fullNamePemberiTugas}</div>
                                </div>
                                <div className="initials-circle" style={{ backgroundColor: colorDitugaskanKe }}>
                                    {initialsDitugaskanKe}
                                    <div className="tooltip">{fullNameDitugaskanKe}</div>
                                </div>       
                              </div>
                              <div className="d-flex align-items-center">
                                <span className="badge bg-primary">{task.status}</span>
                                <span className={`badge bg-warning-transparent d-block`}>{task.urgensi}</span>
                              </div>
                            </div>
                        </div>
                      </div>
                    </div>
                  );
                })
                ) : (
                  <div className="col-12">
                    <p>No pending tasks available</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Create Task */}
      <div
        className="modal fade"
        id="createTaskModal"
        tabIndex="-1"
        aria-labelledby="createTaskModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="createTaskModalLabel">Create Task</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label htmlFor="judul" className="form-label">Judul</label>
                <input
                  type="text"
                  className="form-control"
                  id="judul"
                  name="judul"
                  value={newTask.judul}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="deskripsi" className="form-label">Deskripsi</label>
                <textarea
                  type="text"
                  className="form-control"
                  id="deskripsi"
                  name="deskripsi"
                  value={newTask.deskripsi}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="tanggal_mulai" className="form-label">Tanggal Mulai</label>
                <input
                  type="date"
                  className="form-control"
                  id="tanggal_mulai"
                  name="tanggal_mulai"
                  value={newTask.tanggal_mulai}
                  onChange={handleInputChange}
                  onFocus={(e) => e.target.showPicker()}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="tanggal_selesai" className="form-label">Tanggal Selesai</label>
                <input
                  type="date"
                  className="form-control"
                  id="tanggal_selesai"
                  name="tanggal_selesai"
                  value={newTask.tanggal_selesai}
                  onChange={handleInputChange}
                  onFocus={(e) => e.target.showPicker()}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="status" className="form-label">Urgensi</label>
                <select
                  className="form-select"
                  id="urgensi"
                  name="urgensi"
                  value={newTask.urgensi}
                  onChange={handleInputChange}
                >
                  <option value="">Pilih Urgensi</option>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
              <div className="mb-3">
                <label htmlFor="ditugaskan_ke" className="form-label">Ditugaskan Ke</label>
                <select
                  className="form-select"
                  id="ditugaskan_ke"
                  name="ditugaskan_ke"
                  value={newTask.ditugaskan_ke.ulid}
                  onChange={handleInputChange}
                >
                  <option value="">Pilih Pengguna</option>
                  {assignedUsers.map(user => (
                    <option key={user.ulid} value={user.ulid}>
                      {user.first_name}
                    </option>
                  ))}
                </select>
                </div>

            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleCreateTask}
                data-bs-dismiss="modal"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      </div>

        {/* Modal Edit Task */}
      <div
        className="modal fade"
        id="editTaskModal"
        tabIndex="-1"
        aria-labelledby="editTaskModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="editTaskModalLabel">Edit Task</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              {editTask && (
                <>
                  <div className="mb-3">
                    <label htmlFor="editJudul" className="form-label">Judul</label>
                    <input
                      type="text"
                      className="form-control"
                      id="editJudul"
                      name="judul"
                      value={editTask.judul}
                      onChange={(e) => setEditTask({ ...editTask, judul: e.target.value })}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="editDeskrpisi" className="form-label">Deskripsi</label>
                    <textarea
                      type="text"
                      className="form-control"
                      id="editDeskrpisi"
                      name="deskripsi"
                      value={editTask.deskripsi}
                      onChange={(e) => setEditTask({ ...editTask, deskripsi: e.target.value })}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="editTanggalMulai" className="form-label">Tanggal Mulai</label>
                    <input
                      type="date"
                      className="form-control"
                      id="editTanggalMulai"
                      name="tanggal_mulai"
                      value={editTask.tanggal_mulai}
                      onChange={(e) => setEditTask({ ...editTask, tanggal_mulai: e.target.value })}
                      onFocus={(e) => e.target.showPicker()}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="editTanggalSelesai" className="form-label">Tanggal Selesai</label>
                    <input
                      type="date"
                      className="form-control"
                      id="editTanggalSelesai"
                      name="tanggal_selesai"
                      value={editTask.tanggal_selesai}
                      onChange={(e) => setEditTask({ ...editTask, tanggal_selesai: e.target.value })}
                      onFocus={(e) => e.target.showPicker()}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="editStatus" className="form-label">Status</label>
                    <select
                      className="form-select"
                      id="editStatus"
                      name="status"
                      value={editTask.status}
                      onChange={(e) => setEditTask({ ...editTask, status: e.target.value })}
                    >
                      <option value="">Pilih Status</option>
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="editDitugaskanKe" className="form-label">Ditugaskan Ke</label>
                    <select
                      className="form-select"
                      id="editDitugaskanKe"
                      name="ditugaskan_ke"
                      value={(typeof editTask.ditugaskan_ke  == 'string') ? editTask.ditugaskan_ke : editTask.ditugaskan_ke.ulid}
                      onChange={(e) => setEditTask({ ...editTask, ditugaskan_ke: e.target.value })}
                    >
                      <option value="">Pilih Pengguna</option>
                      {assignedUsers.map(user => (
                        <option key={user.ulid} value={user.ulid}>
                          {user.first_name}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              )}
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleEditTask}
                data-bs-dismiss="modal"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Filter */}
  <div className="modal fade" id="filterModal" tabIndex="-1" aria-labelledby="filterModalLabel" aria-hidden="true">
    <div className="modal-dialog">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title" id="filterModalLabel">Filter Tasks</h5>
          <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div className="modal-body">
          <form>
            <div className="mb-3">
              <label className="form-label">Status</label>
              <select className="form-select">
                <option value="">All</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">Urgensi</label>
              <select className="form-select">
                <option value="">All</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            {/* Filter by Assigned User */}
            <div className="mb-3">
                <label className="form-label">Ditugaskan Ke</label>
                <select
                  className="form-select"
                  value={assignedToFilter}
                  onChange={(e) => setAssignedToFilter(e.target.value)}
                >
                  <option value="">All</option>
                  {assignedUsers.map((user) => (
                    <option key={user.ulid} value={user.ulid}>
                      {user.first_name} {user.last_name}
                    </option>
                  ))}
                </select>
              </div>
          </form>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Clear</button>
          <button type="button" className="btn btn-primary">Apply</button>
        </div>
      </div>
    </div>
  </div>

  {/* Modal View Details */}
  <div className="modal fade" id="detailTaskModal" tabIndex="-1" aria-labelledby="detailTaskModalLabel" aria-hidden="true">
    <div className="modal-dialog">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title" id="detailTaskModalLabel">Detail Task</h5>
          <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
        <div className="modal-body">
          {selectedTask ? (
            <>
            <div className="task-details-card">
                <h2 className="task-title">{selectedTask.judul}</h2>

                <div className="task-giver">
                    <strong>Pemberi Tugas</strong>
                    <div className="circle-name">
                      {selectedTask.pemberi_tugas_object?.first_name.charAt(0)}
                    </div>
                    <p>{selectedTask.pemberi_tugas_object?.first_name} {selectedTask.pemberi_tugas_object?.last_name}</p>
                </div>

                <div className="task-info">
                  <p><strong>Deskripsi</strong></p>
                  <p className="task-description">{selectedTask.deskripsi}</p>
                </div>

                <div className="task-giver">
                    <strong>Ditugaskan Ke</strong>
                    <div className="circle-name2" >
                      {selectedTask.ditugaskan_ke_object?.first_name.charAt(0)}
                    </div>
                    <p>{selectedTask.ditugaskan_ke_object?.first_name} {selectedTask.ditugaskan_ke_object?.last_name}</p>
                  </div>

                <div className="task-dates">
                  <div className="task-date">
                    <span><strong>Tanggal Mulai</strong></span>
                    <span>{selectedTask.tanggal_mulai}</span>
                  </div>
                  <div className="task-date">
                    <span><strong>Tanggal Selesai</strong></span>
                    <span>{selectedTask.tanggal_selesai}</span>
                  </div>
                </div>
                <div className="task-meta">
                  <div className="task-status">
                    <strong>Status</strong>
                    <span 
                      style={{ marginLeft: '10px' }} 
                      className={`status-badge ${selectedTask.status.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      {selectedTask.status}
                    </span>
                  </div>
                </div>

                <div className="task-meta">
                  <div className="task-urgency" style={{ marginRight: '20px' }}>
                    <strong>Urgensi</strong>
                    <span style={{ marginLeft: '10px' }} className={`urgency-badge ${selectedTask.urgensi.toLowerCase().replace(/\s+/g, '-')}`}>
                      {selectedTask.urgensi}
                    </span>
                  </div>
                </div>
              </div>
              

              {/* Tambahkan detail lain yang ingin Anda tampilkan */}
            </>
          ) : (
            <p>Loading task details...</p>
          )}
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>      
        </div>
      </div>
    </div>
  </div>

</div>
    
  );
};

export default ListTask;
