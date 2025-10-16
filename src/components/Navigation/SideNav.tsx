/* eslint-disable @typescript-eslint/ban-ts-comment */

import { DRAWER_WIDTH } from "../../utils/constants/sidenav";
import { MenuIcon, UserIcon, LogOut } from "lucide-react";
import { navigateTo } from "../../services/navigateService";
import { protected_routes } from "../../routes/routes";
import { useAuthContext } from "../../hooks/useAuth";
import { useLocation } from "react-router-dom";
import { useLogout } from "../../hooks/useAuthHook";
import { useSnackbar } from "../../context/SnackBarContext";
import AppBar from "@mui/material/AppBar";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import React, { useState } from "react";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

interface Props {
  window?: () => Window;
}

export default function ResponsiveDrawer(props: Props) {
  const { window } = props;
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [isClosing, setIsClosing] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { mutateAsync, isPending: isLoggingOut } = useLogout();
  const { showSnackbar } = useSnackbar();
  const { user, logout } = useAuthContext();
  const location = useLocation();

  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
  };

  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen);
    }
  };

  const handleNavigate = (path: string) => () => navigateTo(path);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleProfile = () => {
    handleCloseUserMenu();
    navigateTo("/profile");
  };

  const handleLogout = async () => {
    try {
      await mutateAsync();
      handleCloseUserMenu();
      logout();
      navigateTo("/login");
      showSnackbar("Logged out successfully", "success");
    } catch (error) {
      console.error("Failed to logout:", error);
      showSnackbar("Failed to logout", "error");
    }
  };


  const filteredRoutes = () => {
    return protected_routes.map((route) => {
      const { allowedRoles = [] } = route;
      if(user && !!allowedRoles.length && allowedRoles.includes(user?.user_role as string)) {
        return route
      }

      if(allowedRoles.length <= 0 ) {
        return route
      }

      return null
    }).filter(Boolean);
  }

  const drawer = (
    <div>
      <Toolbar>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <UserIcon />
          <Typography variant="h6" noWrap component="div">
            User Portal
          </Typography>
        </Box>
      </Toolbar>
      <Divider />
      <List>
        {filteredRoutes()
          .filter((route) => route?.inMenu)
          .map((route, index) => {
            const isActive = location.pathname === route?.path;
            return (
              <ListItem key={index} disablePadding>
                <ListItemButton
                  onClick={handleNavigate(route?.path as string)}
                  selected={isActive}
                  sx={{
                    borderColor: "primary.main",
                    "&.Mui-selected": {
                      backgroundColor: "rgba(25, 118, 210, 0.08)",
                      "&:hover": {
                        backgroundColor: "rgba(25, 118, 210, 0.12)",
                      },
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{ color: isActive ? "primary.main" : "inherit" }}
                  >
                    {
                      // @ts-ignore
                      <route.icon />
                    }
                  </ListItemIcon>
                  <ListItemText
                    primary={route?.name}
                    primaryTypographyProps={{
                      fontWeight: isActive ? 600 : 400,
                      color: isActive ? "primary.main" : "inherit",
                    }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
      </List>
    </div>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` },
          ml: { sm: `${DRAWER_WIDTH}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box sx={{ display: { xs: "none", md: "block" } }}>
              <Typography
                variant="body2"
                sx={{ fontWeight: 500 }}
                align="right"
              >
                {user?.first_name ?? ""} {user?.last_name ?? ""}
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.8 }} align="right">
                {user?.email}
              </Typography>
            </Box>
            <Tooltip title="Account settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar
                  alt={`${user?.first_name} ${user?.last_name}`}
                  sx={{ width: 40, height: 40 }}
                >
                  {user?.first_name?.charAt(0).toUpperCase()}
                </Avatar>
              </IconButton>
            </Tooltip>
          </Box>

          <Menu
            sx={{ mt: "45px" }}
            id="menu-appbar"
            anchorEl={anchorElUser}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={Boolean(anchorElUser)}
            onClose={handleCloseUserMenu}
          >
            <Box sx={{ px: 2, py: 1 }}>
              <Typography variant="subtitle2">
                {user?.first_name} {user?.last_name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {user?.email}
              </Typography>
            </Box>
            <Divider />
            <MenuItem onClick={handleProfile}>
              <ListItemIcon>
                <UserIcon size={20} />
              </ListItemIcon>
              <ListItemText>Profile</ListItemText>
            </MenuItem>
            <MenuItem onClick={handleLogout} disabled={isLoggingOut}>
              <ListItemIcon>
                <LogOut size={20} />
              </ListItemIcon>
              <ListItemText>
                {isLoggingOut ? "Logging out..." : "Logout"}
              </ListItemText>
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: DRAWER_WIDTH }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onTransitionEnd={handleDrawerTransitionEnd}
          onClose={handleDrawerClose}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: DRAWER_WIDTH,
            },
          }}
          slotProps={{
            root: {
              keepMounted: true,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: DRAWER_WIDTH,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
    </>
  );
}