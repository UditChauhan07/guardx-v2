import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from "./Components/login/Login";
import Register from "./Components/register/Register";
import { ToastContainer } from 'react-toastify';
import Dashboard from "./Components/SuperAdminDashboard/Dashboard/Dashboard";
import Society from "./Components/SuperAdminDashboard/Society/Society";
import AddSociety from "./Components/SuperAdminDashboard/Society/addsociety/AddSociety";
import SocietyDetails from "./Components/SuperAdminDashboard/Society/SocietyDetailes/SocietyDetails";
import EditSociety from "./Components/SuperAdminDashboard/Society/EditSociety/EditSociety"; 
import TypeOfEntryPage from './Components/SuperAdminDashboard/Entry/TypeOfEntryPage';
import AddEntryPage from './Components/SuperAdminDashboard/Entry/add entry/AddEntryPage';
import EditEntry from './Components/SuperAdminDashboard/Entry/editentry/EditEntry';
import EditProfile from './Components/Navbar/edit profile/EditProfile';
import AllPurposes from './Components/SuperAdminDashboard/purpose/AllPurposes';
import Addpurpose from './Components/SuperAdminDashboard/purpose/addPurpose/Addpurpose';
import EditPurpose from './Components/SuperAdminDashboard/purpose/editPurpose/EditPurpose';
import AllRoles from './Components/SuperAdminDashboard/Roles/AllRoles';
import AddRole from './Components/SuperAdminDashboard/Roles/addRole/AddRole';
import EditRole from './Components/SuperAdminDashboard/Roles/editRole/EditRole';
import AllUsers from './Components/SuperAdminDashboard/Users/AllUsers';
import AddUser from './Components/SuperAdminDashboard/Users/Adduser/AddUser';
import EditUser from './Components/SuperAdminDashboard/Users/EditUser/EditUser';
import EditSocietyUser from './Components/SuperAdminDashboard/Society/EditSociety/EditSocietyUser/EditSocietyUser';

function App() {
  return (
    <>
      <ToastContainer />
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/register" element={<Register />} />
          <Route path="/society" element={<Society />} />
          <Route path="/add-society" element={<AddSociety />} />
          <Route path="/society-details/:id" element={<SocietyDetails />} />
          <Route path="/edit-society/:id" element={<EditSociety />} /> 
          <Route path="/edit-profile" element={<EditProfile />} />
          <Route path = "/type-of-entries" element= {<TypeOfEntryPage/>}/>
          <Route path="/add-entry" element={<AddEntryPage />} />
          <Route path="/edit-entry/:id" element={<EditEntry />} />
          <Route path="/purpose" element={<AllPurposes />} />
          <Route path="/add-purpose" element={<Addpurpose />} />
          <Route path="/edit-purpose/:id" element={<EditPurpose />} />
          <Route path="/roles" element={<AllRoles />} />
          <Route path="/add-role" element={<AddRole />} />
          <Route path="/edit-role/:id" element={<EditRole />} />
          <Route path="/users" element={<AllUsers />} />
          <Route path="/add-user" element={<AddUser />} />
          <Route path="/edit-user/:id" element={<EditUser />} />
          <Route path='/edit-society-user/:id' element= {<EditSocietyUser/>}></Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
