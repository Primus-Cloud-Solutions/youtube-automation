'use client';
import dynamic from 'next/dynamic';

const SignupPage = dynamic(() => import('@/components/SignupPage'), { ssr: false });

export default function Page() {
  return <SignupPage />;
}