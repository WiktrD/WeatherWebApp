import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';

interface DeviceData {
    temperature: number;
    pressure: number;
    humidity: number;
    deviceId: number;
    readingDate?: string | number;
}

interface Props {
    data: DeviceData[];
}

const Charts = ({ data }: Props) => {
    const chartData = data.map((entry, index) => ({
        name: entry.readingDate ?? (index + 1).toString(),
        temperature: entry.temperature ?? 0,
        pressure: entry.pressure ? entry.pressure / 10 : 0,
        humidity: entry.humidity ?? 0
    }));

    const materialDark = {
        primary: "#2196F3",
        secondary: "#90CAF9",
        accent1: "#00E5FF",
        accent2: "#BB86FC",
        text: "#E0E0E0"
    };

    return (
            <ResponsiveContainer width="100%" height={320}>
                <LineChart data={chartData} margin={{ top: 40, right: 20, left: 20, bottom: 0 }}>
                    <XAxis
                        dataKey="name"
                        stroke={materialDark.text}
                        tick={{ fontFamily: 'Roboto, sans-serif', fontSize: 12, fill: materialDark.text }}
                    />
                    <YAxis
                        stroke={materialDark.text}
                        tick={{ fontFamily: 'Roboto, sans-serif', fontSize: 12, fill: materialDark.text }}
                    />
                    <Tooltip
                        contentStyle={{ backgroundColor: "#1E1E1E", borderColor: materialDark.primary, color: materialDark.text, fontFamily: 'Roboto, sans-serif' }}
                        labelStyle={{ color: materialDark.secondary }}
                        itemStyle={{ color: materialDark.text }}
                    />
                    <Legend
                        verticalAlign="top"
                        iconType="square"
                        wrapperStyle={{ color: materialDark.text, fontFamily: 'Roboto, sans-serif', paddingBottom: '20px' }}
                    />
                    <Line type="monotone" dataKey="pressure" stroke={materialDark.primary} name="Pressure x10 [hPa]" strokeWidth={2} />
                    <Line type="monotone" dataKey="humidity" stroke={materialDark.accent1} name="Humidity [%]" strokeWidth={2} />
                    <Line type="monotone" dataKey="temperature" stroke={materialDark.accent2} name="Temperature [°C]" strokeWidth={2} />
                </LineChart>
            </ResponsiveContainer>
    );
};

export default Charts;
