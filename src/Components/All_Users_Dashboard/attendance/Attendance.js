import React, { useState } from 'react'
import Navbar from '../../Navbar/Navbar'
import Sidebar from '../../SuperAdminDashboard/sidebar/Sidebar'

const Attendance = () => {
  const [moduleTitle, setModuleTitle] = useState('Attendance');
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

export default Attendance
