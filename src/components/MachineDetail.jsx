import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../context/useAuth';
import Loading from '../components/Loading';
import { HatGlasses, History, HeartPulse } from 'lucide-react';
// Konsta UI
import { Block, List, ListItem, Toggle, BlockTitle } from 'konsta/react';
import axios from 'axios';


export default function MachineDetail({ device }) {
  const [isActive, setIsActive] = useState(false);
  const [machineDetails, setMachineDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activatorLoading, setActivatorLoading] = useState(false);
  // Refy drží aktuální hodnoty i pro interval (bez stale closure)
  const firstRef = useRef(true);
  const activatorLoadingRef = useRef(false);
  const deviceId = device?.id;

  const fetchMachineDetails = useCallback(async (force = false) => {
    if( activatorLoadingRef.current && !force ) return;
    try {
      const response = await axios.get(`https://scraper.shopimo.cz/api/?method=machineDetails&machine_id=${deviceId}`);
      if (response.data && response.data.result === 'ok') {
        if(firstRef.current) 
        {
          firstRef.current = false;
          activatorLoadingRef.current = false;
          setActivatorLoading(false);
        }
        setMachineDetails(response.data);
        setIsActive(response.data.active == 1); 
      }
    } catch (error) {
      console.error('Error fetching machine details:', error);
    } finally {
      setLoading(false);
    }
  }, [deviceId]);

  useEffect(() => {
    fetchMachineDetails();

    if (deviceId) {
      // Automatické obnovení každých 30 sekund
      const interval = setInterval(() => fetchMachineDetails(), 30000);
      return () => clearInterval(interval);
    }
  }, [deviceId, fetchMachineDetails]);

  const handleToggle = async (toggled) => {
    activatorLoadingRef.current = true;
    setActivatorLoading(true);
    const value = toggled ? 1 : 0;
    const API_URL = `https://scraper.shopimo.cz/api/?method=machineUpdate&machine_id=${device.id}&do=active&value=${value}`;
    setIsActive(toggled);
    try {
      await axios.get(API_URL);
      await fetchMachineDetails(true);
    } catch (error) {
      console.error('Error updating machine status:', error);
    } finally {
      activatorLoadingRef.current = false;
      setActivatorLoading(false);
    }
  };

  const { getStatusIcon } = useAuth();
  const { formatAgo } = useAuth();
  const { formatEfficiency } = useAuth();


  return (
    <>
      <Block strong inset outline className='flex justify-between'>
        <div className='flex-1 mt-4'>
          {machineDetails && getStatusIcon(machineDetails) }
        </div>
        <div className='flex-5'>
          <h2 className="text-lg font-bold">{device?.name ?? 'Device'}</h2>
          <p className="mt-4">{device.ip}</p>
        </div>
      </Block>

      {loading ? (
        <Loading />
      ) : (
        <>
          <BlockTitle className='font-medium'>STATUS</BlockTitle>

          <List inset strongIos outlineIos>
            <ListItem
              label
              title="Active"
              className="border-gray-200 border-b"
              after={
                <Toggle
                  checked={isActive}
                  disabled={activatorLoading}
                  onChange={() => handleToggle(!machineDetails.active)}
                />
              }
            />
          </List>       

          <BlockTitle className='font-medium'>ACTIVITY</BlockTitle>
          <List inset strongIos outlineIos>
            <ListItem
              media={<HeartPulse />}
              title="Last alive"
              className="border-gray-200 border-b"
              after={formatAgo(machineDetails.aliveAgoSec)}
            />
            <ListItem
              media={<HatGlasses />}
              title="Last worked"
              className="border-gray-200 border-b"
              after={formatAgo(machineDetails.workedAgoSec)}
            />
            <ListItem
              media={<History />}
              title="Efficiency last hour"
              className="border-gray-200 border-b"
              after={
                <>
                  {machineDetails.tasks_last_1_hour} |
                  {formatEfficiency(machineDetails.tasks_last_1_hour/1, machineDetails.estimatedSpeed)}
                </>
              }
            />
            <ListItem
              media={<History />}
              title="Efficiency last 3 hours"
              className="border-gray-200 border-b"
              after={
                <>
                  {Math.round(machineDetails.tasks_last_3_hour/3)} |
                  {formatEfficiency(machineDetails.tasks_last_3_hour/3, machineDetails.estimatedSpeed)}
                </>
              }
            />
            <ListItem
              media={<History />}
              title="Efficiency last 8 hours"
              className="border-gray-200 border-b"
              after={
                <>
                  {Math.round(machineDetails.tasks_last_8_hour/8)} |
                  {formatEfficiency(machineDetails.tasks_last_8_hour/8, machineDetails.estimatedSpeed)}
                </>
              }
            />
            
          </List>
        </>
      )}
      
    </>
  );
}

