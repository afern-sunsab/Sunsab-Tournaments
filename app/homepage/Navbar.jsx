import { AppBar, Box, Button, Toolbar } from '@mui/material';

const HomepageNavbar = () => {
  const handleScroll = (sectionId) => {
    document.getElementById(sectionId).scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <AppBar position="sticky" color="primary" sx={{ top: 0 }}>
      <Toolbar>
        <Box sx={{ flexGrow: 1 }}>
          <Button color="inherit" onClick={() => handleScroll('events-header')}>
            Home
          </Button>
          <Button color="inherit" onClick={() => handleScroll('create-event')}>
            Create Event
          </Button>
          <Button color="inherit" onClick={() => handleScroll('show-event')}>
            Events
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default HomepageNavbar;
