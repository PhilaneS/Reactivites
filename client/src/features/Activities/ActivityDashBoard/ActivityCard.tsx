import { AccessTime, Place } from "@mui/icons-material";
import { Card, CardContent, Typography, Chip, Button, Box, CardHeader, Avatar, Divider } from "@mui/material";
import { Link } from "react-router";
import formatDate from "../../../lib/util/util";

type Props = {
  activity: Activity;
};
export default function ActivityCard({ activity }: Props) {
  const isHost = false;
  const isGoing = false;
  const label = false;
  const isCancelled = false;
  const color = isHost ? 'secondary' : isGoing ? 'warning' : 'default';

  return (
    <Card elevation={3} sx={{ borderRadius: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} >
        <CardHeader
          avatar={<Avatar sx={{ height: 80, width: 80 }} />}
          title={
            <Typography sx={{ fontWeight: 700, fontSize: 20 }}>
              {activity.title}
            </Typography>
          }
          subheader={
            <>
              Hosted by {' '} <Link to={`/profile/PhilaneS`}>PhlaneS</Link>
            </>
          }
        />

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mr: 2 }}>
          {(isHost || isGoing) && <Chip label={label} color={color} sx={{ borderRadius: 2 }} />}
          {(isCancelled) && <Chip label='Cancelled' color='error' sx={{ borderRadius: 2 }} />}
        </Box>
      </Box>

      <Divider sx={{ mb: 3 }} />

      <CardContent sx={{ p: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, px: 2 }}>
          <Box sx={{ display: 'flex', flexGrow: 0, alignItems: 'center' }}>
            <AccessTime sx={{ mr: 1 }} />
            <Typography variant='body2' noWrap >
              {formatDate(activity.date)}
            </Typography>
          </Box>
          <Place sx={{ ml: 3, mr: 1 }} />
          <Typography variant='body2' >{activity.venue}</Typography>
        </Box>
        <Divider />
        <Box sx={{ display: 'flex', backgroundColor: 'grey.200', gap: 2, py: 3, pl: 3 }}></Box>
      </CardContent>
      <CardContent sx={{ pb: 2 }} >
        <Typography variant='body2' >{activity.description}</Typography>
        <Button
          component={Link}
          to={`/activities/${activity.id}`}
          size="medium"
          variant="contained"
          sx={{ display: 'flex', justifySelf: 'self-end', borderRadius: 3 }}
        >View</Button>
      </CardContent>
    </Card>
  )
}