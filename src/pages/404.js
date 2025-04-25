import Link from 'next/link';

export default function Custom404() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-bold text-purple-600 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Page Not Found</h2>
        <p className="text-gray-600 mb-8">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Link 
          href="/"
          className="bg-gradient-to-r from-red-500 to-purple-600 text-white px-6 py-3 rounded-md text-base font-medium hover:from-red-600 hover:to-purple-700 shadow-md"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
