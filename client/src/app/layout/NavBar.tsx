
import { Group } from "@mui/icons-material";
import { Box, AppBar, Toolbar, Container, Typography, MenuItem, MenuList } from "@mui/material";
import { NavLink } from "react-router";
import MenuItemLink from "../shared/componets/MenuItemLink";

export default function NavBar() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ backgroundImage: 'linear-gradient(135deg, #182a73 0%, #218aae 85%)' }}>
        <Container maxWidth="xl">
          <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Box >
              <MenuList sx={{ display: 'flex' }}>
                <MenuItem component={NavLink} to="/">
                  <Group fontSize="large" />
                  <Typography variant="h4" sx={{ textTransform: 'capitalize' }}>
                    Reactivities
                  </Typography>
                </MenuItem>
              </MenuList>
            </Box>
            <Box >
              <MenuList sx={{ display: 'flex' }}>
                <MenuItemLink to="/activities" >
                Activites
                </MenuItemLink>
                <MenuItemLink
                   to='/createActivity'
                >
                 Create Activities
                </MenuItemLink>
              </MenuList>
            </Box>
            <MenuList>
              <MenuItem
              >
                user menu
              </MenuItem>
            </MenuList>

          </Toolbar>
        </Container>
      </AppBar>
    </Box>
  );
}
