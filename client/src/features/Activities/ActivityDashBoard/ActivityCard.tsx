import { AccessTime, Place } from "@mui/icons-material";
import { Card, CardContent, Typography, Chip, Button, Box, CardHeader, Avatar, Divider } from "@mui/material";
import { Link } from "react-router";
import formatDate from "../../../lib/util/util";
import AvatarPopover from "../../../app/shared/componets/AvatarPopover";

type Props = {
  activity: Activity;
};
export default function ActivityCard({ activity }: Props) {

  const label = activity.isHost ? 'You are hosting' : 'You are going';
  const color = activity.isHost ? 'secondary' : activity.isGoing ? 'warning' : 'default';
  return (
    <Card elevation={3} sx={{ borderRadius: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} >
        <CardHeader
          avatar={<Avatar
            src={activity.hostImageUrl}
            sx={{ height: 80, width: 80 }}
            alt="image of host"
          />}
          title={
            <Typography sx={{ fontWeight: 700, fontSize: 20 }}>
              {activity.title}
            </Typography>
          }
          subheader={
            <>
              Hosted by{' '} <Link to={`/profile/${activity.hostId}`}>{activity.hostDisplayName} </Link>
            </>
          }
        />

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mr: 2 }}>
          {(activity.isHost || activity.isGoing) && <Chip variant="outlined" label={label} color={color} sx={{ borderRadius: 2 }} />}
          {(activity.isCancelled) && <Chip label='Cancelled' color='error' sx={{ borderRadius: 2 }} />}
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
        <Box sx={{ display: 'flex', backgroundColor: 'grey.200', gap: 2, py: 3, pl: 3 }}>
          {activity.attendees.map(att => (
            <AvatarPopover key={att.id} profile={att} />
          ))}
        </Box>
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