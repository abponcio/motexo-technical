import { useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SecurityCamera, WifiHigh } from '@phosphor-icons/react';
import { LinkButton } from './shared';
import { chapterAt, copyVisibleAt, scrollAt, storyDuration, storyShots } from './story';
import type { StoryRig } from './story-scene';
import { cameraAt } from './camera-score';

gsap.registerPlugin(ScrollTrigger);
declare global { interface Window { __timelines?: Record<string, gsap.core.Timeline> } }
export default function Hero() {
  const [reduce, setReduce] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  useLayoutEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduce(preference.matches);
    preference.addEventListener('change', update);
    return () => preference.removeEventListener('change', update);
  }, []);
  const root = useRef<HTMLElement>(null), host = useRef<HTMLDivElement>(null), switchTarget = useRef<HTMLButtonElement>(null), markers = useRef<(HTMLButtonElement | null)[]>([]);
  const trigger = useRef<ScrollTrigger | null>(null);
  const [chapter, setChapter] = useState(0), [copyVisible, setCopyVisible] = useState(true), [ready, setReady] = useState(false), [failed, setFailed] = useState(false);
  const [annotation, setAnnotation] = useState<number | null>(null);
  useLayoutEffect(() => {
    setReady(false); setFailed(false);
    let disposed = false, refreshFrame = 0, scene: Awaited<ReturnType<typeof import('./story-scene').createStoryScene>> | null = null;
    const context = gsap.context(() => {
      import('./story-scene').then(async module => {
        if (disposed || !host.current) return;
        try {
          scene = await module.createStoryScene(host.current, markers.current.filter(Boolean) as HTMLButtonElement[], switchTarget.current!);
          if (disposed) { scene.dispose(); return; }
          const rig: StoryRig = scene.rig; Object.assign(rig, cameraAt(0));
          const timeline = gsap.timeline({ paused: true, defaults: { ease: 'power2.inOut' }, onUpdate: () => { Object.assign(rig, cameraAt(timeline.time())); scene?.render(); setCopyVisible(copyVisibleAt(timeline.time())); setChapter(previous => { const next = chapterAt(timeline.time()); return previous === next ? previous : next; }); } });
          timeline.to(rig, { power: 1, duration: .7, ease: 'back.out(1.4)' }, .35)
            .to(rig, { phase: 1, duration: 1.4 }, 3.3)
            .to(rig, { door: 1, duration: 1.3, ease: 'power3.out' }, 4.3)
            .to(rig, { phase: 2, duration: 1.7, ease: 'none' }, 7)
            .to(rig, { phase: 2.9, duration: 1 }, 10.8)
            .to(rig, { phase: 3.6, duration: 2.2 }, 11.8)
            .to(rig, { phase: 3.8, duration: 1.1 }, 14)
            .to(rig, { phase: 4.2, duration: 1.3 }, 15.1)
            .to(rig, { flight: 1, duration: .6 }, 15.1)
            .to(rig, { travel: 1, duration: 2.9, ease: 'sine.inOut' }, 15.3)
            .to(rig, { flight: 0, duration: 1.1 }, 17.7)
            .to(rig, { phase: 4.8, night: 1, duration: 2.4 }, 16.4)
            .to(rig, { phase: 5, duration: 1.2 }, 18.8);
          const copies = root.current!.querySelectorAll<HTMLElement>('.story-copy');
          storyShots.forEach((shot, index) => {
            if (index > 0) timeline.fromTo(copies[index], { y: 45, opacity: 0 }, { y: 0, opacity: 1, duration: .65, ease: 'power3.out' }, index === 4 ? 18.1 : shot.start + .2);
            if (index < storyShots.length - 1) timeline.to(copies[index], { y: -35, opacity: 0, duration: .55, ease: 'power2.in' }, index === 0 ? 1.1 : index === 3 ? 14.75 : shot.end - .9);
          });
          timeline.fromTo('.story-progress > span', { scaleX: 0 }, { scaleX: 1, ease: 'none', duration: storyDuration }, 0);
          window.__timelines ??= {}; window.__timelines['motexo-hero-scroll'] = timeline;
          let stableChapter = -1;
          trigger.current = ScrollTrigger.create({ trigger: root.current, start: () => 'top ' + (window.innerWidth <= 760 ? 72 : 84), end: 'bottom bottom', animation: reduce ? undefined : timeline, scrub: reduce ? false : .65, invalidateOnRefresh: true,
            onUpdate: self => {
              if (!reduce) return;
              const index = chapterAt(self.progress * storyDuration);
              if (index !== stableChapter) { stableChapter = index; timeline.seek(storyShots[index].time, false); }
            },
          });
          setFailed(false); setReady(true); scene.render();
          refreshFrame = requestAnimationFrame(() => { if (!disposed) ScrollTrigger.refresh(); });
        } catch (error) { scene?.dispose(); scene = null; trigger.current?.kill(); trigger.current = null; window.__timelines?.['motexo-hero-scroll']?.kill(); delete window.__timelines?.['motexo-hero-scroll']; console.error('Motexo story could not initialize', error); setReady(false); setChapter(0); setFailed(true); }
      }).catch(() => { if (!disposed) setFailed(true); });
    }, root);
    const externalSeek = (event: Event) => { const time = (event as CustomEvent<{ time: number }>).detail?.time; if (Number.isFinite(time)) { trigger.current?.getTween()?.pause(); window.__timelines?.['motexo-hero-scroll']?.seek(time, false); } };
    window.addEventListener('hf-seek', externalSeek);
    return () => { disposed = true; cancelAnimationFrame(refreshFrame); window.removeEventListener('hf-seek', externalSeek); trigger.current?.kill(); trigger.current = null; window.__timelines?.['motexo-hero-scroll']?.kill(); delete window.__timelines?.['motexo-hero-scroll']; context.revert(); scene?.dispose(); };
  }, [reduce]);
  function seek(time: number) {
    if (trigger.current) window.scrollTo({ top: scrollAt(time, trigger.current.start, trigger.current.end), behavior: 'instant' });
  }
  function toggleSwitch() {
    const time = switchTarget.current?.getAttribute('aria-pressed') === 'true' ? 0 : 2.2;
    if (reduce) window.__timelines?.['motexo-hero-scroll']?.seek(time, false);
    else seek(time);
  }
  const shot = storyShots[chapter];
  return <section ref={root} className={'story-scroll ' + (ready ? 'story-ready' : '') + (failed ? ' story-failed' : '')} data-chapter={chapter} data-composition-id="motexo-hero-scroll" data-duration={storyDuration} aria-label="A journey through Motexo’s technical services">
    <div className="story-stage" aria-busy={!ready && !failed}>
      <div className="story-poster" aria-hidden="true" />
      <div ref={host} className="story-canvas" aria-hidden="true" />
      <button ref={switchTarget} className="story-switch" hidden disabled={!ready} aria-label="Switch on and follow the story" aria-pressed="false" onClick={toggleSwitch} />
      <div className="story-shade" aria-hidden="true" />
      {storyShots.map((item, index) => <div key={item.name} className={'story-copy story-copy-' + index} inert={(!ready && !failed) || chapter !== index || !copyVisible} aria-hidden={chapter !== index || !copyVisible}>
        {index === 0 ? <h1>{item.title[0]}<br />{item.title[1]}</h1> : <h2>{item.title[0]}<br />{item.title[1]}</h2>}
        <p>{item.text}</p>
        {index === 0 ? <div className="story-actions"><LinkButton href="/contact/" className="button-white">Discuss your project</LinkButton></div> : <a className="text-link" href={'/expertise/?service=' + item.service}>Explore {index === 1 ? 'electrical works' : index === 2 ? 'IT & networking' : index === 3 ? 'office & warehouse' : 'event support'}</a>}
        {index === 4 && <a className="story-real-work" href="/work/">See the real work</a>}
      </div>)}
      <div className="story-markers" aria-label="Illustrative venue infrastructure">{Array.from({ length: 5 }, (_, index) => <button key={index} ref={element => { markers.current[index] = element; }} hidden className="story-marker" aria-label={(index < 3 ? 'CCTV camera' : 'Wi-Fi access point') + ' location ' + (index + 1)} aria-pressed={annotation === index} onClick={() => setAnnotation(annotation === index ? null : index)}>
        {index < 3 ? <SecurityCamera size={19} weight="light" aria-hidden="true" /> : <WifiHigh size={19} weight="light" aria-hidden="true" />}<span>{index < 3 ? 'CCTV' : 'Wi-Fi AP'}</span>
      </button>)}</div>
      {chapter === 4 && annotation !== null && <div className="story-annotation" role="status"><p>{annotation < 3 ? 'CCTV placement' : 'Wireless access points'}</p><span>{annotation < 3 ? 'An illustrative view of camera positions around the venue.' : 'An illustrative view of connectivity across the venue.'}</span><button onClick={() => setAnnotation(null)} aria-label="Close infrastructure detail">Close</button></div>}
      <div className="story-footer">
        <div className="story-navigation"><nav aria-label="Jump to a service scene">{storyShots.map((item, index) => <button key={item.name} disabled={!ready} onClick={() => seek(item.time)} aria-current={chapter === index ? 'step' : undefined}><span>{item.name}</span></button>)}</nav><div className="story-progress" aria-hidden="true"><span /></div><div className="story-scroll-cue"><span className="scroll-track" aria-hidden="true"><span /></span><p>{ready ? 'Scroll to follow the story' : failed ? 'Explore our services below' : 'Preparing the scene…'}</p></div></div>
      </div>
      {!ready && !failed && <div className="story-loader" role="status"><img src="/assets/motexo-gear.png" alt="" width="72" height="72" /><span className="visually-hidden">Loading the Motexo story…</span></div>}
      <span className="visually-hidden" aria-live="polite">{shot.name}</span>
    </div>
  </section>;
}
