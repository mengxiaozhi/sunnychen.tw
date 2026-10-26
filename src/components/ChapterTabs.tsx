'use client';

import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import Arrow from './Arrow';

type Props = {
  chapters: Array<{ id: string; label: string }>;
  panels: ReactNode[];
};

export default function ChapterTabs({ chapters, panels }: Props) {
  const [selected, setSelected] = useState(0);
  const tabs = useRef<Array<HTMLButtonElement | null>>([]);
  const firstRender = useRef(true);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    const panel = document.getElementById(`panel-${chapters[selected].id}`);
    panel?.closest('main')?.dispatchEvent(new CustomEvent('sunny:chapterchange', { detail: { panel } }));
  }, [chapters, selected]);

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next: number;
    switch (event.key) {
      case 'ArrowRight': next = (index + 1) % chapters.length; break;
      case 'ArrowLeft': next = (index - 1 + chapters.length) % chapters.length; break;
      case 'Home': next = 0; break;
      case 'End': next = chapters.length - 1; break;
      default: return;
    }
    event.preventDefault();
    setSelected(next);
    tabs.current[next]?.focus();
  }

  return (
    <>
      <div className="chapter-tabs" role="tablist" aria-label="人生故事章節">
        {chapters.map((chapter, index) => (
          <button key={chapter.id} type="button" id={`tab-${chapter.id}`} role="tab"
            ref={element => { tabs.current[index] = element; }}
            aria-controls={`panel-${chapter.id}`} aria-selected={selected === index}
            tabIndex={selected === index ? 0 : -1} data-chapter={chapter.id}
            onClick={() => setSelected(index)} onKeyDown={event => handleKeyDown(event, index)}>
            <span>0{index + 1}</span>{chapter.label}<Arrow diagonal />
          </button>
        ))}
      </div>
      {panels.map((panel, index) => (
        <div key={chapters[index].id} className="chapter-panel" id={`panel-${chapters[index].id}`}
          role="tabpanel" aria-labelledby={`tab-${chapters[index].id}`} tabIndex={0} hidden={selected !== index}>
          {panel}
        </div>
      ))}
    </>
  );
}
