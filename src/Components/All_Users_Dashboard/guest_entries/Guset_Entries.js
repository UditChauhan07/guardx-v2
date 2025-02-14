import React, { useState } from 'react'
import Navbar from '../../Navbar/Navbar'
import Sidebar from '../../SuperAdminDashboard/sidebar/Sidebar'
const Guset_Entries = () => {
  const [moduleTitle, setModuleTitle] = useState('Guest Entries');
  const handleSidebarClick = (title) => {
    setModuleTitle(title);  
  };
  return (
    <div>
    <Navbar moduleTitle={moduleTitle} />
    <Sidebar onClick={handleSidebarClick} />
    </div>
  )
}

export default Guset_Entries
