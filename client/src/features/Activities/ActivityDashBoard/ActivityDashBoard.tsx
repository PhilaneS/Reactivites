import { Grid } from "@mui/material";
import ActivityList from "./ActivityList";

export default function ActivityDashBoard() {

  return (
    <Grid container spacing={2}>
      <Grid size={7}>
        <ActivityList
         
        />
      </Grid>
      <Grid size={5}>
        Activity filters goes here 
      </Grid>

    </Grid>
  )
}