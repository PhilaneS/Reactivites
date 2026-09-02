import { Grid } from "@mui/material";
import ActivityList from "./ActivityList";
import ActivityDetails from "../Details/ActivityDetails";
import ActivityForm from "../Form/ActivityForm";

type Props = {
  activities: Activity[] 
  selectedActivity?: Activity;
  selectActivity: (id: string) => void;
  cancelSelectActivity: () => void;
  openForm: (id: string) => void;
  closeForm: () => void;
  editMode: boolean;
  createOrEditActivity: (activity: Activity) => void;
  deleteActivity: (id: string) => void;
};


export default function ActivityDashBoard({ activities, selectedActivity, selectActivity, 
  cancelSelectActivity, openForm, closeForm, editMode, createOrEditActivity, deleteActivity }: Props) {
  return (
    <Grid container spacing={2}>
      <Grid size={7}>
        <ActivityList 
        activities={activities}
        selectActivity={selectActivity}
        deleteActivity={deleteActivity}
                />
      </Grid>
      <Grid size={5}>
        {selectedActivity && !editMode && <ActivityDetails 
        activity={selectedActivity}
        cancelSelectActivity={cancelSelectActivity}
        openForm={openForm}
         />}
        {editMode && <ActivityForm 
        key={selectedActivity?.id || 0}
        activity={selectedActivity}
        closeForm={closeForm}
        createOrEditActivity={createOrEditActivity}
         />}

      </Grid>
      
    </Grid> 
  )
}