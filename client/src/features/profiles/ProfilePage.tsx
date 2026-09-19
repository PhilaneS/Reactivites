import { Grid, Typography } from "@mui/material";
import { useParams } from "react-router";
import { useProfile } from "../../lib/hooks/useProfile";
import ProfileHeader from "./ProfileHeader";
import ProfileContent from "./ProfileContent";

export default function ProfilePage() {
    const { id } = useParams();
    const { profile, loadingProfile } = useProfile(id);

    if (loadingProfile) return <Typography>Loading profile...</Typography>

    if (!profile) return <Typography>Profile not found</Typography>

    return (
        <Grid container spacing={3}>
            <Grid size={12}>
                <ProfileHeader />
                <ProfileContent />
            </Grid>
        </Grid>
    )
}