import React, { useState } from 'react'
import Navbar from '../../Navbar/Navbar'
import Sidebar from '../../SuperAdminDashboard/sidebar/Sidebar'
const Regular_entries = () => {
  const [moduleTitle, setModuleTitle] = useState('Regular Entries');
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

export default Regular_entries
