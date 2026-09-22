import { useForm, useWatch } from "react-hook-form";
import useAccount from "../../lib/hooks/useAccount"
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Paper, Typography } from "@mui/material";
import { LockOpen } from "@mui/icons-material";
import TextInput from "../../app/shared/componets/TextInput";
import { Link } from "react-router";
import { registerSchema, type RegisterSchema } from "../../lib/schemas/registerSchema";
import { useState } from "react";
import RegisterSuccess from "./RegisterSuccess";

export default function RegisterFrom() {
    const { registerUser } = useAccount();
    const [registerSuccess, setRegisterSuccess] = useState(false);

    const { control, setError, handleSubmit, formState: { isValid, isSubmitting } } = useForm<RegisterSchema>({
        mode: 'onTouched', resolver: zodResolver(registerSchema)
    });
    const email = useWatch({ control, name: 'email' });

    const onSumbit = async (data: RegisterSchema) => {
        await registerUser.mutateAsync(data, {
            onSuccess: () => setRegisterSuccess(true),
            onError: (error) => {
                if (Array.isArray(error)) {
                    error.forEach(err => {
                        const message = String(err);
                        const normalizedMessage = message.toLowerCase();
                        if (normalizedMessage.includes('email')) {
                            setError('email', { message });
                        } else if (normalizedMessage.includes('password')) {
                            setError('password', { message });
                        }
                    })
                }
            }
        });
    }
    return (
        <>
            {registerSuccess ? (
                <RegisterSuccess email={email} />
            ) : (<Paper
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
                    <Typography variant="h4" >Register</Typography>
                </Box>
                <TextInput label='Email' control={control} name='email' />
                <TextInput label='DisplayName' control={control} name='displayName' />
                <TextInput label='Password' type="password" control={control} name='password' />

                <Button
                    type="submit"
                    loading={isSubmitting}
                    disabled={!isValid || isSubmitting}
                    variant="contained"
                    size="large"
                >
                    Register
                </Button>
                <Typography sx={{ textAlign: 'center' }} >
                    Already have an account
                    <Typography sx={{ ml: 2 }} component={Link} to='/login' color="primary">
                        Sign in
                    </Typography>
                </Typography>
            </Paper>
            )}
        </>

    )
}