import { Box, Button, Paper, Typography } from "@mui/material";
import { useActivities } from "../../../lib/hooks/useActivities";
import { useNavigate, useParams } from "react-router";
import { useForm } from "react-hook-form"
import { useEffect } from "react";
import { activitySchema, type ActivitySchema } from "../../../lib/schemas/activityschema";
import { zodResolver } from '@hookform/resolvers/zod'
import TextInput from "../../../app/shared/componets/TextInput";
import DateTimeInput from "../../../app/shared/componets/DateTimeInput";
import SelectInput from "../../../app/shared/componets/SelectInput";
import { categoryOptions } from "./categoryOptions";
import LocationInput from "../../../app/shared/componets/LocationInput";


export default function ActivityForm() {
  const { id } = useParams();

  const navigate = useNavigate();

  const { reset, control, handleSubmit } = useForm<ActivitySchema>({
    mode: 'onTouched',
    resolver: zodResolver(activitySchema)
  });

  const { updateActivity, createActivity, activity, isLoadingActivity } = useActivities(id);
  //const dateValue = activity?.date ? new Date(activity.date).toISOString().split('T')[0]
  //  : new Date().toISOString().split('T')[0];
  useEffect(() => {
    if (activity) {
      reset({
        ...activity,
        location: {
          city: activity.city,
          venue: activity.venue,
          latitude: activity.latitude,
          longitude: activity.longitude,
        }
      });
    }
  }, [activity, reset]);

  const onSubmit = async (data: ActivitySchema) => {
    const { location, ...rest } = data;
    const flattenedData = {
      ...rest,
      ...location,
      city: location.city ?? '',
    };

    try {
      if (activity) {
        await updateActivity.mutateAsync({ ...activity, ...flattenedData }, {
          onSuccess: () => navigate(`/activities/${activity.id}`)
        })
      }
      else {
        await createActivity.mutateAsync(flattenedData, {
          onSuccess: (id) => navigate(`/activities/${id}`)
        })
      }
    } catch (error) {
      console.log(error);
    }
  }

  if (isLoadingActivity) return <Typography>Loading ...</Typography>

  return (
    <Paper sx={{ p: 2, borderRadius: 3, boxShadow: 3, backgroundColor: '#f5f5f5' }}>
      <Typography variant="h5" gutterBottom color="primary" >
        {activity ? 'Edit' : 'Create '} activity
      </Typography>
      <Box component="form" onSubmit={handleSubmit(onSubmit)}
        sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
        <TextInput control={control} label='Title' name='title' />
        <TextInput control={control} label="Description" name='description' multiline rows={4} />
        <Box sx={{ display: 'flex', gap: 3 }}>
          <SelectInput items={categoryOptions} control={control} label="Category" name='category' />
          <DateTimeInput control={control} label="Date" name='date' />

        </Box>
        <LocationInput control={control} label="Enter the location" name='location' />

        <Box sx={{ display: 'flex', justifyContent: 'end', gap: 3 }}>
          <Button variant="contained" color="inherit">Cancel</Button>
          <Button disabled={updateActivity.isPending || createActivity.isPending}
            variant="contained" color="success" type="submit">Submit</Button>
        </Box>
      </Box>
    </Paper>
  )
}