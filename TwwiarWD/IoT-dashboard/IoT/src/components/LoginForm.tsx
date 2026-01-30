import { Component, ChangeEvent, FormEvent } from 'react';
import { TextField, Button, Container, Typography, Alert, Box } from '@mui/material';
import axios from 'axios';

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
    password: string;
}

interface Errors {
    username?: string;
    password?: string;
}

interface State {
    account: Account;
    errors: Errors;
}

class LoginForm extends Component<{}, State> {
    state: State = {
        account: { username: '', password: '' },
        errors: {}
    };

    validate = (): Errors | null => {
        const { account } = this.state;
        const errors: Errors = {};
        if (account.username.trim() === '') errors.username = 'Username is required!';
        if (account.password.trim() === '') errors.password = 'Password is required!';
        return Object.keys(errors).length === 0 ? null : errors;
    };

    handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const errors = this.validate();
        this.setState({ errors: errors || {} });
        if (errors) return;

        try {
            const response = await axios.post('http://localhost:3100/api/user/auth', {
                login: this.state.account.username,
                password: this.state.account.password
            });
            localStorage.setItem('token', response.data.token);
            window.location.href = '/dashboard';
        } catch (error) {
            this.setState({ errors: { password: 'Invalid credentials.' } });
        }
    };

    handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const account = { ...this.state.account };
        account[event.currentTarget.name] = event.currentTarget.value;
        this.setState({ account });
    };

    render() {
        return (
            <Container maxWidth="xs" sx={{
                mt: 8,
                color: materialDark.text,
                backgroundColor: materialDark.background,
                borderRadius: 3,
                p: 4,
                fontFamily: 'Roboto, sans-serif',
                boxShadow: `0 0 10px ${materialDark.primary}`
            }}>
                <Typography variant="h4" component="h1" gutterBottom sx={{
                    color: materialDark.primary,
                    fontWeight: 'bold',
                    textAlign: 'center',
                    mb: 4
                }}>
                    Login
                </Typography>
                <form onSubmit={this.handleSubmit}>
                    <Box mb={2}>
                        <TextField
                            label="Username"
                            value={this.state.account.username}
                            name="username"
                            onChange={this.handleChange}
                            fullWidth
                            variant="outlined"
                            error={Boolean(this.state.errors.username)}
                            helperText={this.state.errors.username}
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
                            value={this.state.account.password}
                            name="password"
                            onChange={this.handleChange}
                            type="password"
                            fullWidth
                            variant="outlined"
                            error={Boolean(this.state.errors.password)}
                            helperText={this.state.errors.password}
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
                    <Button type="submit" variant="contained" fullWidth sx={{
                        backgroundColor: materialDark.primary,
                        color: materialDark.text,
                        fontWeight: 'bold',
                        mt: 2,
                        '&:hover': { backgroundColor: materialDark.secondary }
                    }}>
                        Log me in!
                    </Button>
                    {Object.values(this.state.errors).some(Boolean) && (
                        <Box mt={2}>
                            {Object.values(this.state.errors).map((error, index) => (
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
    }
}

export default LoginForm;
