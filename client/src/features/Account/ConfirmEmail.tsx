import { CheckCircle, ErrorOutlined } from "@mui/icons-material";
import { Box, Button, CircularProgress, Paper, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";
import aget from "../../lib/api/agent";

type ConfirmationState = "loading" | "success" | "error";

export default function ConfirmEmail() {
    const [searchParams] = useSearchParams();
    const [state, setState] = useState<ConfirmationState>("loading");

    useEffect(() => {
        const userId = searchParams.get("userId");
        const code = searchParams.get("code");

        if (!userId || !code) {
            setState("error");
            return;
        }

        aget.post("/account/confirm-email", null, {
            params: { userId, code }
        })
            .then(() => setState("success"))
            .catch(() => setState("error"));
    }, [searchParams]);

    return (
        <Paper sx={{ maxWidth: 520, mx: "auto", p: 4, textAlign: "center" }}>
            {state === "loading" && <CircularProgress />}
            {state === "success" && (
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                    <CheckCircle color="success" sx={{ fontSize: 64 }} />
                    <Typography variant="h4">Email confirmed</Typography>
                    <Typography>Your email address has been confirmed. You can now sign in.</Typography>
                    <Button component={Link} to="/login" variant="contained">Go to login</Button>
                </Box>
            )}
            {state === "error" && (
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                    <ErrorOutlined color="error" sx={{ fontSize: 64 }} />
                    <Typography variant="h4">Confirmation failed</Typography>
                    <Typography>The confirmation link is invalid or has expired.</Typography>
                    <Button component={Link} to="/login" variant="contained">Go to login</Button>
                </Box>
            )}
        </Paper>
    );
}