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
        </Routes>
      </Router>
    </>
  );
}

export default App;
