import { Alert, CircularProgress, Grid } from "@mui/material";
import { useParams } from "react-router";
import { useProfile } from "../../lib/hooks/useProfile";
import ProfileHeader from "./ProfileHeader";
import ProfileContent from "./ProfileContent";

export default function ProfilePage() {
    const { id } = useParams();
    const { profile, isLoadingProfile, isLoatingPhotos } = useProfile(id);

    if (isLoadingProfile || isLoatingPhotos) {
        return <CircularProgress sx={{ display: 'block', mx: 'auto', mt: 8 }} />;
    }

    if (!profile) {
        return <Alert severity="error">Profile not found.</Alert>;
    }

    return (
        <Grid container spacing={3}>
            <Grid size={12}>
                <ProfileHeader profile={profile} />
                <ProfileContent />
            </Grid>
        </Grid>
    )
}