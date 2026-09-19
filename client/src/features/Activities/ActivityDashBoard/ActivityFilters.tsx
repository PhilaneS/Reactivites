import { FilterList, Event } from "@mui/icons-material";
import { Box, MenuItem, MenuList, Paper, Typography } from "@mui/material";
import 'react-calendar/dist/Calendar.css'
import Calendar from "react-calendar"
import { observer } from "mobx-react-lite";
import { useStore } from "../../../lib/hooks/useStore";

const ActivityFilters = observer(function ActivityFilters() {

    const { activityStore: { setFilter, setStartDate, filter, startDate } } = useStore();
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Paper sx={{ p: 3, borderRadius: 3 }} >
                <Box sx={{ width: '100%' }}>
                    <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', mb: 1, color: 'primary.main' }}>
                        <FilterList sx={{ mr: 1 }} />
                        Filters
                    </Typography>
                    <MenuList>
                        <MenuItem selected={filter === 'all'}
                            onClick={() => setFilter('all')}>
                            <Typography >All Events</Typography>
                        </MenuItem>
                        <MenuItem selected={filter === 'isGoing'}
                            onClick={() => setFilter('isGoing')}>
                            <Typography >I'm going</Typography>
                        </MenuItem>
                        <MenuItem selected={filter === 'isHost'}
                            onClick={() => setFilter('isHost')}>
                            <Typography >I'm hosting</Typography>
                        </MenuItem>
                    </MenuList>
                </Box>
            </Paper>
            <Box component={Paper} sx={{ width: '100%' }}>
                <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', mb: 1, color: 'primary.main' }}>
                    <Event sx={{ mr: 1 }} />
                    Select date
                </Typography>
                <Calendar  value={startDate}
                    onChange={date => setStartDate(date as Date)} />
            </Box>
        </Box>
    )
});

export default ActivityFilters;