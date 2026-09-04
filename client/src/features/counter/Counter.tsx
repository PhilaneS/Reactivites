import { Box, Button, ButtonGroup, List, Paper, Typography } from "@mui/material";
import { useStore } from "../../lib/hooks/useStore"
import { observer } from 'mobx-react-lite'

const Counter = observer(function () {
    const { counterStore } = useStore();
    return (
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Box sx={{ width: '60%' }}>
                <Typography variant="h4" gutterBottom >{counterStore.title}</Typography>
                <Typography variant="h6" >{counterStore.count}</Typography>
                <ButtonGroup sx={{ mb: 3 }}>
                    <Button onClick={() => counterStore.decrement()}
                        variant="contained" color="error"
                    >Decrement</Button>
                    <Button onClick={() => counterStore.increment()}
                        variant="contained" color="success"
                    >Inecrement</Button>
                    <Button onClick={() => counterStore.increment(5)}
                        variant="contained" color="primary"
                    >Inecrement by 5</Button>
                </ButtonGroup>
            </Box>
            <Paper sx={{ width: '40%', p: 4 }}>
                <Typography variant="h5">({counterStore.events})</Typography>
                <List>
                    {counterStore.events.map((even, index) => (
                        <Typography key={index}>{even}</Typography>
                    ))}
                </List>
            </Paper>

        </Box>

    )
});

export default Counter;