import { Grid, Typography } from "@mui/material";
import { useActivities } from "../../../lib/hooks/useActivities";
import { useParams } from "react-router";
import ActivityDetailsSideBar from "./ActivityDetailsSideBar";
import ActivityDetailsHeader from "./ActivityDetailsHeader";
import ActivityDetailsInfor from "./ActivityDetailsInfo";
import ActivityDetailsChat from "./ActivityDetailsChat";

export default function ActivityDetailsPage() {
  const { id } = useParams();
  const { activity, isLoadingActivity } = useActivities(id);

  if (isLoadingActivity) return <Typography variant="h5" color="error">Loading...</Typography>;

  if (!activity) return <Typography variant="h5" color="error">Activity bot found</Typography>;

  return (
    <Grid container spacing={3} >
      <Grid size={8} >
        <ActivityDetailsHeader activity={activity} />
        <ActivityDetailsInfor activity={activity} />
        <ActivityDetailsChat />
      </Grid>
      <Grid size={4} >
        <ActivityDetailsSideBar activity={activity} />
      </Grid>
    </Grid>
  )
}