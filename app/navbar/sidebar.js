import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import SearchIcon from '@mui/icons-material/Search';
import { Box, Drawer, List, ListItem, ListItemIcon, ListItemText, Toolbar } from '@mui/material';
import Link from 'next/link';

const drawerWidth = 240;

const SideBar = () => {
  return (
    <Box sx={{ display: 'flex' }}>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            <Link href="/">
              <ListItem button sx={{ justifyContent: 'center' }}>
                <ListItemIcon sx={{ fontSize: 32 }}>
                  <HomeIcon />
                </ListItemIcon>
                <ListItemText primary="Home" />
              </ListItem>
            </Link>
            <ListItem button sx={{ justifyContent: 'center' }}>
            <ListItemIcon sx={{ fontSize: 32 }}>
                <SearchIcon />
            </ListItemIcon>
            <ListItemText primary="Search" />
            </ListItem>
            <Link href="/login">
              <ListItem button sx={{ justifyContent: 'center' }}>
                <ListItemIcon sx={{ fontSize: 32 }}>
                  <PersonIcon />
                </ListItemIcon>
                <ListItemText primary="Sign In" />
              </ListItem>
            </Link>
          </List>
        </Box>
      </Drawer>
    </Box>
  );
};

export default SideBar;
