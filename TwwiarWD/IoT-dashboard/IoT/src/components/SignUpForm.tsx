import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { TextField, Button, Container, Typography, Alert, Box } from '@mui/material';

const materialDark = {
    primary: "#2196F3",
    secondary: "#90CAF9",
    accent1: "#00E5FF",
    accent2: "#BB86FC",
    text: "#E0E0E0",
    background: "#121212"
};

interface Account {
    username: string;
    email: string;
    password: string;
}

interface Errors {
    username?: string;
    email?: string;
    password?: string;
}

const SignUpForm: React.FC = () => {
    const [account, setAccount] = useState<Account>({ username: '', email: '', password: '' });
    const [errors, setErrors] = useState<Errors>({});
    const navigate = useNavigate();

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setAccount(prev => ({ ...prev, [name]: value }));
    };

    const validate = (): Errors | null => {
        const validationErrors: Errors = {};
        if (account.username.trim() === '') validationErrors.username = 'Username is required!';
        if (account.email.trim() === '') validationErrors.email = 'Email is required!';
        if (account.password.trim() === '') validationErrors.password = 'Password is required!';
        return Object.keys(validationErrors).length === 0 ? null : validationErrors;
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const validationErrors = validate();
        setErrors(validationErrors || {});
        if (validationErrors) return;

        try {
            await axios.post('http://localhost:3100/api/user/create', {
                name: account.username,
                email: account.email,
                password: account.password,
            });
            navigate('/');
        } catch (error: any) {
            const message = error.response?.data?.value || 'Unexpected error';

            if (message.includes('e-mail ju')) {
                setErrors({ email: 'A user with this email already exists.' });
            } else {
                setErrors({ password: message });
            }

            console.error(error);
        }
    };

    return (
        <Container
            maxWidth="xs"
            sx={{
                backgroundColor: materialDark.background,
                borderRadius: 3,
                mt: 6,
                p: 4,
                fontFamily: 'Roboto, sans-serif',
                color: materialDark.text,
                boxShadow: `0 0 10px ${materialDark.primary}`
            }}>
            <Typography
                variant="h4"
                component="h1"
                gutterBottom
                sx={{
                    color: materialDark.primary,
                    fontWeight: 'bold',
                    textAlign: 'center',
                    mb: 4
                }}>
                Create Account
            </Typography>
            <form onSubmit={handleSubmit}>
                <Box mb={2}>
                    <TextField
                        label="Username"
                        value={account.username}
                        name="username"
                        onChange={handleChange}
                        fullWidth
                        variant="outlined"
                        error={Boolean(errors.username)}
                        helperText={errors.username}
                        InputLabelProps={{ style: { color: materialDark.secondary } }}
                        sx={{
                            input: { color: materialDark.text },
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': { borderColor: materialDark.secondary },
                                '&:hover fieldset': { borderColor: materialDark.primary },
                                '&.Mui-focused fieldset': { borderColor: materialDark.primary },
                            },
                        }}
                    />
                </Box>
                <Box mb={2}>
                    <TextField
                        label="Email address"
                        value={account.email}
                        name="email"
                        onChange={handleChange}
                        type="email"
                        fullWidth
                        variant="outlined"
                        error={Boolean(errors.email)}
                        helperText={errors.email}
                        InputLabelProps={{ style: { color: materialDark.secondary } }}
                        sx={{
                            input: { color: materialDark.text },
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': { borderColor: materialDark.secondary },
                                '&:hover fieldset': { borderColor: materialDark.primary },
                                '&.Mui-focused fieldset': { borderColor: materialDark.primary },
                            },
                        }}
                    />
                </Box>
                <Box mb={2}>
                    <TextField
                        label="Password"
                        value={account.password}
                        name="password"
                        onChange={handleChange}
                        type="password"
                        fullWidth
                        variant="outlined"
                        error={Boolean(errors.password)}
                        helperText={errors.password}
                        InputLabelProps={{ style: { color: materialDark.secondary } }}
                        sx={{
                            input: { color: materialDark.text },
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': { borderColor: materialDark.secondary },
                                '&:hover fieldset': { borderColor: materialDark.primary },
                                '&.Mui-focused fieldset': { borderColor: materialDark.primary },
                            },
                        }}
                    />
                </Box>
                <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    sx={{
                        backgroundColor: materialDark.primary,
                        color: materialDark.text,
                        fontWeight: 'bold',
                        mt: 2,
                        '&:hover': { backgroundColor: materialDark.secondary }
                    }}>
                    Create Account
                </Button>
                {Object.values(errors).some(Boolean) && (
                    <Box mt={2}>
                        {Object.values(errors).map((error, index) => (
                            error && (
                                <Alert key={index} severity="error" sx={{ fontFamily: 'Roboto, sans-serif', backgroundColor: '#2c2c2c', color: materialDark.text }}>
                                    {error}
                                </Alert>
                            )
                        ))}
                    </Box>
                )}
            </form>
        </Container>
    );
};

export default SignUpForm;
