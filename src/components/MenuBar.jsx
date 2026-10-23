import { useAuth } from '../context/AuthContext';
import MainHeading from './MainHeading';
import { ChevronLeft, Power } from 'lucide-react';

export default function MenuBar({ onBack }) {
  const { doLogout } = useAuth();

  return (
    <div className="flex justify-between p-2">
      {onBack ? (
        <div className="m-2 cursor-pointer" clear onClick={onBack}>
          <ChevronLeft className="text-blue-500" />
        </div>
      ) : (
        <div style={{ width: 40 }} />
      )}

      <MainHeading />

      <div className="m-2 cursor-pointer" clear onClick={doLogout}>
        <Power className="text-blue-500" />
      </div>
    </div>
  );
}
