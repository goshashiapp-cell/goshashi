import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <h1 className="text-6xl font-black text-brand-600 mb-2">404</h1>
      <h2 className="text-2xl font-bold text-slate-800 mb-4">Page Not Found</h2>
      <p className="text-slate-600 max-w-md mb-8">
        The service or page you are looking for does not exist or has been moved.
      </p>
      <Link
        href="/"
        className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-brand-600 text-white font-semibold shadow-md hover:bg-brand-700 transition"
      >
        Return to Home
      </Link>
    </div>
  );
}
