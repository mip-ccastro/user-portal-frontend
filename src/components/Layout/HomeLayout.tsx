import { Box, Toolbar } from "@mui/material";
import { DRAWER_WIDTH } from "../../utils/constants/sidenav";
import { Outlet } from "react-router-dom";
import ResponsiveDrawer from "../Navigation/SideNav";

const HomeLayout = () => {
  return (
    <Box sx={{ display: 'flex' }}>
      <ResponsiveDrawer/>
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` } }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};

export default HomeLayout;
