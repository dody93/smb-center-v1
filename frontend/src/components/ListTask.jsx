import React from 'react';
import Logo from '../Logo.png'; // Pastikan pathnya benar

const ListTask = () => {

return (
<div class="row">
    <div class="col-xl-12">
        <div class="card custom-card">
            <div class="card-body p-0">
                <div class="d-flex p-3 align-items-center justify-content-between">
                    <div>
                        <h6 class="fw-semibold mb-0">Tasks</h6>
                    </div>
                    <div>
                        <ul class="nav nav-tabs nav-tabs-header mb-0 d-sm-flex d-block" role="tablist">
                            <li class="nav-item m-1">
                                <a class="nav-link active" data-bs-toggle="tab" role="tab" aria-current="page"
                                href="#all-tasks" aria-selected="true">All Tasks</a>
                            </li>
                            <li class="nav-item m-1">
                                <a class="nav-link" data-bs-toggle="tab" role="tab" aria-current="page"
                                href="#pending" aria-selected="true">Pending</a>
                            </li>
                            <li class="nav-item m-1">
                                <a class="nav-link" data-bs-toggle="tab" role="tab" aria-current="page"
                                href="#in-progress" aria-selected="true">In Progress</a>
                            </li>
                            <li class="nav-item m-1">
                                <a class="nav-link" data-bs-toggle="tab" role="tab" aria-current="page"
                                href="#completed" aria-selected="true">Completed</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            
        </div>
    </div>
    <div class="tab-content task-tabs-container">
                                    <div class="tab-pane show active p-0" id="all-tasks"
                                        role="tabpanel">
                                        <div class="row" id="tasks-container">
                                            <div class="col-xl-4 task-card">
                                                <div class="card custom-card task-pending-card">
                                                    <div class="card-body">
                                                        <div class="d-flex justify-content-between flex-wrap gap-2">
                                                            <div>
                                                                <p class="fw-semibold mb-3 d-flex align-items-center"><a href="!#"><i class="ri-star-s-fill fs-16 op-5 me-1 text-muted"></i></a>New Project Blueprint</p>
                                                                <p class="mb-3">Assigned On : <span class="fs-12 mb-1 text-muted">13,Nov 2022</span></p>
                                                                <p class="mb-3">Target Date : <span class="fs-12 mb-1 text-muted">20,Nov 2022</span></p>
                                                                <p class="mb-0">Assigned To :
                                                                    <span class="avatar-list-stacked ms-1">
                                                                        <span class="avatar avatar-sm avatar-rounded">
                                                                        <img src={Logo} alt="logo" className="desktop-logo" />
                                                                        </span>
                                                                        <span class="avatar avatar-sm avatar-rounded">
                                                                           <img src={Logo} alt="logo" className="desktop-logo" />
                                                                        </span>
                                                                        <span class="avatar avatar-sm avatar-rounded">
                                                                        <img src={Logo} alt="logo" className="desktop-logo" />
                                                                        </span>
                                                                        <span class="avatar avatar-sm avatar-rounded">
                                                                        <img src={Logo} alt="logo" className="desktop-logo" />
                                                                        </span>
                                                                    </span>
                                                                </p>
                                                            </div>
                                                            <div>
                                                                <div class="btn-list">
                                                                    <button class="btn btn-sm btn-icon btn-wave btn-primary-light"><i class="ri-edit-line"></i></button>
                                                                    <button class="btn btn-sm btn-icon btn-wave btn-danger-light me-0"><i class="ri-delete-bin-line"></i></button>
                                                                </div>
                                                                <span class="badge bg-warning-transparent d-block">High</span>
                                                            </div>
                                                        </div> 
                                                    </div>
                                                </div>
                                                <div class="card custom-card task-inprogress-card">
                                                    <div class="card-body">
                                                        <div class="d-flex justify-content-between flex-wrap gap-2">
                                                            <div>
                                                                <p class="fw-semibold mb-3 d-flex align-items-center"><a href="!#"><i class="ri-star-s-fill fs-16 me-1 text-warning"></i></a>Designing New Authentication Pages</p>
                                                                <p class="mb-3">Assigned On : <span class="fs-12 mb-1 text-muted">26,Nov 2022</span></p>
                                                                <p class="mb-3">Target Date : <span class="fs-12 mb-1 text-muted">12,Dec 2022</span></p>
                                                                <p class="mb-0">Assigned To :
                                                                    <span class="avatar-list-stacked ms-1">
                                                                        <span class="avatar avatar-sm avatar-rounded">
                                                                        <img src={Logo} alt="logo" className="desktop-logo" />
                                                                        </span>
                                                                        <span class="avatar avatar-sm avatar-rounded">
                                                                        <img src={Logo} alt="logo" className="desktop-logo" />
                                                                        </span>
                                                                    </span>
                                                                </p>
                                                            </div>
                                                            <div>
                                                                <div class="btn-list">
                                                                    <button class="btn btn-sm btn-icon btn-wave btn-primary-light"><i class="ri-edit-line"></i></button>
                                                                    <button class="btn btn-sm btn-icon btn-wave btn-danger-light me-0"><i class="ri-delete-bin-line"></i></button>
                                                                </div>
                                                                <span class="badge bg-success-transparent d-block">Low</span>
                                                            </div>
                                                        </div> 
                                                    </div>
                                                </div>
                                                <div class="card custom-card task-completed-card">
                                                    <div class="card-body">
                                                        <div class="d-flex justify-content-between flex-wrap gap-2">
                                                            <div>
                                                                <p class="fw-semibold mb-3 d-flex align-items-center">
                                                                    <a href="!#"><i class="ri-star-s-fill fs-16 op-5 me-1 text-muted"></i></a>Developing New Events in Plugin</p>
                                                                <p class="mb-3">Assigned On : <span class="fs-12 mb-1 text-muted">5,Dec 2022</span></p>
                                                                <p class="mb-3">Target Date : <span class="fs-12 mb-1 text-muted">10,Dec 2022</span></p>
                                                                <p class="mb-0">Assigned To :
                                                                    <span class="avatar-list-stacked ms-1">
                                                                        <span class="avatar avatar-sm avatar-rounded">
                                                                        <img src={Logo} alt="logo" className="desktop-logo" />
                                                                        </span>
                                                                        <span class="avatar avatar-sm avatar-rounded">
                                                                        <img src={Logo} alt="logo" className="desktop-logo" />
                                                                        </span>
                                                                        <span class="avatar avatar-sm avatar-rounded">
                                                                        <img src={Logo} alt="logo" className="desktop-logo" />
                                                                        </span>
                                                                    </span>
                                                                </p>
                                                            </div>
                                                            <div>
                                                                <div class="btn-list">
                                                                    <button class="btn btn-sm btn-icon btn-wave btn-primary-light"><i class="ri-edit-line"></i></button>
                                                                    <button class="btn btn-sm btn-icon btn-wave btn-danger-light me-0"><i class="ri-delete-bin-line"></i></button>
                                                                </div>
                                                                <span class="badge bg-primary-transparent d-block">Medium</span>
                                                            </div>
                                                        </div> 
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-xl-4 task-card">
                                                <div class="card custom-card task-inprogress-card">
                                                    <div class="card-body">
                                                        <div class="d-flex justify-content-between flex-wrap gap-2">
                                                            <div>
                                                                <p class="fw-semibold mb-3 d-flex align-items-center"><a href="!#"><i class="ri-star-s-fill fs-16 me-1 text-warning"></i></a>Design New Landing Pages </p>
                                                                <p class="mb-3">Assigned On : <span class="fs-12 mb-1 text-muted">21,Nov 2022</span></p>
                                                                <p class="mb-3">Target Date : <span class="fs-12 mb-1 text-muted">28,Nov 2022</span></p>
                                                                <p class="mb-0">Assigned To :
                                                                    <span class="avatar-list-stacked ms-1">
                                                                        <span class="avatar avatar-sm avatar-rounded">
                                                                        <img src={Logo} alt="logo" className="desktop-logo" />
                                                                        </span>
                                                                        <span class="avatar avatar-sm avatar-rounded">
                                                                        <img src={Logo} alt="logo" className="desktop-logo" />
                                                                        </span>
                                                                        <span class="avatar avatar-sm avatar-rounded">
                                                                        <img src={Logo} alt="logo" className="desktop-logo" />
                                                                        </span>
                                                                    </span>
                                                                </p>
                                                            </div>
                                                            <div>
                                                                <div class="btn-list">
                                                                    <button class="btn btn-sm btn-icon btn-wave btn-primary-light"><i class="ri-edit-line"></i></button>
                                                                    <button class="btn btn-sm btn-icon btn-wave btn-danger-light me-0"><i class="ri-delete-bin-line"></i></button>
                                                                </div>
                                                                <span class="badge bg-primary-transparent d-block">Medium</span>
                                                            </div>
                                                        </div> 
                                                    </div>
                                                </div>
                                                <div class="card custom-card task-completed-card">
                                                    <div class="card-body">
                                                        <div class="d-flex justify-content-between flex-wrap gap-2">
                                                            <div>
                                                                <p class="fw-semibold mb-3 d-flex align-items-center"><a href="!#"><i class="ri-star-s-fill fs-16 op-5 me-1 text-muted"></i></a>New Plugin Development</p>
                                                                <p class="mb-3">Assigned On : <span class="fs-12 mb-1 text-muted">28,Oct 2022</span></p>
                                                                <p class="mb-3">Target Date : <span class="fs-12 mb-1 text-muted">28,Nov 2022</span></p>
                                                                <p class="mb-0">Assigned To :
                                                                    <span class="avatar-list-stacked ms-1">
                                                                        <span class="avatar avatar-sm avatar-rounded">
                                                                        <img src={Logo} alt="logo" className="desktop-logo" />
                                                                        </span>
                                                                        <span class="avatar avatar-sm avatar-rounded">
                                                                        <img src={Logo} alt="logo" className="desktop-logo" />
                                                                        </span>
                                                                        <span class="avatar avatar-sm avatar-rounded">
                                                                        <img src={Logo} alt="logo" className="desktop-logo" />
                                                                        </span>
                                                                    </span>
                                                                </p>
                                                            </div>
                                                            <div>
                                                                <div class="btn-list">
                                                                    <button class="btn btn-sm btn-icon btn-wave btn-primary-light"><i class="ri-edit-line"></i></button>
                                                                    <button class="btn btn-sm btn-icon btn-wave btn-danger-light me-0"><i class="ri-delete-bin-line"></i></button>
                                                                </div>
                                                                <span class="badge bg-success-transparent d-block">Low</span>
                                                            </div>
                                                        </div> 
                                                    </div>
                                                </div>
                                                <div class="card custom-card task-completed-card">
                                                    <div class="card-body">
                                                        <div class="d-flex justify-content-between flex-wrap gap-2">
                                                            <div>
                                                                <p class="fw-semibold mb-3 d-flex align-items-center"><a href="!#"><i class="ri-star-s-fill fs-16 op-5 me-1 text-muted"></i></a>Documentation For New Template</p>
                                                                <p class="mb-3">Assigned On : <span class="fs-12 mb-1 text-muted">25,Nov 2022</span></p>
                                                                <p class="mb-3">Target Date : <span class="fs-12 mb-1 text-muted">10,Dec 2022</span></p>
                                                                <p class="mb-0">Assigned To :
                                                                    <span class="avatar-list-stacked ms-1">
                                                                        <span class="avatar avatar-sm avatar-rounded">
                                                                        <img src={Logo} alt="logo" className="desktop-logo" />
                                                                        </span>
                                                                        <span class="avatar avatar-sm avatar-rounded">
                                                                        <img src={Logo} alt="logo" className="desktop-logo" />
                                                                        </span>
                                                                        <span class="avatar avatar-sm avatar-rounded">
                                                                        <img src={Logo} alt="logo" className="desktop-logo" />
                                                                        </span>
                                                                    </span>
                                                                </p>
                                                            </div>
                                                            <div>
                                                                <div class="btn-list">
                                                                    <button class="btn btn-sm btn-icon btn-wave btn-primary-light"><i class="ri-edit-line"></i></button>
                                                                    <button class="btn btn-sm btn-icon btn-wave btn-danger-light me-0"><i class="ri-delete-bin-line"></i></button>
                                                                </div>
                                                                <span class="badge bg-danger-transparent d-block">Critical</span>
                                                            </div>
                                                        </div> 
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-xl-4 task-card">
                                                <div class="card custom-card task-pending-card">
                                                    <div class="card-body">
                                                        <div class="d-flex justify-content-between flex-wrap gap-2">
                                                            <div>
                                                                <p class="fw-semibold mb-3 d-flex align-items-center">
                                                                    <a href="!#"><i class="ri-star-s-fill fs-16 me-1 text-warning"></i></a>Updating Old Ui</p>
                                                                <p class="mb-3">Assigned On : <span class="fs-12 mb-1 text-muted">30,Nov 2022</span></p>
                                                                <p class="mb-3">Target Date : <span class="fs-12 mb-1 text-muted">05,Dec 2022</span></p>
                                                                <p class="mb-0">Assigned To :
                                                                    <span class="avatar-list-stacked ms-1">
                                                                        <span class="avatar avatar-sm avatar-rounded">
                                                                        <img src={Logo} alt="logo" className="desktop-logo" />
                                                                        </span>
                                                                        <span class="avatar avatar-sm avatar-rounded">
                                                                        <img src={Logo} alt="logo" className="desktop-logo" />
                                                                        </span>
                                                                        <span class="avatar avatar-sm avatar-rounded">
                                                                        <img src={Logo} alt="logo" className="desktop-logo" />
                                                                        </span>
                                                                        <span class="avatar avatar-sm avatar-rounded">
                                                                        <img src={Logo} alt="logo" className="desktop-logo" />
                                                                        </span>
                                                                    </span>
                                                                </p>
                                                            </div>
                                                            <div>
                                                                <div class="btn-list">
                                                                    <button class="btn btn-sm btn-icon btn-wave btn-primary-light"><i class="ri-edit-line"></i></button>
                                                                    <button class="btn btn-sm btn-icon btn-wave btn-danger-light me-0"><i class="ri-delete-bin-line"></i></button>
                                                                </div>
                                                                <span class="badge bg-warning-transparent d-block">High</span>
                                                            </div>
                                                        </div> 
                                                    </div>
                                                </div>
                                                <div class="card custom-card task-completed-card">
                                                    <div class="card-body">
                                                        <div class="d-flex justify-content-between flex-wrap gap-2">
                                                            <div>
                                                                <p class="fw-semibold mb-3 d-flex align-items-center"><a href="!#"><i class="ri-star-s-fill fs-16 op-5 me-1 text-muted"></i></a>Designing Of New Ecommerce Pages</p>
                                                                <p class="mb-3">Assigned On : <span class="fs-12 mb-1 text-muted">1,Dec 2022</span></p>
                                                                <p class="mb-3">Target Date : <span class="fs-12 mb-1 text-muted">15,Dec 2022</span></p>
                                                                <p class="mb-0">Assigned To :
                                                                    <span class="avatar-list-stacked ms-1">
                                                                        <span class="avatar avatar-sm avatar-rounded">
                                                                        <img src={Logo} alt="logo" className="desktop-logo" />
                                                                        </span>
                                                                        <span class="avatar avatar-sm avatar-rounded">
                                                                        <img src={Logo} alt="logo" className="desktop-logo" />
                                                                        </span>
                                                                        <span class="avatar avatar-sm avatar-rounded">
                                                                        <img src={Logo} alt="logo" className="desktop-logo" />
                                                                        </span>
                                                                    </span>
                                                                </p>
                                                            </div>
                                                            <div>
                                                                <div class="btn-list">
                                                                    <button class="btn btn-sm btn-icon btn-wave btn-primary-light"><i class="ri-edit-line"></i></button>
                                                                    <button class="btn btn-sm btn-icon btn-wave btn-danger-light me-0"><i class="ri-delete-bin-line"></i></button>
                                                                </div>
                                                                <span class="badge bg-success-transparent d-block">Low</span>
                                                            </div>
                                                        </div> 
                                                    </div>
                                                </div>
                                                <div class="card custom-card task-inprogress-card">
                                                    <div class="card-body">
                                                        <div class="d-flex justify-content-between flex-wrap gap-2">
                                                            <div>
                                                                <p class="fw-semibold mb-3 d-flex align-items-center"><a href="!#"><i class="ri-star-s-fill fs-16 me-1 text-warning"></i></a>Improving Ui Of Updated Templates</p>
                                                                <p class="mb-3">Assigned On : <span class="fs-12 mb-1 text-muted">4,Dec 2022</span></p>
                                                                <p class="mb-3">Target Date : <span class="fs-12 mb-1 text-muted">20,Dec 2022</span></p>
                                                                <p class="mb-0">Assigned To :
                                                                    <span class="avatar-list-stacked ms-1">
                                                                        <span class="avatar avatar-sm avatar-rounded">
                                                                        <img src={Logo} alt="logo" className="desktop-logo" />
                                                                        </span>
                                                                        <span class="avatar avatar-sm avatar-rounded">
                                                                        <img src={Logo} alt="logo" className="desktop-logo" />
                                                                        </span>
                                                                    </span>
                                                                </p>
                                                            </div>
                                                            <div>
                                                                <div class="btn-list">
                                                                    <button class="btn btn-sm btn-icon btn-wave btn-primary-light"><i class="ri-edit-line"></i></button>
                                                                    <button class="btn btn-sm btn-icon btn-wave btn-danger-light me-0"><i class="ri-delete-bin-line"></i></button>
                                                                </div>
                                                                <span class="badge bg-primary-transparent d-block">Medium</span>
                                                            </div>
                                                        </div> 
                                                    </div>
                                                </div>
                                            </div>
                                        </div>    
                                    </div>
                                    <div class="tab-pane p-0" id="pending"
                                        role="tabpanel">
                                        <div class="row">
                                            <div class="col-xl-4">
                                                <div class="card custom-card task-pending-card">
                                                    <div class="card-body">
                                                        <div class="d-flex justify-content-between flex-wrap gap-2">
                                                            <div>
                                                                <p class="fw-semibold mb-3 d-flex align-items-center"><a href="!#"><i class="ri-star-s-fill fs-16 op-5 me-1 text-muted"></i></a>New Project Blueprint</p>
                                                                <p class="mb-3">Assigned On : <span class="fs-12 mb-1 text-muted">13,Nov 2022</span></p>
                                                                <p class="mb-3">Target Date : <span class="fs-12 mb-1 text-muted">20,Nov 2022</span></p>
                                                                <p class="mb-0">Assigned To :
                                                                    <span class="avatar-list-stacked ms-1">
                                                                        <span class="avatar avatar-sm avatar-rounded">
                                                                        <img src={Logo} alt="logo" className="desktop-logo" />
                                                                        </span>
                                                                        <span class="avatar avatar-sm avatar-rounded">
                                                                        <img src={Logo} alt="logo" className="desktop-logo" />
                                                                        </span>
                                                                        <span class="avatar avatar-sm avatar-rounded">
                                                                        <img src={Logo} alt="logo" className="desktop-logo" />
                                                                        </span>
                                                                        <span class="avatar avatar-sm avatar-rounded">
                                                                        <img src={Logo} alt="logo" className="desktop-logo" />
                                                                        </span>
                                                                    </span>
                                                                </p>
                                                            </div>
                                                            <div>
                                                                <div class="btn-list">
                                                                    <button class="btn btn-sm btn-icon btn-wave btn-primary-light"><i class="ri-edit-line"></i></button>
                                                                    <button class="btn btn-sm btn-icon btn-wave btn-danger-light me-0"><i class="ri-delete-bin-line"></i></button>
                                                                </div>
                                                                <span class="badge bg-warning-transparent d-block">High</span>
                                                            </div>
                                                        </div> 
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-xl-4">
                                                <div class="card custom-card task-pending-card">
                                                    <div class="card-body">
                                                        <div class="d-flex justify-content-between flex-wrap gap-2">
                                                            <div>
                                                                <p class="fw-semibold mb-3 d-flex align-items-center">
                                                                    <a href="!#"><i class="ri-star-s-fill fs-16 me-1 text-warning"></i></a>Updating Old Ui</p>
                                                                <p class="mb-3">Assigned On : <span class="fs-12 mb-1 text-muted">30,Nov 2022</span></p>
                                                                <p class="mb-3">Target Date : <span class="fs-12 mb-1 text-muted">05,Dec 2022</span></p>
                                                                <p class="mb-0">Assigned To :
                                                                    <span class="avatar-list-stacked ms-1">
                                                                        <span class="avatar avatar-sm avatar-rounded">
                                                                        <img src={Logo} alt="logo" className="desktop-logo" />
                                                                        </span>
                                                                        <span class="avatar avatar-sm avatar-rounded">
                                                                        <img src={Logo} alt="logo" className="desktop-logo" />
                                                                        </span>
                                                                        <span class="avatar avatar-sm avatar-rounded">
                                                                        <img src={Logo} alt="logo" className="desktop-logo" />
                                                                        </span>
                                                                        <span class="avatar avatar-sm avatar-rounded">
                                                                        <img src={Logo} alt="logo" className="desktop-logo" />
                                                                        </span>
                                                                    </span>
                                                                </p>
                                                            </div>
                                                            <div>
                                                                <div class="btn-list">
                                                                    <button class="btn btn-sm btn-icon btn-wave btn-primary-light"><i class="ri-edit-line"></i></button>
                                                                    <button class="btn btn-sm btn-icon btn-wave btn-danger-light me-0"><i class="ri-delete-bin-line"></i></button>
                                                                </div>
                                                                <span class="badge bg-warning-transparent d-block">High</span>
                                                            </div>
                                                        </div> 
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="tab-pane p-0" id="in-progress"
                                        role="tabpanel">
                                        <div class="row">
                                            <div class="col-xl-4">
                                                <div class="card custom-card task-inprogress-card">
                                                    <div class="card-body">
                                                        <div class="d-flex justify-content-between flex-wrap gap-2">
                                                            <div>
                                                                <p class="fw-semibold mb-3 d-flex align-items-center"><a href="!#"><i class="ri-star-s-fill fs-16 me-1 text-warning"></i></a>Design New Landing Pages </p>
                                                                <p class="mb-3">Assigned On : <span class="fs-12 mb-1 text-muted">21,Nov 2022</span></p>
                                                                <p class="mb-3">Target Date : <span class="fs-12 mb-1 text-muted">28,Nov 2022</span></p>
                                                                <p class="mb-0">Assigned To :
                                                                   <span class="avatar-list-stacked ms-1">
                                                                        <span class="avatar avatar-sm avatar-rounded">
                                                                        <img src={Logo} alt="logo" className="desktop-logo" />
                                                                        </span>
                                                                        <span class="avatar avatar-sm avatar-rounded">
                                                                        <img src={Logo} alt="logo" className="desktop-logo" />
                                                                        </span>
                                                                    </span>
                                                                </p>
                                                            </div>
                                                            <div>
                                                                <div class="btn-list">
                                                                    <button class="btn btn-sm btn-icon btn-wave btn-primary-light"><i class="ri-edit-line"></i></button>
                                                                    <button class="btn btn-sm btn-icon btn-wave btn-danger-light me-0"><i class="ri-delete-bin-line"></i></button>
                                                                </div>
                                                                <span class="badge bg-primary-transparent d-block">Medium</span>
                                                            </div>
                                                        </div> 
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-xl-4">
                                                <div class="card custom-card task-inprogress-card">
                                                    <div class="card-body">
                                                        <div class="d-flex justify-content-between flex-wrap gap-2">
                                                            <div>
                                                                <p class="fw-semibold mb-3 d-flex align-items-center"><a href="!#"><i class="ri-star-s-fill fs-16 me-1 text-warning"></i></a>Designing New Authentication Pages</p>
                                                                <p class="mb-3">Assigned On : <span class="fs-12 mb-1 text-muted">26,Nov 2022</span></p>
                                                                <p class="mb-3">Target Date : <span class="fs-12 mb-1 text-muted">12,Dec 2022</span></p>
                                                                <p class="mb-0">Assigned To :
                                                                    <span class="avatar-list-stacked ms-1">
                                                                        <span class="avatar avatar-sm avatar-rounded">
                                                                        <img src={Logo} alt="logo" className="desktop-logo" />
                                                                        </span>
                                                                        <span class="avatar avatar-sm avatar-rounded">
                                                                        <img src={Logo} alt="logo" className="desktop-logo" />
                                                                        </span>
                                                                    </span>
                                                                </p>
                                                            </div>
                                                            <div>
                                                                <div class="btn-list">
                                                                    <button class="btn btn-sm btn-icon btn-wave btn-primary-light"><i class="ri-edit-line"></i></button>
                                                                    <button class="btn btn-sm btn-icon btn-wave btn-danger-light me-0"><i class="ri-delete-bin-line"></i></button>
                                                                </div>
                                                                <span class="badge bg-success-transparent d-block">Low</span>
                                                            </div>
                                                        </div> 
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-xl-4">
                                                <div class="card custom-card task-inprogress-card">
                                                    <div class="card-body">
                                                        <div class="d-flex justify-content-between flex-wrap gap-2">
                                                            <div>
                                                                <p class="fw-semibold mb-3 d-flex align-items-center"><a href="!#"><i class="ri-star-s-fill fs-16 me-1 text-warning"></i></a>Improving Ui Of Updated Templates</p>
                                                                <p class="mb-3">Assigned On : <span class="fs-12 mb-1 text-muted">4,Dec 2022</span></p>
                                                                <p class="mb-3">Target Date : <span class="fs-12 mb-1 text-muted">20,Dec 2022</span></p>
                                                                <p class="mb-0">Assigned To :
                                                                    <span class="avatar-list-stacked ms-1">
                                                                        <span class="avatar avatar-sm avatar-rounded">
                                                                        <img src={Logo} alt="logo" className="desktop-logo" />
                                                                        </span>
                                                                        <span class="avatar avatar-sm avatar-rounded">
                                                                        <img src={Logo} alt="logo" className="desktop-logo" />
                                                                        </span>
                                                                    </span>
                                                                </p>
                                                            </div>
                                                            <div>
                                                                <div class="btn-list">
                                                                    <button class="btn btn-sm btn-icon btn-wave btn-primary-light"><i class="ri-edit-line"></i></button>
                                                                    <button class="btn btn-sm btn-icon btn-wave btn-danger-light me-0"><i class="ri-delete-bin-line"></i></button>
                                                                </div>
                                                                <span class="badge bg-primary-transparent d-block">Medium</span>
                                                            </div>
                                                        </div> 
                                                    </div>
                                                </div>
                                            </div>
                                        </div>    
                                    </div>
                                    <div class="tab-pane p-0" id="completed"
                                        role="tabpanel">
                                        <div class="row">
                                            <div class="col-xl-4">
                                                <div class="card custom-card task-completed-card">
                                                    <div class="card-body">
                                                        <div class="d-flex justify-content-between flex-wrap gap-2">
                                                            <div>
                                                                <p class="fw-semibold mb-3 d-flex align-items-center"><a href="!#"><i class="ri-star-s-fill fs-16 op-5 me-1 text-muted"></i></a>New Plugin Development</p>
                                                                <p class="mb-3">Assigned On : <span class="fs-12 mb-1 text-muted">28,Oct 2022</span></p>
                                                                <p class="mb-3">Target Date : <span class="fs-12 mb-1 text-muted">28,Nov 2022</span></p>
                                                                <p class="mb-0">Assigned To :
                                                                    <span class="avatar-list-stacked ms-1">
                                                                        <span class="avatar avatar-sm avatar-rounded">
                                                                        <img src={Logo} alt="logo" className="desktop-logo" />
                                                                        </span>
                                                                        <span class="avatar avatar-sm avatar-rounded">
                                                                        <img src={Logo} alt="logo" className="desktop-logo" />
                                                                        </span>
                                                                        <span class="avatar avatar-sm avatar-rounded">
                                                                        <img src={Logo} alt="logo" className="desktop-logo" />
                                                                        </span>
                                                                    </span>
                                                                </p>
                                                            </div>
                                                            <div>
                                                                <div class="btn-list">
                                                                    <button class="btn btn-sm btn-icon btn-wave btn-primary-light"><i class="ri-edit-line"></i></button>
                                                                    <button class="btn btn-sm btn-icon btn-wave btn-danger-light me-0"><i class="ri-delete-bin-line"></i></button>
                                                                </div>
                                                                <span class="badge bg-success-transparent d-block">Low</span>
                                                            </div>
                                                        </div> 
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-xl-4">
                                                <div class="card custom-card task-completed-card">
                                                    <div class="card-body">
                                                        <div class="d-flex justify-content-between flex-wrap gap-2">
                                                            <div>
                                                                <p class="fw-semibold mb-3 d-flex align-items-center"><a href="!#"><i class="ri-star-s-fill fs-16 op-5 me-1 text-muted"></i></a>Documentation For New Template</p>
                                                                <p class="mb-3">Assigned On : <span class="fs-12 mb-1 text-muted">25,Nov 2022</span></p>
                                                                <p class="mb-3">Target Date : <span class="fs-12 mb-1 text-muted">10,Dec 2022</span></p>
                                                                <p class="mb-0">Assigned To :
                                                                    <span class="avatar-list-stacked ms-1">
                                                                        <span class="avatar avatar-sm avatar-rounded">
                                                                        <img src={Logo} alt="logo" className="desktop-logo" />
                                                                        </span>
                                                                        <span class="avatar avatar-sm avatar-rounded">
                                                                        <img src={Logo} alt="logo" className="desktop-logo" />
                                                                        </span>
                                                                        <span class="avatar avatar-sm avatar-rounded">
                                                                        <img src={Logo} alt="logo" className="desktop-logo" />
                                                                        </span>
                                                                    </span>
                                                                </p>
                                                            </div>
                                                            <div>
                                                                <div class="btn-list">
                                                                    <button class="btn btn-sm btn-icon btn-wave btn-primary-light"><i class="ri-edit-line"></i></button>
                                                                    <button class="btn btn-sm btn-icon btn-wave btn-danger-light me-0"><i class="ri-delete-bin-line"></i></button>
                                                                </div>
                                                                <span class="badge bg-danger-transparent d-block">Critical</span>
                                                            </div>
                                                        </div> 
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-xl-4">
                                                <div class="card custom-card task-completed-card">
                                                    <div class="card-body">
                                                        <div class="d-flex justify-content-between flex-wrap gap-2">
                                                            <div>
                                                                <p class="fw-semibold mb-3 d-flex align-items-center">
                                                                    <a href="!#"><i class="ri-star-s-fill fs-16 op-5 me-1 text-muted"></i></a>Developing New Events in Plugin</p>
                                                                <p class="mb-3">Assigned On : <span class="fs-12 mb-1 text-muted">5,Dec 2022</span></p>
                                                                <p class="mb-3">Target Date : <span class="fs-12 mb-1 text-muted">10,Dec 2022</span></p>
                                                                <p class="mb-0">Assigned To :
                                                                    <span class="avatar-list-stacked ms-1">
                                                                        <span class="avatar avatar-sm avatar-rounded">
                                                                        <img src={Logo} alt="logo" className="desktop-logo" />
                                                                        </span>
                                                                        <span class="avatar avatar-sm avatar-rounded">
                                                                        <img src={Logo} alt="logo" className="desktop-logo" />
                                                                        </span>
                                                                        <span class="avatar avatar-sm avatar-rounded">
                                                                        <img src={Logo} alt="logo" className="desktop-logo" />
                                                                        </span>
                                                                    </span>
                                                                </p>
                                                            </div>
                                                            <div>
                                                                <div class="btn-list">
                                                                    <button class="btn btn-sm btn-icon btn-wave btn-primary-light"><i class="ri-edit-line"></i></button>
                                                                    <button class="btn btn-sm btn-icon btn-wave btn-danger-light me-0"><i class="ri-delete-bin-line"></i></button>
                                                                </div>
                                                                <span class="badge bg-primary-transparent d-block">Medium</span>
                                                            </div>
                                                        </div> 
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-xl-4">
                                                <div class="card custom-card task-completed-card">
                                                    <div class="card-body">
                                                        <div class="d-flex justify-content-between flex-wrap gap-2">
                                                            <div>
                                                                <p class="fw-semibold mb-3 d-flex align-items-center"><a href="!#"><i class="ri-star-s-fill fs-16 op-5 me-1 text-muted"></i></a>Designing Of New Ecommerce Pages</p>
                                                                <p class="mb-3">Assigned On : <span class="fs-12 mb-1 text-muted">1,Dec 2022</span></p>
                                                                <p class="mb-3">Target Date : <span class="fs-12 mb-1 text-muted">15,Dec 2022</span></p>
                                                                <p class="mb-0">Assigned To :
                                                                    <span class="avatar-list-stacked ms-1">
                                                                        <span class="avatar avatar-sm avatar-rounded">
                                                                        <img src={Logo} alt="logo" className="desktop-logo" />
                                                                        </span>
                                                                        <span class="avatar avatar-sm avatar-rounded">
                                                                        <img src={Logo} alt="logo" className="desktop-logo" />
                                                                        </span>
                                                                        <span class="avatar avatar-sm avatar-rounded">
                                                                        <img src={Logo} alt="logo" className="desktop-logo" />
                                                                        </span>
                                                                    </span>
                                                                </p>
                                                            </div>
                                                            <div>
                                                                <div class="btn-list">
                                                                    <button class="btn btn-sm btn-icon btn-wave btn-primary-light"><i class="ri-edit-line"></i></button>
                                                                    <button class="btn btn-sm btn-icon btn-wave btn-danger-light me-0"><i class="ri-delete-bin-line"></i></button>
                                                                </div>
                                                                <span class="badge bg-success-transparent d-block">Low</span>
                                                            </div>
                                                        </div> 
                                                    </div>
                                                </div>
                                            </div>
                                        </div>    
                                    </div>
                                </div>  
</div>


    )
  }

export default ListTask