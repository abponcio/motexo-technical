import { useEffect, useRef, useState } from 'react';
import { MagnifyingGlassPlus, X } from '@phosphor-icons/react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import type { WorkCategory } from './data';
import { filterWork, work } from './data';
import { LinkButton } from './shared';

type WorkItem = typeof work[number];
const filters: { id: WorkCategory; label: string }[] = [
  { id: 'all', label: 'All work' }, { id: 'infrastructure', label: 'Electrical & infrastructure' },
  { id: 'spaces', label: 'Spaces & interiors' }, { id: 'events', label: 'Events' },
];

function PhotoDialog({ item, onClose }: { item: WorkItem | null; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (item && !dialog.current?.open) dialog.current?.showModal();
    if (!item && dialog.current?.open) dialog.current.close();
  }, [item]);
  return <dialog ref={dialog} className="photo-dialog" aria-labelledby="photo-title" onClose={onClose} onClick={event => { if (event.target === event.currentTarget) dialog.current?.close(); }}>
    {item && <div className="photo-dialog-content"><button className="icon-button dialog-close" aria-label="Close photo" onClick={() => dialog.current?.close()}><X size={24} /></button><img src={'/assets/' + item.image} alt={item.title + ', original collage shared by Motexo'} width={item.width} height={item.height} /><div className="photo-dialog-caption"><div><h2 id="photo-title">{item.title}</h2><p>From Motexo’s social archive.</p></div><a className="text-link" href={item.source} target="_blank" rel="noopener noreferrer">View original post</a></div></div>}
  </dialog>;
}

export default function WorkGallery({ preview = false }: { preview?: boolean }) {
  const [category, setCategory] = useState<WorkCategory>('all');
  const [selected, setSelected] = useState<WorkItem | null>(null);
  const reduce = useReducedMotion();
  const items = preview ? work.slice(0, 2) : filterWork(category);
  return <section className={'work-section section ' + (preview ? 'work-preview' : 'work-standalone')}>
    <div className="container">
      {preview && <div className="section-heading"><h2>On site.<br />In the details.</h2><p>The real people. The practical work.<br />Shared by Motexo, from site to site.</p></div>}
      {!preview && <div className="work-filters" role="group" aria-label="Filter work">{filters.map(filter => <button key={filter.id} type="button" aria-pressed={filter.id === category} onClick={() => setCategory(filter.id)}>{filter.label}</button>)}</div>}
      <p className="visually-hidden" aria-live="polite" aria-atomic="true">{items.length} work {items.length === 1 ? 'image' : 'images'} shown.</p>
      <div className="work-grid">
        <AnimatePresence mode="popLayout" initial={false}>{items.map(item => <motion.article layout={!reduce} key={item.id} className={'work-item work-' + item.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduce ? 0 : .18 }}>
          <button className="work-image-button" onClick={() => setSelected(item)} aria-label={'Enlarge ' + item.title.toLowerCase()}><img src={'/assets/' + item.image} alt={item.title + ', original collage shared by Motexo'} width={item.width} height={item.height} loading="lazy" /><span className="enlarge-icon"><MagnifyingGlassPlus size={21} aria-hidden="true" /></span></button>
          <div className="work-caption"><h3>{item.title}</h3><p>{item.description}</p><a className="text-link" href={item.source} target="_blank" rel="noopener noreferrer">View original post</a></div>
        </motion.article>)}</AnimatePresence>
      </div>
      {preview ? <div className="work-end"><p>See more of the work shared by the team.</p><LinkButton href="/work/" className="button-outline">Explore our work</LinkButton></div> : <p className="archive-note">Original social collages, shared in 2021. Some include architectural renderings alongside work photographs.</p>}
    </div>
    <PhotoDialog item={selected} onClose={() => setSelected(null)} />
  </section>;
}
