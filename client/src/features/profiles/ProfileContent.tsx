import { Box, Paper, Tab, Tabs } from "@mui/material";
import { useState } from "react";

type Props = {
    photos: Photo[];
}

export default function ProfileContent({ photos }: Props) {
    const [value, setValue] = useState(0);

    const handleChange = (_, newValue: number) => {
        setValue(newValue);
    }

    const tabContent = [
        { Label: 'About', content: <div>About</div> },
        { Label: 'Photos', content: <div>Photos</div> },
        { Label: 'Events', content: <div>Events</div> },
        { Label: 'Followers', content: <div>Followers</div> },
        { Label: 'Following', content: <div>Following</div> }
    ];
    console.log(photos);
    return (
        <Box
            component={Paper}
            sx={{
                display: 'flex',
                alignItems: 'flex-start',
                borderRadius: 3,
                mt: 2,
                p: 3,
                height: 500
            }}
        >
            <Tabs
                orientation="vertical"
                value={value}
                onChange={handleChange}
                sx={{ borderRight: 1, height: 450, minWidth: 200 }}
            >
                {tabContent.map((tab, index) => (
                    <Tab key={index} label={tab.Label} sx={{ mr: 3 }} />
                ))}
            </Tabs>
            <Box sx={{ flexGrow: 1, p: 3 }}>
                {tabContent[value].content}
            </Box>
        </Box>
    )
}