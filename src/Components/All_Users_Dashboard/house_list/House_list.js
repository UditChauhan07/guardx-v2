import React, { useState } from 'react'
import Navbar from '../../Navbar/Navbar'
import Sidebar from '../../SuperAdminDashboard/sidebar/Sidebar'
const House_list = () => {
  const [moduleTitle, setModuleTitle] = useState('House List');
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

export default House_list
