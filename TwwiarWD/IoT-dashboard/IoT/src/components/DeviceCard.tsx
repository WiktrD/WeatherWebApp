import Typography from '@mui/material/Typography';
import DeviceThermostatIcon from '@mui/icons-material/DeviceThermostat';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import OpacityIcon from '@mui/icons-material/Opacity';
import { useState } from 'react';
import { Button, TextField, Box, Divider } from '@mui/material';
import axios from 'axios';

interface DeviceData {
    temperature: number;
    pressure: number;
    humidity: number;
    deviceId: number;
    readingDate?: string;
}

interface Props {
    data?: DeviceData;
    deviceName?: string;
    selected?: boolean;
    preview?: boolean;
    anomaly?: boolean;
    onClick?: () => void;
    history?: DeviceData[];
}

const DeviceCard = ({
                        data,
                        deviceName,
                        selected = false,
                        preview = false,
                        anomaly = false,
                        onClick
                    }: Props) => {
    if (!data) return null;

    const { deviceId, temperature, pressure, humidity, readingDate } = data;

    const cardClass = [
        'card',
        anomaly ? 'anomaly' : '',
        selected ? 'selected' : '',
        preview ? 'preview' : ''
    ].join(' ').trim();

    const [showForm, setShowForm] = useState(false);
    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');

    const isOffline = temperature === 0 && pressure === 0 && humidity === 0;

    const deleteInRange = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.delete(`http://localhost:3100/api/data/${deviceId}/range`, {
                params: { from, to },
                headers: { Authorization: `Bearer ${token}` }
            });
            alert(res.data.message);
            setShowForm(false);
        } catch (err: any) {
            alert(err.response?.data?.error || 'Błąd podczas usuwania danych.');
        }
    };

    const materialDark = {
        background: "#121212",
        surface: "#1E1E1E",
        text: "#E0E0E0",
        primary: "#2196F3",
        secondary: "#90CAF9",
        accent: "#BB86FC"
    };

    return (
        <Box
            className={cardClass}
            onClick={onClick}
            sx={{
                border: `2px solid ${materialDark.primary}`,
                backgroundColor: selected ? materialDark.surface : materialDark.background,
                borderRadius: 2,
                boxShadow: '2px 2px 8px rgba(0,0,0,0.5)',
                padding: 2,
                margin: 1,
                fontFamily: 'minecraft, sans-serif',
                color: materialDark.text,
                transition: '0.3s',
                '&:hover': {
                    boxShadow: '0 0 12px rgba(33, 150, 243, 0.7)'
                }
            }}
        >
            <Typography variant="h6" sx={{ color: materialDark.primary }}>
                {deviceName || `Device #${deviceId}`}
            </Typography>

            <Divider sx={{ borderColor: materialDark.primary, my: 1 }} />

            {isOffline ? (
                <Typography sx={{ color: materialDark.secondary, fontWeight: 'bold' }}>
                    No data yet. Add some readings
                </Typography>
            ) : (
                <>
                    <Typography variant="h6" component="div" sx={{ color: materialDark.text, fontWeight: 'bold' }}>
                        <DeviceThermostatIcon sx={{ color: materialDark.accent, mr: 1 }} />
                        <span className="value">{temperature}</span> °C
                    </Typography>
                    <Typography variant="h6" component="div" sx={{ color: materialDark.text, fontWeight: 'bold' }}>
                        <CloudUploadIcon sx={{ color: materialDark.accent, mr: 1 }} />
                        <span className="value">{pressure}</span> hPa
                    </Typography>
                    <Typography variant="h6" component="div" sx={{ color: materialDark.text, fontWeight: 'bold' }}>
                        <OpacityIcon sx={{ color: materialDark.accent, mr: 1 }} />
                        <span className="value">{humidity}</span> %
                    </Typography>
                </>
            )}

            {!preview && (
                <Box mt={2}>
                    <Button
                        variant="outlined"
                        size="small"
                        color="error"
                        onClick={(e) => {
                            e.stopPropagation();
                            setShowForm(!showForm);
                        }}
                    >
                        Delete data in range
                    </Button>

                    {showForm && (
                        <Box mt={2}>
                            <TextField
                                label="From"
                                type="datetime-local"
                                value={from}
                                onChange={(e) => setFrom(e.target.value)}
                                fullWidth
                                InputLabelProps={{ shrink: true, sx: { color: 'white' } }}
                                sx={{
                                    mb: 1,
                                    input: { color: 'white' },
                                    '& .MuiOutlinedInput-notchedOutline': { borderColor: 'white' },
                                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'white' }
                                }}
                            />
                            <TextField
                                label="To"
                                type="datetime-local"
                                value={to}
                                onChange={(e) => setTo(e.target.value)}
                                fullWidth
                                InputLabelProps={{ shrink: true, sx: { color: 'white' } }}
                                sx={{
                                    mb: 1,
                                    input: { color: 'white' },
                                    '& .MuiOutlinedInput-notchedOutline': { borderColor: 'white' },
                                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'white' }
                                }}
                            />
                            <Button
                                variant="contained"
                                color="error"
                                fullWidth
                                onClick={(e) => {
                                    e.stopPropagation();
                                    deleteInRange();
                                }}
                            >
                                Delete data
                            </Button>
                        </Box>
                    )}
                </Box>
            )}
        </Box>
    );
};

export default DeviceCard;
