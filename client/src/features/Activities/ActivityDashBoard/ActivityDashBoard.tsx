import { Grid } from "@mui/material";
import ActivityList from "./ActivityList";
import ActivityFilters from "./ActivityFilters";

export default function ActivityDashBoard() {

  return (
    <Grid container spacing={3}>
      <Grid size={8} >
        <ActivityList
        />
      </Grid>
      <Grid size={4} sx={{ top: 105, alignSelf: "flex-start", position: 'sticky' }}>
        <ActivityFilters />
      </Grid>

    </Grid>
  )
}