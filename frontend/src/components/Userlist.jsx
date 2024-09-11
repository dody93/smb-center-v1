import React from 'react'
import '../styles/custome.css';

const Userlist = () => {
  return (
    <div>
        <h1 className='userlist-text'>Profile</h1>
        <h2 className='subtitle'>List of Users</h2>
        <table className='table is-striped is-fullwidth'>
            <thead>
                <tr>
                    <th>No</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
            </tbody>
        </table>
    </div>
  )
}

export default Userlist