import { content, formatText } from './content';
import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import type { ServiceId } from './data';
import { serviceById, services } from './data';
import { Benefit, LinkButton, Lines } from './shared';

export function ServiceExplorer({ standalone = false }: { standalone?: boolean }) {
  const initial = new URLSearchParams(window.location.search).get('service');
  const [active, setActive] = useState<ServiceId>(serviceById(initial).id);
  const selected = serviceById(active);
  const reduce = useReducedMotion();
  function choose(id: ServiceId) {
    setActive(id);
    if (standalone) { const url = new URL(window.location.href); url.searchParams.set('service', id); window.history.replaceState(null, '', url); }
  }
  return <section className={'expertise-section section ' + (standalone ? 'expertise-standalone' : '')} id="expertise">
    <div className="container">
      {!standalone && <div className="section-heading"><h2><Lines text={content.expertise.title} /></h2><p>{content.expertise.text}</p></div>}
      <div className="service-explorer">
        <div className="service-selection"><div className="service-tabs" role="group" aria-label={content.expertise.chooseLabel}>{services.map(service => {

          return <button key={service.id} type="button" aria-pressed={active === service.id} aria-controls="service-content" onClick={() => choose(service.id)}><span>{service.name}</span></button>;
        })}</div><div className="existing-installation"><p>{content.expertise.existingTitle}</p><span>{content.expertise.existingText}</span><a className="text-link" href={'/contact/?service=' + active}>{content.common.discussProject}</a></div></div>
        <div id="service-content" className="service-content">
          <AnimatePresence mode="wait" initial={false}><motion.div key={active} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduce ? 0 : .12 }}>
            <figure className={'service-photo ' + (!selected.illustrative ? 'source-photo' : '')}><img src={'/assets/' + selected.image} alt={selected.alt} width="1536" height="1024" loading="lazy" /><figcaption>{selected.illustrative ? content.expertise.illustrationCaption : <a href={selected.source} target="_blank" rel="noopener noreferrer">{content.expertise.sourceCaption}</a>}</figcaption></figure>
            <div className="service-description"><h3>{selected.headline}</h3><p>{selected.description}</p></div>
            {standalone ? <><ul className="service-topics">{selected.topics.map(topic => <Benefit key={topic}>{topic}</Benefit>)}</ul><LinkButton href={'/contact/?service=' + active}>{content.common.discussProject}</LinkButton></> : <a className="text-link" href={'/expertise/?service=' + active}>{formatText(content.common.exploreService, {service: selected.short.toLowerCase()})}</a>}
          </motion.div></AnimatePresence>
        </div>
      </div>
    </div>
  </section>;
}
