import { AppBar, Box, Container, Toolbar, Typography, Button } from '@mui/material';
import LanguageIcon from '@mui/icons-material/Language';
import { useNavigate } from 'react-router-dom';

const materialDark = {
    primary: "#2196F3",
    secondary: "#90CAF9",
    accent1: "#00E5FF",
    accent2: "#BB86FC",
    text: "#E0E0E0"
};

const Navbar = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const isLoggedIn = !!token;
    let currentUser = '';
    let userId ='';

    if (token) {
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            currentUser = payload.name || '';
            userId = payload.sub || payload.id || '';
        } catch {
            currentUser = '';
            userId = '';
        }
    }
    const handleLogout = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            const response = await fetch('http://localhost:3100/api/user/logout', {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                localStorage.removeItem('token');
                navigate('/');
            } else {
                const error = await response.json();
                alert('Błąd wylogowania: ' + (error.message || 'Nieznany błąd'));
            }
        } catch (e) {
            alert('Błąd połączenia podczas wylogowania');
        }
    };

    return (
        <AppBar
            position="static"
            sx={{
                backgroundColor: '#121212',  // ciemne tło jak wykres
                boxShadow: `0 4px 8px ${materialDark.primary}`,
                borderBottom: `4px solid ${materialDark.primary}`
            }}
        >
            <Container maxWidth="l" disableGutters>
                <Toolbar
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        width: '100%',
                        px: 0,
                        minHeight: 64
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, pl: 2 }}>
                        <LanguageIcon sx={{ color: materialDark.primary }} />
                        <Typography
                            variant="h6"
                            sx={{
                                fontFamily: 'Roboto, sans-serif',
                                fontWeight: 700,
                                letterSpacing: '.1rem',
                                color: materialDark.text,
                                textShadow: `1px 1px 2px ${materialDark.primary}`
                            }}
                        >
                            IoT dashboard
                        </Typography>
                        <Typography
                            variant="body2"
                            sx={{ color: materialDark.secondary, fontWeight: 400, ml: 1 }}
                        >
                            (Device state)
                        </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, pr: 2 }}>
                        {isLoggedIn && currentUser && (
                            <Typography sx={{ color: materialDark.text, fontFamily: 'Roboto, sans-serif', mr: 2 }}>
                                User: <b>{currentUser}</b>
                            </Typography>
                        )}
                        {!isLoggedIn ? (
                            <>
                                <Button
                                    variant="outlined"
                                    sx={{
                                        fontFamily: 'Roboto, sans-serif',
                                        color: materialDark.primary,
                                        borderColor: materialDark.primary,
                                        '&:hover': { backgroundColor: materialDark.primary, color: materialDark.text }
                                    }}
                                    onClick={() => navigate('/')}
                                >
                                    Login
                                </Button>
                                <Button
                                    variant="outlined"
                                    sx={{
                                        fontFamily: 'Roboto, sans-serif',
                                        color: materialDark.primary,
                                        borderColor: materialDark.primary,
                                        '&:hover': { backgroundColor: materialDark.primary, color: materialDark.text }
                                    }}
                                    onClick={() => navigate('/register')}
                                >
                                    Sign up
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button
                                    variant="outlined"
                                    sx={{
                                        fontFamily: 'Roboto, sans-serif',
                                        color: materialDark.primary,
                                        borderColor: materialDark.primary,
                                        '&:hover': { backgroundColor: materialDark.primary, color: materialDark.text }
                                    }}
                                    onClick={() => navigate('/dashboard')}
                                >
                                    Dashboard
                                </Button>
                                <Button
                                    variant="outlined"
                                    sx={{
                                        fontFamily: 'Roboto, sans-serif',
                                        color: materialDark.primary,
                                        borderColor: materialDark.primary,
                                        '&:hover': { backgroundColor: materialDark.primary, color: materialDark.text }
                                    }}
                                    onClick={handleLogout}
                                >
                                    Logout
                                </Button>
                            </>
                        )}
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default Navbar;
