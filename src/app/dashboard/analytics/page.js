'use client';
import dynamic from 'next/dynamic';

const Analytics = dynamic(() => import('@/components/dashboard/Analytics'), { ssr: false });

export default function Page() {
  return <Analytics />;
}