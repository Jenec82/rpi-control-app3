import { Activity } from 'lucide-react';

export default function MainHeading() {
    return (
        <div className='flex justify-center items-center gap-3'>
            <Activity className="w-8 h-8" />
            <h1 className="text-3xl font-bold ">RPI Control</h1>
        </div>
    )
}