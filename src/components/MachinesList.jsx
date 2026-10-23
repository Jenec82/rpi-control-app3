import { useState, useEffect } from 'react';
import axios from 'axios';
import Loading from '../components/Loading';
import { useAuth } from "../context/AuthContext";
import { BlockTitle, List, ListItem, Button} from 'konsta/react';
import { RotateCw } from 'lucide-react';

export default function MachinesList({onSelect}) {
  const [devices, setDevices] = useState([]);
  const [refreshButtonEnabled, setRefreshButtonEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    fetchDevices();
    // Automatické obnovení každých 30 sekund
    const interval = setInterval(fetchDevices, 30000);
    return () => clearInterval(interval);
  }, []);


  const { formatEfficiency } = useAuth();
  const { formatAgo } = useAuth();
  const { getStatusIcon } = useAuth();

  const fetchDevices = async () => {
    setError(null);
    setRefreshButtonEnabled(false);
    try {
      const response = await axios.get('https://scraper.shopimo.cz/api/?method=agoChecker');
      console.log('Response status:', response.status);
           
      if ( response.status == 200 && response.data.result == 'ok' ) {
        // API returns devices in response.data.data
        setDevices(response.data.devices || []);
        setLoading(false);
        setRefreshButtonEnabled(true);
        console.log('Načteno zařízení:', json.data.length);
      } else {
        setError('Chyba při načítání dat: ' + JSON.stringify(response));
      }
    } catch (err) {
      setError('Nepodařilo se připojit k API: ' + err.message);
    } finally {
    }
  };


  return (
    <>
      {/* Manual refresh button shown under MenuBar on the list page */}
      
      <div className="flex justify-end p-2">
        <Button onClick={fetchDevices} disabled={!refreshButtonEnabled} title="Refresh">
          <RotateCw />
        </Button>
      </div>
      
      <BlockTitle className='font-medium'>MACHINES</BlockTitle>

      {loading ? (
        <Loading />
      ) : (
        <>
          <List strongIos outlineIos>
            {devices.map((device) => (
              <ListItem
                key={device.id}
                media={getStatusIcon(device)}
                link
                header={device.name}
                title={
                  <>
                    {formatAgo(device.workedAgoSec)}
                    <div className='flex justify-between border-0'>
                      <div className='text-xs w-[45px]'>{formatEfficiency(device.tasks_last_1_hour, device.estimatedSpeed)}</div>
                      <div className='text-xs w-[45px]'>{formatEfficiency(device.tasks_last_3_hour/3, device.estimatedSpeed)}</div>
                      <div className='text-xs w-[45px]'>{formatEfficiency(device.tasks_last_8_hour/8, device.estimatedSpeed)}</div>
                    </div>
                  </>
                }
                after="Details"
                className="border-gray-200 border-b"
                onClick={() => typeof onSelect === 'function' && onSelect(device)}
              />
            ))}
          </List>
        </>
      )}
      
    </>
  );
}