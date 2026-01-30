import { useEffect, useState, useRef } from 'react';
import DeviceCard from './components/DeviceCard';
import Charts from './components/Charts';
import CombinedChart from './components/CombinedChart';
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Button
} from '@mui/material';
import axios from 'axios';
import './App.css';

interface DeviceData {
  temperature: number;
  pressure: number;
  humidity: number;
  deviceId: number;
  readingDate?: string;
}

const MAX_DEVICE_COUNT = 8;
const deviceOrder = [
  100,
  ...Array.from({ length: MAX_DEVICE_COUNT-1 }, (_, i) => i).filter(id => id !== 100)
];

const Dashboard = () => {
  const [chartMode, setChartMode] = useState<'single' | 'combined'>('single');
  const [activeDeviceId, setActiveDeviceId] = useState(0);
  const [histories, setHistories] = useState<Record<number, DeviceData[]>>({});
  const [combinedData, setCombinedData] = useState<DeviceData[]>([]);
  const dashboardRef = useRef<HTMLDivElement | null>(null);useEffect(() => {
    const fetchAllDeviceHistories = async () => {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      const all: Record<number, DeviceData[]> = {};
      const combined: DeviceData[] = [];

      for (const deviceId of deviceOrder) {
        try {
          const res = await axios.get<DeviceData[]>(
              `http://localhost:3100/api/data/${deviceId}`,
              { headers }
          );
          all[deviceId] = res.data as DeviceData[];
          combined.push(...res.data);
        } catch (err) {
          console.error(`Błąd pobierania danych dla urządzenia ${deviceId}:`, err);
          all[deviceId] = [];
        }
      }

      setHistories(all);
      setCombinedData(combined);
    };

    fetchAllDeviceHistories();
  }, [deviceOrder]);


  const handleChartModeChange = (event: SelectChangeEvent) => {
    setChartMode(event.target.value as 'single' | 'combined');
  };
  const getDeviceName = (deviceId: number) => {
    if (deviceId >= 100) {
      return `weatherapi ${deviceId - 100}`;
    }
    return deviceId.toString();
  };

  return (
      <div className="dashboard-wrapper">

        <div ref={dashboardRef}>
        <div className="dashboard-top">
          <div className={`centered-top ${chartMode === 'single' ? 'horizontal' : ''}`}>
            {chartMode === 'single' && histories[activeDeviceId]?.length > 0 && (
                <div className="device-preview">
                  <DeviceCard
                      data={histories[activeDeviceId][histories[activeDeviceId].length - 1]}
                      deviceName={getDeviceName(activeDeviceId)}
                      history={histories[activeDeviceId]}
                      preview
                  />
                </div>
            )}

            <div className="chart-side">
              <div className="chart-controls">
                <FormControl size="small">
                  <InputLabel id="chart-mode-label" sx={{ color: 'white' }}>
                    Chart type
                  </InputLabel>
                  <Select
                      labelId="chart-mode-label"
                      value={chartMode}
                      label="Chart type"
                      onChange={handleChartModeChange}
                      sx={{
                        backgroundColor: '#2a2a2a',
                        color: 'white',
                        width: '300px',
                        '& .MuiSvgIcon-root': { color: 'white' }
                      }}
                  >
                    <MenuItem value="single">For selected device</MenuItem>
                    <MenuItem value="combined">Combined (last hour)</MenuItem>
                  </Select>
                </FormControl>
              </div>

              <div className="chart-container">
                {chartMode === 'single' ? (
                    <Charts data={histories[activeDeviceId] ?? []} />
                ) : (
                    <CombinedChart data={combinedData} />
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="dashboard-bottom">
          <div className="device-grid">
            {deviceOrder.map(deviceId => {
              const history = histories[deviceId] || [];
              const latest = history[history.length - 1];
              const prev   = history[history.length - 2];

              const hasAnomaly = latest && prev && (
                  Math.abs(latest.temperature - prev.temperature) / (prev.temperature || 1) >= 0.2 ||
                  Math.abs(latest.pressure    - prev.pressure)    / (prev.pressure    || 1) >= 0.2 ||
                  Math.abs(latest.humidity    - prev.humidity)    / (prev.humidity    || 1) >= 0.2
              );
              const deviceName =getDeviceName(deviceId)
              return (
                  <DeviceCard
                      key={deviceId}
                      data={
                          latest ?? {
                            deviceId,
                            temperature: 0,
                            pressure: 0,
                            humidity: 0
                          }
                      }
                      deviceName={deviceName}
                      selected={deviceId === activeDeviceId}
                      history={history}
                      anomaly={hasAnomaly}
                      onClick={() => setActiveDeviceId(deviceId)}
                  />
              );
            })}
          </div>
        </div>
        </div>
      </div>
  );
};

export default Dashboard;
