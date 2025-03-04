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
import Guset_Entries from './Components/All_Users_Dashboard/guest_entries/Guset_Entries';
import House_list from './Components/All_Users_Dashboard/house_list/House_list';
import Attendance from './Components/All_Users_Dashboard/attendance/Attendance';
import Add_House from './Components/All_Users_Dashboard/house_list/Add_house/Add_House';
import Edit_House from './Components/All_Users_Dashboard/house_list/Edit_House/Edit_House';
import House_Info from './Components/All_Users_Dashboard/house_list/House_info/House_Info';
import AddPeopleEntry from './Components/All_Users_Dashboard/regular_entries/AddpeopleEntry/AddPeopleEntry';
import RegularEntries from './Components/All_Users_Dashboard/regular_entries/Regular_entries';
import EditPersonDetails from './Components/All_Users_Dashboard/regular_entries/editpersondetails/EditPersonDetails';
import PersonDetails from './Components/All_Users_Dashboard/regular_entries/persondetails/PersonDetails';
import Guard_Dashboard from './Components/Guard_Dashboard/Guard_Dashboard';
import UserAttendanceHistorty from './Components/All_Users_Dashboard/attendance/attendanceHistorty/UserAttendanceHistorty';
import Visitors_List from './Components/Guard_Dashboard/visitors_List/Visitors_List';
import Add_Visitors from './Components/Guard_Dashboard/Add_Visitors/Add_Visitors';
import Guest_Entries_info from './Components/All_Users_Dashboard/guest_entries/Guest_Entries_info';

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
          <Route path ="/type-of-entries" element= {<TypeOfEntryPage/>}/>
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
          <Route path="/regular-entries/:entryId" element={<RegularEntries />} />
          <Route path="/guest-entries" element={<Guset_Entries />} />
          <Route path="/house-list" element={<House_list />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/add-house" element={<Add_House />} />
          <Route path="/edit-house/:houseId" element={<Edit_House />} />
          <Route path="/house-info/:houseId" element={<House_Info />} />
          <Route path="/add-person/:entryId" element={<AddPeopleEntry/>} />
          <Route path="/edit-person/:personId" element={<EditPersonDetails />} />
          <Route path="/person-details/:personId" element={<PersonDetails/>} />
          <Route path="/guard-dashboard" element={<Guard_Dashboard />} />
          <Route path="/user-attendance-history" element={<UserAttendanceHistorty />} />
          <Route path="/visitors_list" element={<Visitors_List/>} />
          <Route path="/add_visitor" element={<Add_Visitors/>} />
          <Route path="/visitor-details/:entryId" element={<Guest_Entries_info/>} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
