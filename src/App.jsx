import { useState } from 'react';
import { useAuth } from "./context/AuthContext";
import LoginForm from "./components/LoginForm";
import MainHeading from "./components/MainHeading";
import MenuBar from './components/MenuBar'
// Konsta UI
import { App } from 'konsta/react';
import {
  Page,
} from 'konsta/react';

import MachinesList from './components/MachinesList'
import MachineDetail from './components/MachineDetail'



// Hlavní komponenta aplikace
function MyApp() {
  const { isLoggedIn } = useAuth();
  const [selectedDevice, setSelectedDevice] = useState(null);

  return (
    <App theme="ios">
      <Page>
        {isLoggedIn ? (
          <>
            <MenuBar onBack={selectedDevice ? () => setSelectedDevice(null) : undefined} />

            {selectedDevice ? (
              <MachineDetail device={selectedDevice} onBack={() => setSelectedDevice(null)} />
            ) : (
              <MachinesList onSelect={(d) => setSelectedDevice(d)} />
            )}
          </>
        ) : (
          <>
            <MainHeading />
            <LoginForm />
          </>
        )}
      </Page>
    </App>
  );
}

export default MyApp;