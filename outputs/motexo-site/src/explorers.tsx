import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import type { ServiceId } from './data';
import { serviceById, services } from './data';
import { Benefit, LinkButton } from './shared';

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
      {!standalone && <div className="section-heading"><h2>What your<br />space needs.</h2><p>Practical technical support for the spaces your business depends on.</p></div>}
      <div className="service-explorer">
        <div className="service-selection"><div className="service-tabs" role="group" aria-label="Choose an area of expertise">{services.map(service => {

          return <button key={service.id} type="button" aria-pressed={active === service.id} aria-controls="service-content" onClick={() => choose(service.id)}><span>{service.name}</span></button>;
        })}</div><div className="existing-installation"><p>Already have an installation?</p><span>Let’s talk about what needs improving.</span><a className="text-link" href={'/contact/?service=' + active}>Discuss your project</a></div></div>
        <div id="service-content" className="service-content">
          <AnimatePresence mode="wait" initial={false}><motion.div key={active} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduce ? 0 : .12 }}>
            <figure className={'service-photo ' + (!selected.illustrative ? 'source-photo' : '')}><img src={'/assets/' + selected.image} alt={selected.alt} width="1536" height="1024" loading="lazy" /><figcaption>{selected.illustrative ? 'Illustrative installation' : <a href={'source' in selected ? selected.source : undefined} target="_blank" rel="noopener noreferrer">From Motexo’s social archive</a>}</figcaption></figure>
            <div className="service-description"><h3>{selected.headline}</h3><p>{selected.description}</p></div>
            {standalone ? <><ul className="service-topics">{selected.topics.map(topic => <Benefit key={topic}>{topic}</Benefit>)}</ul><LinkButton href={'/contact/?service=' + active}>Discuss your project</LinkButton></> : <a className="text-link" href={'/expertise/?service=' + active}>Explore {selected.short.toLowerCase()}</a>}
          </motion.div></AnimatePresence>
        </div>
      </div>
    </div>
  </section>;
}
