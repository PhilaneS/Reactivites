import { Box, Button, Paper, TextField, Typography } from "@mui/material";
import { useActivities } from "../../../lib/hooks/useActivities";

type Props = {
  activity?: Activity;
  closeForm: () => void;
};

export default function ActivityForm({ activity, closeForm }: Props) {

  const {updateActivity, createActivity } = useActivities();
  const dateValue = activity?.date ? new Date(activity.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const data: { [key: string]: FormDataEntryValue } = {}

    formData.forEach((value, key) => {
      data[key] = value;
    });

    if (activity) {
      
      await updateActivity.mutateAsync(data as unknown as Activity);
     closeForm();
    }
    else {
      await createActivity.mutateAsync(data as unknown as Activity);
      closeForm();
    }
  };

  return (
    <Paper sx={{ p: 2, borderRadius: 3, boxShadow: 3, backgroundColor: '#f5f5f5' }}>
      <Typography variant="h6">Create Activity</Typography>
      <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }} onSubmit={handleSubmit}>
        <TextField name="title" label="Title" defaultValue={activity?.title || ''} />
        <TextField name="description" label="Description" defaultValue={activity?.description || ''} multiline rows={4} />
        <TextField name="category" label="Category" defaultValue={activity?.category || ''} />
        <TextField name="date" label="Date" defaultValue={dateValue} type="date" />
        <TextField name="city" label="City" defaultValue={activity?.city || ''} />
        <TextField name="venue" label="Venue" defaultValue={activity?.venue || ''} />
        <Box sx={{ display: 'flex', justifyContent: 'end', gap: 3 }}>
          <Button onClick={closeForm} variant="contained" color="inherit">Cancel</Button>
          <Button  disabled={updateActivity.isPending || createActivity.isPending}
           variant="contained" color="success" type="submit">Submit</Button>
        </Box>
      </Box>
    </Paper>
  )
}