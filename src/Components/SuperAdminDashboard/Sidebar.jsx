import React from "react";
import { List, ListItem, ListItemIcon, ListItemText, Box } from "@mui/material";
import { MdDashboard, MdPeople, MdList, MdSubscriptions } from "react-icons/md";
import "./Sidebar.css";

const Sidebar = () => {
  return (
    <Box className="sidebar">
      <Box className="sidebar-header">
        <h1 className="sidebar-logo">GuardX</h1>
      </Box>
      <List>
        {[
          { label: "Dashboard", icon: <MdDashboard /> },
          { label: "Society", icon: <MdPeople /> },
          { label: "Type of Entries", icon: <MdList /> },
          { label: "Subscription", icon: <MdSubscriptions /> },
        ].map((item, index) => (
          <ListItem button key={index} className="menu-item">
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default Sidebar;
