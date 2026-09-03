import { Box, Button, Paper, TextField, Typography } from "@mui/material";
import { useActivities } from "../../../lib/hooks/useActivities";
import { useNavigate, useParams } from "react-router";


export default function ActivityForm() {

  const {id} = useParams();
  const navigate = useNavigate();

  const {updateActivity, createActivity, activity, isLoadingActivity } = useActivities(id);

  const dateValue = activity?.date ? new Date(activity.date).toISOString().split('T')[0] 
  : new Date().toISOString().split('T')[0];

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const data: { [key: string]: FormDataEntryValue } = {}

    formData.forEach((value, key) => {
      data[key] = value;
    });
    if (activity) {
      data.id = activity.id
      await updateActivity.mutateAsync(data as unknown as Activity);
      navigate(`/activities/${activity.id}`);
    }
    else {
      createActivity.mutate(data as unknown as Activity,{
        onSuccess: (id) =>{
          navigate(`/activities/${id}`);
        }
      });
    }
  };
  if(isLoadingActivity) return <Typography>Loading ...</Typography>

  return (
    <Paper sx={{ p: 2, borderRadius: 3, boxShadow: 3, backgroundColor: '#f5f5f5' }}>
      <Typography variant="h5" gutterBottom color="primary" >
        {activity ? 'Edit' : 'Create '} activity
      </Typography>
      <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }} onSubmit={handleSubmit}>
        <TextField name="title" label="Title" defaultValue={activity?.title || ''} />
        <TextField name="description" label="Description" defaultValue={activity?.description || ''} multiline rows={4} />
        <TextField name="category" label="Category" defaultValue={activity?.category || ''} />
        <TextField name="date" label="Date" defaultValue={dateValue} type="date" />
        <TextField name="city" label="City" defaultValue={activity?.city || ''} />
        <TextField name="venue" label="Venue" defaultValue={activity?.venue || ''} />
        <Box sx={{ display: 'flex', justifyContent: 'end', gap: 3 }}>
          <Button  variant="contained" color="inherit">Cancel</Button>
          <Button  disabled={updateActivity.isPending || createActivity.isPending}
           variant="contained" color="success" type="submit">Submit</Button>
        </Box>
      </Box>
    </Paper>
  )
}