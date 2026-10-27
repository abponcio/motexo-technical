import { content, formatText } from './content';
import { useEffect, useRef, useState } from 'react';
import { MagnifyingGlassPlus, X } from '@phosphor-icons/react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import type { WorkCategory } from './data';
import { filterWork, work } from './data';
import { LinkButton, Lines } from './shared';

type WorkItem = typeof work[number];
const filters: { id: WorkCategory; label: string }[] = [
  { id: 'all', label: content.gallery.filters.all }, { id: 'infrastructure', label: content.gallery.filters.infrastructure },
  { id: 'spaces', label: content.gallery.filters.spaces }, { id: 'events', label: content.gallery.filters.events },
];

function PhotoDialog({ item, onClose }: { item: WorkItem | null; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (item && !dialog.current?.open) dialog.current?.showModal();
    if (!item && dialog.current?.open) dialog.current.close();
  }, [item]);
  return <dialog ref={dialog} className="photo-dialog" aria-labelledby="photo-title" onClose={onClose} onClick={event => { if (event.target === event.currentTarget) dialog.current?.close(); }}>
    {item && <div className="photo-dialog-content"><button className="icon-button dialog-close" aria-label={content.gallery.closePhoto} onClick={() => dialog.current?.close()}><X size={24} /></button><img src={'/assets/' + item.image} alt={formatText(content.gallery.imageAlt, {title: item.title})} width={item.width} height={item.height} /><div className="photo-dialog-caption"><div><h2 id="photo-title">{item.title}</h2><p>{content.gallery.sourceCaption}</p></div><a className="text-link" href={item.source} target="_blank" rel="noopener noreferrer">{content.gallery.originalPost}</a></div></div>}
  </dialog>;
}

export default function WorkGallery({ preview = false }: { preview?: boolean }) {
  const [category, setCategory] = useState<WorkCategory>('all');
  const [selected, setSelected] = useState<WorkItem | null>(null);
  const reduce = useReducedMotion();
  const items = preview ? work.slice(0, 2) : filterWork(category);
  return <section className={'work-section section ' + (preview ? 'work-preview' : 'work-standalone')}>
    <div className="container">
      {preview && <div className="section-heading"><h2><Lines text={content.gallery.title} /></h2><p><Lines text={content.gallery.text} /></p></div>}
      {!preview && <div className="work-filters" role="group" aria-label={content.gallery.filterLabel}>{filters.map(filter => <button key={filter.id} type="button" aria-pressed={filter.id === category} onClick={() => setCategory(filter.id)}>{filter.label}</button>)}</div>}
      <p className="visually-hidden" aria-live="polite" aria-atomic="true">{formatText(items.length === 1 ? content.gallery.imageCount : content.gallery.imagesCount, {count: items.length})}</p>
      <div className="work-grid">
        <AnimatePresence mode="popLayout" initial={false}>{items.map(item => <motion.article layout={!reduce} key={item.id} className={'work-item work-' + item.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduce ? 0 : .18 }}>
          <button className="work-image-button" onClick={() => setSelected(item)} aria-label={formatText(content.gallery.enlarge, {title: item.title.toLowerCase()})}><img src={'/assets/' + item.image} alt={formatText(content.gallery.imageAlt, {title: item.title})} width={item.width} height={item.height} loading="lazy" /><span className="enlarge-icon"><MagnifyingGlassPlus size={21} aria-hidden="true" /></span></button>
          <div className="work-caption"><h3>{item.title}</h3><p>{item.description}</p><a className="text-link" href={item.source} target="_blank" rel="noopener noreferrer">{content.gallery.originalPost}</a></div>
        </motion.article>)}</AnimatePresence>
      </div>
      {preview ? <div className="work-end"><p>{content.gallery.endText}</p><LinkButton href="/work/" className="button-outline">{content.gallery.explore}</LinkButton></div> : <p className="archive-note">{content.gallery.archiveNote}</p>}
    </div>
    <PhotoDialog item={selected} onClose={() => setSelected(null)} />
  </section>;
}
