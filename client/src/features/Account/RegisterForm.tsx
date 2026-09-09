import { useForm } from "react-hook-form";
import useAccount from "../../lib/hooks/useAccount"
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Paper, Typography } from "@mui/material";
import { LockOpen } from "@mui/icons-material";
import TextInput from "../../app/shared/componets/TextInput";
import { Link } from "react-router";
import { registerSchema, type RegisterSchema } from "../../lib/schemas/registerSchema";

export default function RegisterFrom() {
    const { registerUser } = useAccount();

    const { control, setError, handleSubmit, formState: { errors, isValid, isSubmitting } } = useForm<RegisterSchema>({
        mode: 'onTouched', resolver: zodResolver(registerSchema)
    });

    const onSumbit = async (data: RegisterSchema) => {
        await registerUser.mutateAsync(data, {
            onError: (error) => {
                if (Array.isArray(error)) {
                    error.forEach(err => {
                        const message = String(err);
                        const normalizedMessage = message.toLowerCase();

                        if (normalizedMessage.includes('email')) {
                            setError('email', { message });
                        } else if (normalizedMessage.includes('password')) {
                            setError('password', { message });
                            //} else if (normalizedMessage.includes('display')) {
                            //    setError('displayName', { message });
                            //} else {
                            //    setError('root', { message });
                        }
                    })
                }
            }
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
                <Typography variant="h4" >Register</Typography>
            </Box>
            <TextInput label='Email' control={control} name='email' />
            <TextInput label='DisplayName' control={control} name='displayName' />
            <TextInput label='Password' type="password" control={control} name='password' />
            {errors.root?.message && (
                <Typography color="error">{errors.root.message}</Typography>
            )}

            <Button
                type="submit"
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
    )
}