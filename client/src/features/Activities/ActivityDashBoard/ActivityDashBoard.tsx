import { Grid } from "@mui/material";
import ActivityList from "./ActivityList";
import ActivityFilters from "./ActivityFilters";

export default function ActivityDashBoard() {

  return (
    <Grid container spacing={2}>
      <Grid size={7}>
        <ActivityList         
        />
      </Grid>
      <Grid size={5}>
       <ActivityFilters/> 
      </Grid>

    </Grid>
  )
}