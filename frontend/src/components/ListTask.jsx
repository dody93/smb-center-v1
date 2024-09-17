import React, { useState, useEffect } from 'react';
//import Logo from '../Logo.png'; // Pastikan pathnya benar

const ListTask = () => {
  const [tasks, setTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all-tasks');
  const [editTask, setEditTask] = useState(null); // Menyimpan task yang sedang di-edit


  // State untuk form input
  const [newTask, setNewTask] = useState({
    judul: '',
    tanggal_mulai: '',
    tanggal_selesai: '',
    status: 'Pending',
    ditugaskan_ke: '',
    urgensi: '', // Nilai default
  });
  

  const [assignedUsers, setAssignedUsers] = useState([]); // State untuk pengguna yang ditugaskan

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

    fetchTasks();
    fetchUsers();
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
  
  
  

  const pendingTasks = filteredTasks.filter(task => {
    console.log(`Filtering task with status: ${task.status}`);
    return task.status.toLowerCase() === 'pending';
  });

  return (
    <div className="row">
      <div className="col-xl-12">
        <div className="card custom-card">
          <div className="card-body p-0">
            <div className="d-flex p-3 align-items-center justify-content-between">
              <div>
                <h6 className="fw-semibold mb-0">Tasks</h6>
              </div>
              <div>
                <ul className="nav nav-tabs nav-tabs-header mb-0 d-sm-flex d-block" role="tablist">
                  <li className="nav-item m-1">
                    <a
                      className={`nav-link ${activeTab === 'all-tasks' ? 'active' : ''}`}
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
                      className={`nav-link ${activeTab === 'pending' ? 'active' : ''}`}
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
                      className={`nav-link ${activeTab === 'in-progress' ? 'active' : ''}`}
                      data-bs-toggle="tab"
                      role="tab"
                      aria-current="page"
                      href="#in-progress"
                      aria-selected={activeTab === 'in-progress'}
                      onClick={() => handleTabClick('in-progress')}
                    >
                      In Progress
                    </a>
                  </li>
                  <li className="nav-item m-1">
                    <a
                      className={`nav-link ${activeTab === 'completed' ? 'active' : ''}`}
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
                <button
                  className="btn btn-primary ms-2"
                  data-bs-toggle="modal"
                  data-bs-target="#createTaskModal"
                >
                  Create Task
                </button>
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
                    {filteredTasks.length > 0 ? (
                      filteredTasks.map((task) => (
                        <tr key={task.id}>
                          <td>{task.id}</td>
                          <td>{task.judul}</td>
                          <td>{task.tanggal_mulai}</td>
                          <td>{task.tanggal_selesai}</td>
                          <td>{task.status}</td>
                          <td>{task.ditugaskan_ke.first_name}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6">No task data available</td>
                      </tr>
                    )}
                  </tbody>
                </table>
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
                  pendingTasks.map((task) => (
                    <div className="col-md-6 col-lg-4 col-xl-3" key={task.id}>
                      <div className="card mb-4">
                        <div className="card-body">
                          <div className="d-flex justify-content-between">
                            <div>
                              <h6 className="fw-semibold mb-0">{task.judul}</h6>
                              <p className="mb-0">Tanggal Mulai: <span className="fs-12 mb-1 text-muted">{task.tanggal_mulai}</span></p>
                              <p className="mb-3">Tanggal Selesai: <span className="fs-12 text-muted">{task.tanggal_selesai}</span></p>
                            </div>
                            <div class="btn-list">
                                  <button class="btn btn-sm btn-icon btn-wave btn-primary-light" data-bs-toggle="modal" data-bs-target="#editTaskModal" onClick={() => handleEditClick(task)}><i class="ri-edit-line"></i></button>
                                  <button class="btn btn-sm btn-icon btn-wave btn-danger-light me-0"><i class="ri-delete-bin-line"></i></button>
                            </div>
                          </div>
                          <div className="d-flex justify-content-between align-items-center">
                            <span className="badge bg-danger">{task.status}</span>
                            <div>
                            
                                <span class="badge bg-warning-transparent d-block">{task.urgensi}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
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
                <label htmlFor="tanggal_mulai" className="form-label">Tanggal Mulai</label>
                <input
                  type="date"
                  className="form-control"
                  id="tanggal_mulai"
                  name="tanggal_mulai"
                  value={newTask.tanggal_mulai}
                  onChange={handleInputChange}
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


        {/* Modal Edit Task */}
<div
  className="modal fade"
  id="editTaskModal"
  tabIndex="-1"
  aria-labelledby="editTaskModalLabel"
  aria-hidden="true"
>
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
                    <label htmlFor="editTanggalMulai" className="form-label">Tanggal Mulai</label>
                    <input
                      type="date"
                      className="form-control"
                      id="editTanggalMulai"
                      name="tanggal_mulai"
                      value={editTask.tanggal_mulai}
                      onChange={(e) => setEditTask({ ...editTask, tanggal_mulai: e.target.value })}
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
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="editUrgensi" className="form-label">Urgensi</label>
                    <select
                      className="form-select"
                      id="editUrgensi"
                      name="urgensi"
                      value={editTask.urgensi}
                      onChange={(e) => setEditTask({ ...editTask, urgensi: e.target.value })}
                    >
                      <option value="">Pilih Urgensi</option>
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="editDitugaskanKe" className="form-label">Ditugaskan Ke</label>
                    <select
                      className="form-select"
                      id="editDitugaskanKe"
                      name="ditugaskan_ke"
                      value={editTask.ditugaskan_ke}
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
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
</div>

      </div>
    </div>
  );
};

export default ListTask;
