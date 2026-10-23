import { useAuth } from '../context/AuthContext';
import { ChevronLeft, Power } from 'lucide-react';

export default function MenuBar({ isLoggedIn, onBack }) {
  const { doLogout } = useAuth();

  if (!isLoggedIn) {
    return (
      <div className="flex flex-col items-center mt-2">
        <h1 className="text-3xl font-bold">RPI Control</h1>
        <img src="favicon/android-chrome-192x192.png" alt="RPI Control" className="h-[192px] w-[192px]" />
      </div>
    );
  }

  return (
    <div className="flex flex-row justify-between items-center p-2">
      {onBack ? (
        <div className="m-2 cursor-pointer" onClick={onBack}>
          <ChevronLeft className="text-blue-500" />
        </div>
      ) : (
        <div style={{ width: 40 }} />
      )}

      <div className="flex flex-row items-center gap-3">
        <img src="favicon/android-chrome-192x192.png" alt="" className="h-[40px]" />
        <h1 className="text-3xl font-bold">RPI Control</h1>
      </div>

      <div className="m-2 cursor-pointer" onClick={doLogout}>
        <Power className="text-blue-500" />
      </div>
    </div>
  );
}
