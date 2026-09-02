import { Card, CardContent, Typography, CardActions, Chip, Button, Box } from "@mui/material";

type Props = {
  activity: Activity;
  selectActivity: (id: string) => void; 
  deleteActivity: (id: string) => void;
};
export default function ActivityCard({ activity, selectActivity, deleteActivity }: Props) {
  return (
    <Card sx={{borderRadius: 3, boxShadow: 3, backgroundColor: '#f5f5f5'}}>
      <CardContent>
        <Typography variant="h5" color="text.secondary">{activity.title}</Typography>
        <Typography sx={{ color: 'text.secondary',mb:1 }}>{activity.date}</Typography>
        <Typography variant="body2" >{activity.description}</Typography>
        <Typography variant="subtitle1">{activity.city} / {activity.venue}</Typography>
      </CardContent>

      <CardActions sx={{display: 'flex', justifyContent: 'space-between',pb:2}} >
        <Chip label={activity.category} variant="outlined" />
       <Box sx={{display: 'flex', gap: 3}}>
            <Button size="medium"  variant="contained" onClick={() => selectActivity(activity.id)}>View</Button>
            <Button size="medium"  variant="contained" color="error" onClick={() => deleteActivity(activity.id)}>Delete</Button>
       </Box>
       </CardActions>
    </Card>
  )
}