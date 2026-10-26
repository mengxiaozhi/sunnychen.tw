import type { SVGProps } from 'react';

type ArrowProps = SVGProps<SVGSVGElement> & {
  diagonal?: boolean;
};

export default function Arrow({ diagonal = false, className = 'arrow', ...props }: ArrowProps) {
  return (
    <svg {...props} className={className} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d={diagonal ? 'M6 18 18 6M6 6h12v12' : 'M4 12h15m-6-6 6 6-6 6'} />
    </svg>
  );
}
