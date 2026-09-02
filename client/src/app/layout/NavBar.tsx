
import { Group } from "@mui/icons-material";
import { Box, AppBar, Toolbar, Button, Container, Typography} from "@mui/material";

type Props = {
  openForm: () => void;
};

export default function NavBar({ openForm }: Props) {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ backgroundImage: 'linear-gradient(135deg, #182a73 0%, #218aae 85%)' }}>
        <Container maxWidth="xl">
          <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex'}}>
              <Button sx={{ display: 'flex', gap: 2, color: 'white' }} >
              <Group fontSize="large" />
              <Typography variant="h4"  sx={{ textTransform: 'capitalize' }}>
                Reactivities
              </Typography>  
            </Button>
            </Box>
            <Box sx={{ display: 'flex', gap: 0 }}>
              <Button sx={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'white' }}>
                Activities 
              </Button>
              <Button sx={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'white' }}>
                About 
              </Button>
              <Button sx={{ fontSize: '1.2rem', textTransform: 'uppercase', fontWeight: 'bold', color: 'white' }}>
                Contact 
              </Button> 
            </Box>
            <Button size="large" variant="contained" color="warning" onClick={openForm}>
              Create Activity
            </Button>            
          </Toolbar>
        </Container>        
      </AppBar>
    </Box>
  );
}
