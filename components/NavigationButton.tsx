'use client';

import Link from 'next/link';

interface NavigationButtonProps {
  href: string;
  label: string;
}

export default function NavigationButton({ href, label }: NavigationButtonProps) {
  return (
    <Link 
      href={href}
      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
    >
      {label}
    </Link>
  );
}
