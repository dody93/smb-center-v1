import React from 'react'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'

const Layout = ({children}) => {
  console.log('Rendering Layout'); // Tambahkan log untuk debugging
  return (
    <React.Fragment>
        <Navbar style={{minHeight:"150vh"}}/>
        <div className="navbar-custom columns mt-6" style={{minHeight:"100vh"}}> 
            <div className="column is-2">
                <Sidebar/>
            </div>
            <div className="column has-background-light">
                <main>{children}</main>
            </div>
        </div>
    </React.Fragment>
  )
}

export default Layout