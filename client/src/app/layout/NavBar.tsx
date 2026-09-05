
import { Group } from "@mui/icons-material";
import { Box, AppBar, Toolbar, Container, Typography, MenuItem, MenuList, LinearProgress } from "@mui/material";
import { NavLink } from "react-router";
import MenuItemLink from "../shared/componets/MenuItemLink";
import { Observer } from "mobx-react-lite";
import { useStore } from "../../lib/hooks/useStore";

export default function NavBar() {
  const { uiStore } = useStore();
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static"
        sx={{
          backgroundImage: 'linear-gradient(135deg, #182a73 0%, #218aae 85%)',
          position: 'relative'
        }}>
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
                <MenuItemLink
                  to='/counter'
                >
                  Counter
                </MenuItemLink>
                <MenuItemLink
                  to='/errors'
                >
                  Errors
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
        <Observer>
          {() => uiStore.isLoading ? (
            <LinearProgress
              color="secondary"
              sx={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: 4
              }}
            />
          ) : null}
        </Observer>

      </AppBar>
    </Box>
  );
}
