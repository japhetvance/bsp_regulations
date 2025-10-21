import Link from 'next/link';
import Image from 'next/image';

interface LogoProps {
  href?: string;
  width?: number;
  height?: number;
}

export default function Logo({ href = '/', width = 280, height = 120 }: LogoProps) {
  return (
    <Link href={href} className="inline-block transition-opacity hover:opacity-80">
      <Image 
        src="/logo.png" 
        alt="Etibank Logo" 
        width={width} 
        height={height}
        className="h-auto"
        priority
      />
    </Link>
  );
}

