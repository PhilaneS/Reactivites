import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import useAccount from '../../lib/hooks/useAccount';
import { Avatar, Box, ListItemIcon, Typography } from '@mui/material';
import { Link } from 'react-router';
import { Add, Logout, Person } from '@mui/icons-material';

export default function BasicMenu() {
    const { currentUser, logoutUser } = useAccount();
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div>
            <Button
                onClick={handleClick}
                color='inherit'
                size='large'
                sx={{ fontSize: '1.1rem' }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar alt={currentUser?.displayName ?? 'User'} />
                    {currentUser?.displayName ?? 'Account'}
                </Box>

            </Button>
            <Menu
                id="user-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                slotProps={{
                    list: {
                        'aria-labelledby': 'basic-button',
                    },
                }}
            >
                <MenuItem component={Link} to='/createActivity' onClick={handleClose}>
                    <ListItemIcon>
                        <Add />
                    </ListItemIcon>
                    <Typography>Create Activity</Typography>
                </MenuItem>
                <MenuItem component={Link} to='/profile' onClick={handleClose}>
                    <ListItemIcon>
                        <Person />
                    </ListItemIcon>
                    <Typography>My Profile</Typography>
                </MenuItem>
                <MenuItem onClick={() => {
                    logoutUser.mutate();
                    handleClose();
                }}>
                    <ListItemIcon>
                        <Logout />
                    </ListItemIcon>
                    <Typography>Logout</Typography>
                </MenuItem>
            </Menu>
        </div>
    );
}
