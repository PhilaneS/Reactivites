import { useForm, useWatch } from "react-hook-form";
import useAccount from "../../lib/hooks/useAccount"
import { loginSchema, type LoginSchema } from "../../lib/schemas/loginSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Paper, Typography } from "@mui/material";
import { LockOpen } from "@mui/icons-material";
import TextInput from "../../app/shared/componets/TextInput";
import { Link, useLocation, useNavigate } from "react-router";
import { toast } from "react-toastify";
import { useState } from "react";

export default function LoginFrom() {
    const { loginUser, resendConfirmationEmail } = useAccount();
    const [notVerified, setNotVerified] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { control, handleSubmit, formState: { isValid, isLoading } } = useForm<LoginSchema>({
        mode: 'onTouched', resolver: zodResolver(loginSchema)
    });

    const email = useWatch({ control, name: 'email' });

    const handleResendEmail = async () => {
        try {
            await resendConfirmationEmail.mutateAsync({ email });
            setNotVerified(false);
        } catch (error) {
            console.log(error);
            toast.error('Problem sending email - please check email address');
        }
    }

    const onSumbit = async (data: LoginSchema) => {
        await loginUser.mutateAsync(data, {
            onSuccess: () => {
                navigate(location.state?.from || '/activities');
            },
            onError: (error => {
                if (error.message === 'NotAllowed') {
                    setNotVerified(true);
                }
            })
        });
    }
    return (
        <Paper
            component='form'
            onSubmit={handleSubmit(onSumbit)}
            sx={{
                display: 'flex',
                flexDirection: 'column',
                p: 3,
                gap: 3,
                maxWidth: 'md',
                mx: 'auto',
                borderRadius: 3
            }}
        >

            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 3,
                    color: 'secondary.main'
                }}
            >
                <LockOpen fontSize="large" />
                <Typography variant="h4" >Sign in</Typography>
            </Box>
            <TextInput label='Email' control={control} name='email' />
            <TextInput label='Password' type="password" control={control} name='password' />

            <Button
                type="submit"
                disabled={!isValid || isLoading}
                variant="contained"
                size="large"
            >
                Login
            </Button>
            {notVerified ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <Typography sx={{ textAlign: 'center', color: "error" }} >
                        Your email has not been verified. You can click the button to re-send the verfication link.
                    </Typography>
                    <Button
                        disabled={resendConfirmationEmail.isPending}
                        onClick={handleResendEmail}
                    >
                        Re-send email link
                    </Button>
                </Box>) : (
                <Typography sx={{ textAlign: 'center' }} >
                    Don't have an account
                    <Typography sx={{ ml: 2 }} component={Link} to='/register' color="primary">
                        Sign up
                    </Typography>
                </Typography>
            )}

        </Paper>
    )
}