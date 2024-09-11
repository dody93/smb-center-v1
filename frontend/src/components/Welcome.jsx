import React, { useState,useEffect } from 'react';

const Welcome = () => {
const [user, setUser] = useState(null);
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
  return (
    <div class="row">
        <div class="d-md-flex d-block align-items-center justify-content-between my-4 page-header-breadcrumb">
                    <div>
                        <p class="fw-semibold fs-18 mb-0">Welcome back, {user?.first_name || 'Loading...'} !</p>
                        <span class="fs-semibold text-muted">Track your sales activity, leads and deals here.</span>
                    </div>
                   
                </div>
      
  </div>
    )
  }

export default Welcome