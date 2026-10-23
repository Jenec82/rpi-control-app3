import {Loader} from 'lucide-react';

export default function Loading() {
    return (
        <div className='flex justify-center'>
            <Loader className='animate-spin text-gray-500 mr-2'/>
            <p className='pt-[2px] text-gray-500'>Loading...</p>
        </div>
    )
}