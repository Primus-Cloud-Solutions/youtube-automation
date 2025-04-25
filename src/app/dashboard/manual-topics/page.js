'use client';
import dynamic from 'next/dynamic';

const ManualTopics = dynamic(() => import('@/components/dashboard/ManualTopics'), { ssr: false });

export default function Page() {
  return <ManualTopics />;
}