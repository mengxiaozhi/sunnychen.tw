import Image from 'next/image';

type BrandMarkProps = { className?: string; priority?: boolean };

/** Transparent derivative of the campaign's official Facebook cover name mark. */
export default function BrandMark({ className = '', priority = false }: BrandMarkProps) {
  return (
    <span className={`brand-mark ${className}`.trim()} aria-hidden="true">
      <Image className="brand-logo" src="/images/sunny-logo-v1.png" alt="" width={2172} height={724}
        sizes="(max-width:700px) 180px, 240px" priority={priority} />
      <span className="brand-caption">SUNNY CHEN</span>
    </span>
  );
}
