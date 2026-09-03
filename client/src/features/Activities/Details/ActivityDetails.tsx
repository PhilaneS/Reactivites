import { Button, Card, CardActions, CardContent, CardMedia, Typography } from "@mui/material";
import { useActivities } from "../../../lib/hooks/useActivities";
import { Link, useNavigate, useParams } from "react-router";

export default function ActivityDetails() {
  const navigate = useNavigate();
  const {id} = useParams();
  const {activity, isLoadingActivity} = useActivities(id);

  if (isLoadingActivity) return <Typography variant="h5" color="error">Loading...</Typography>;
  
  if (!activity) return <Typography variant="h5" color="error">Activity bot found</Typography>;

  return (
    <Card sx={{borderRadius: 3, boxShadow: 3, backgroundColor: '#f5f5f5', p: 2}}>
     <CardMedia
      component="img"
      
      image={`/images/categoryImages/${activity.category}.jpg`}
      alt={activity.title}
     />
     <CardContent>
      <Typography variant="h5">{activity.title}</Typography>
      <Typography variant="subtitle1" sx={{ fontWeight: 'light' }}>{activity.date}</Typography>
      <Typography variant="body1" >{activity.description}</Typography>
      </CardContent>
     <CardActions>
        <Button color="primary" component={Link}  to ={`/manage/${activity.id}`} >
          Edit
        </Button>
        <Button color="primary" onClick={() => navigate('/activities') }>
          Cancel
        </Button>
     </CardActions>
    </Card>
  )
}