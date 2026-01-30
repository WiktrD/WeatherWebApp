import { createContext, useContext, useMemo, useState, ReactNode } from 'react';
import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

type Mode = 'light' | 'dark';

interface ThemeContextType {
    theme: Mode;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useThemeContext = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useThemeContext must be used within ThemeProvider');
    }
    return context;
};

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const [theme, setTheme] = useState<Mode>('dark');

    const toggleTheme = () => {
        setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
    };

    const muiTheme = useMemo(() => {
        return createTheme({
            palette: {
                mode: theme,
                ...(theme === 'light'
                    ? {
                        background: {
                            default: '#fff',
                            paper: '#f5f5f5',
                        },
                        text: {
                            primary: '#000',
                        },
                    }
                    : {
                        background: {
                            default: '#000',
                            paper: '#1e1e1e',
                        },
                        text: {
                            primary: '#fff',
                        },
                    }),
            },
        });
    }, [theme]);

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            <MuiThemeProvider theme={muiTheme}>
                <CssBaseline />
                {children}
            </MuiThemeProvider>
        </ThemeContext.Provider>
    );
};
