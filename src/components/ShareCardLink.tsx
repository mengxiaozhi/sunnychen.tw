'use client';

import Link from 'next/link';
import type { ComponentProps } from 'react';
import { SHARE_CARD_ENTRY, SHARE_CARD_OPEN_EVENT } from '../data/share-card';

type Props = Omit<ComponentProps<typeof Link>, 'href'>;

/** Preserve normal links for new tabs; enhance an ordinary click into a drawer. */
export default function ShareCardLink({ onClick, children, ...props }: Props) {
  return <Link {...props} href={SHARE_CARD_ENTRY} aria-haspopup="dialog" aria-controls="share-card-drawer" onClick={event => {
    onClick?.(event);
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || props.target === '_blank') return;
    const request = new CustomEvent(SHARE_CARD_OPEN_EVENT, { cancelable: true, detail: { trigger: event.currentTarget } });
    // If the drawer has not hydrated yet, the ordinary hash link still works.
    if (!window.dispatchEvent(request)) event.preventDefault();
  }}>{children}</Link>;
}
