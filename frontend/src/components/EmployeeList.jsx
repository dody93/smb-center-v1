import React from 'react'


const EmployeeList = () => {
  return (
    <div class="row">
                    <div class="col-xl-12">
                        <div class="card custom-card">
                            <div class="card-header">
                                <div class="card-title">
                                    Management Karyawan 
                                </div>
                            </div>
                            <div class="card-body">
                                <div class="table-responsive">
                                    <div class="text-center">
                                        <a href="/addemployee" class="btn btn-primary mb-2 data-table-btn">+ Tambah Karyawan</a>
                                    </div>
                                    <table id="add-row" class="table table-bordered text-nowrap w-100">
                                        <thead>
                                            <tr>
                                                <th>No</th>
                                                <th>Nama</th>
                                                <th>Nomor Telepon</th>
                                                <th>Tanggal Bekerja</th>
                                                <th>Status</th>
                                                <th>Jabatan</th>
                                            </tr>
                                        </thead>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
  )
}

export default EmployeeList