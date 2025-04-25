import dynamic from 'next/dynamic';
const SafeHeader = dynamic(() => import('./Header'), { ssr: false });
export default SafeHeader;