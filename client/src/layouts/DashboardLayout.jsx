import { useState } from "react";
import { Box, Toolbar } from "@mui/material";
import { Outlet } from "react-router-dom";
import Sidebar, {
  DRAWER_WIDTH,
  DRAWER_COLLAPSED,
} from "./components/Sidebar.jsx";
import Topbar from "./components/Topbar.jsx";
import logo from "../assets/Quetzal.png";

export default function DashboardLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const drawerWidth = collapsed ? DRAWER_COLLAPSED : DRAWER_WIDTH;

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar
        open={mobileOpen}
        collapsed={collapsed}
        onClose={() => setMobileOpen(false)}
      />
      <Topbar
        sidebarOpen={mobileOpen}
        collapsed={collapsed}
        onToggleSidebar={() => setMobileOpen((prev) => !prev)}
        onToggleCollapse={() => setCollapsed((prev) => !prev)}
      />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          transition: "width 225ms cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        <Toolbar />
        <Box sx={{ position: "relative", minHeight: "calc(100vh - 64px)" }}>
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              pointerEvents: "none",
              zIndex: 0,
            }}
          >
            <Box
              component="img"
              src={logo}
              alt=""
              sx={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                opacity: 0.3,
              }}
            />
          </Box>
          <Box sx={{ position: "relative", zIndex: 1 }}>
            <Outlet />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
