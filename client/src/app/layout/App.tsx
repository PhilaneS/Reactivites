import { Container, CssBaseline } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import NavBar from "./NavBar";
import ActivityDashBoard from "../../features/Activities/ActivityDashBoard/ActivityDashBoard";

function App() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<Activity | undefined>(undefined);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    axios.get<Activity[]>('https://localhost:5001/api/activities')
      .then(response => setActivities(response.data));
    return () => {
      // Cleanup function if needed
    };
  }, []);

  const handleSelectActivity = (id: string) => {
    const activity = activities.find(a => a.id === id);
    setSelectedActivity(activity);
  };
  const handleCancelSelectActivity = () => {
    setSelectedActivity(undefined);
  };

  const handleFormOpen = (id?: string) => {
    if (id) {
      handleSelectActivity(id);
    } else {
      handleCancelSelectActivity();
    }
    setEditMode(true);
  };

  const handleFormClose = () => {
    setEditMode(false);
  };

  const handleCreateOrEditActivity = (activity: Activity) => {
    if (activity.id) {
      setActivities([...activities.filter(a => a.id !== activity.id), activity]);
      setSelectedActivity(activity);
    } else {
      activity.id = Math.random().toString(36).substring(2, 9); // Generate a random ID
      setActivities([...activities, activity]);
      setSelectedActivity(activity);
    }
    setEditMode(false);
  };

  const handleDeleteActivity = (id: string) => {
    setActivities(activities.filter(a => a.id !== id));
    if (selectedActivity?.id === id) {
      handleCancelSelectActivity();
    }
  };

  return (
    <>
      <CssBaseline />
      < NavBar openForm={handleFormOpen} />
      <Container maxWidth="xl" sx={{ mt: 3 }}>
        <ActivityDashBoard
          activities={activities}
          selectedActivity={selectedActivity}
          selectActivity={handleSelectActivity}
          cancelSelectActivity={handleCancelSelectActivity}
          editMode={editMode}
          openForm={handleFormOpen}
          closeForm={handleFormClose}
          createOrEditActivity={handleCreateOrEditActivity}
          deleteActivity={handleDeleteActivity}
        />
      </Container>

    </>
  );
}

export default App
