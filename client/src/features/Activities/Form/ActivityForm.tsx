import { Box, Button, Paper, TextField, Typography } from "@mui/material";

type Props = {
  activity?: Activity;
  closeForm: () => void;
  createOrEditActivity: (activity: Activity) => void;
};

export default function ActivityForm({ activity, closeForm, createOrEditActivity }: Props) {

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        // Handle form submission logic here

         const formData = new FormData(event.currentTarget);
        const data:{[key: string]: FormDataEntryValue} ={}

        formData.forEach((value, key) => {
            data[key] = value;
        });

        if (activity) {
            data['id'] = activity.id;
        }
        
        createOrEditActivity(data as unknown as Activity);
    };

  return (
    <Paper sx={{ p: 2, borderRadius: 3, boxShadow: 3, backgroundColor: '#f5f5f5' }}>
      <Typography variant="h6">Create Activity</Typography>
      <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }} onSubmit={handleSubmit}>
        <TextField name="title" label="Title" defaultValue={activity?.title || ''} />
        <TextField name="description" label="Description" defaultValue={activity?.description || ''} multiline rows={4} />
        <TextField name="category" label="Category" defaultValue={activity?.category || ''} />
        <TextField name="date" label="Date" defaultValue={activity?.date || ''} type="date" />
        <TextField name="city" label="City" defaultValue={activity?.city || ''} /> 
        <TextField name="venue" label="Venue" defaultValue={activity?.venue || ''} />
        <Box sx={{ display: 'flex', justifyContent: 'end', gap:3 }}>
          <Button onClick={closeForm} variant="contained" color="inherit">Cancel</Button>
          <Button variant="contained" color="success" type="submit">Submit</Button>
          </Box>
      </Box>
    </Paper>
  )
}