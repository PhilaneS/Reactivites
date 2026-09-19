
import { Group } from "@mui/icons-material";
import { Box, AppBar, Toolbar, Container, Typography, MenuItem, MenuList, CircularProgress } from "@mui/material";
import { NavLink } from "react-router";
import MenuItemLink from "../shared/componets/MenuItemLink";
import { Observer } from "mobx-react-lite";
import { useStore } from "../../lib/hooks/useStore";
import useAccount from "../../lib/hooks/useAccount";
import UserMenu from "./UserMenu";

export default function NavBar() {
  const { uiStore } = useStore();
  const { currentUser } = useAccount();
  return (
    <Box sx={{ flexGrow: 1, minHeight: 80 }}>
      <AppBar position="fixed"
        sx={{
          backgroundImage: 'linear-gradient(135deg, #182a73 0%, #218aae 85%)'
        }}>
        <Container maxWidth="xl">
          <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Box >
              <MenuList >
                <MenuItem component={NavLink} to="/" sx={{ display: 'flex' }}>
                  <Group fontSize="large" />
                  <Typography sx={{ position: 'relative', fontWeight: 'bold' }} variant="h4" >Reactivities</Typography>
                  <Observer>
                    {() =>
                      uiStore.isLoading ? (
                        <CircularProgress
                          size={20}
                          thickness={7}
                          sx={{
                            color: 'white',
                            position: 'absolute',
                            top: '30%',
                            left: '105%',
                          }}
                        />
                      ) : null
                    }
                  </Observer>
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
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {currentUser ? (
                <UserMenu />
              ) : (
                <>
                  <MenuList sx={{ display: 'flex' }}>
                    <MenuItemLink to="/login">Login</MenuItemLink>
                    <MenuItemLink to="/register">Register</MenuItemLink>
                  </MenuList>
                </>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </Box>
  );
}
