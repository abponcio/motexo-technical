import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Check, InstagramLogo, Lightning, List, Network, Phone, Warehouse, X, CalendarDots } from '@phosphor-icons/react';
import type { ReactNode } from 'react';
import { businessPhone, instagram, whatsappNumber } from './data';

export const serviceIcons = { electrical: Lightning, networking: Network, spaces: Warehouse, events: CalendarDots };
export function LinkButton({ href, children, className = '', external = false }: { href: string; children: ReactNode; className?: string; external?: boolean }) {
  return <a href={href} className={'button ' + className} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>{children}</a>;
}
export function Logo({ full = false }: { full?: boolean }) {
  return <span className={"logo " + (full ? "logo-full" : "logo-wordmark")}><img src="/assets/motexo-logo-full-enhanced.png" alt={full ? "Motexo Technical and Cleaning Services" : "Motexo"} width="1983" height="793" /></span>;
}

export function Header({ page }: { page: string }) {
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  useEffect(() => {
    if (!open) return;
    const key = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { setOpen(false); toggleRef.current?.focus(); }
    };
    const outside = (event: PointerEvent) => { if (!headerRef.current?.contains(event.target as Node)) setOpen(false); };
    document.addEventListener('keydown', key);
    document.addEventListener('pointerdown', outside);
    return () => { document.removeEventListener('keydown', key); document.removeEventListener('pointerdown', outside); };
  }, [open]);
  const links = [{ label: 'Expertise', href: '/expertise/', page: 'expertise' }, { label: 'Our approach', href: '/#approach', page: 'approach' }, { label: 'Work', href: '/work/', page: 'work' }, { label: 'Contact', href: '/contact/', page: 'contact' }];
  return <>
    <a className="skip-link" href="#main">Skip to content</a>
    <header className="site-header" ref={headerRef}>
      <div className="header-inner">
        <a href="/" className="brand" aria-label="Motexo home"><Logo /></a>
        <nav aria-label="Main navigation" className="desktop-nav">{links.map(link => <a key={link.label} href={link.href} aria-current={page === link.page ? 'page' : undefined}>{link.label}</a>)}</nav>
        <LinkButton href="/contact/" className="header-enquiry">Discuss your project</LinkButton>
        <button ref={toggleRef} className="menu-toggle" aria-expanded={open} aria-controls="mobile-nav" aria-label={open ? 'Close navigation' : 'Open navigation'} onClick={() => setOpen(!open)}>{open ? <X size={28} /> : <List size={28} />}</button>
      </div>
      <AnimatePresence>{open && <motion.nav id="mobile-nav" className="mobile-nav" aria-label="Mobile navigation" initial={{ opacity: 0, y: reduce ? 0 : -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: reduce ? 0 : -6 }} transition={{ duration: reduce ? 0 : .18 }}>
        {links.map(link => <a key={link.label} href={link.href} aria-current={page === link.page ? 'page' : undefined} onClick={() => setOpen(false)}>{link.label}</a>)}
        <LinkButton href="/contact/">Discuss your project</LinkButton>
      </motion.nav>}</AnimatePresence>
    </header>
  </>;
}

export function Footer() {
  return <footer className="site-footer">
    <div className="footer-main container">
      <div className="footer-brand"><a href="/" aria-label="Motexo home"><Logo full /></a><p>Technical work.<br />Care in the details.</p></div>
      <div><h2>Explore</h2><a href="/expertise/">Expertise</a><a href="/#approach">Our approach</a><a href="/work/">Our work</a></div>
      <div><h2>Let’s talk</h2><a href="/contact/">Discuss your project</a><a href={'tel:+' + whatsappNumber}><Phone size={17} aria-hidden="true" />{businessPhone}</a><a href={instagram} target="_blank" rel="noopener noreferrer"><InstagramLogo size={18} aria-hidden="true" />Instagram</a></div>
      <div className="footer-location"><h2>Based in Dubai</h2><p>Port Saeed, Deira<br />Dubai, United Arab Emirates</p></div>
    </div>
    <div className="footer-bottom container"><span>© {new Date().getFullYear()} Motexo Technical and Cleaning Services</span><span>Built around the details.</span></div>
  </footer>;
}


export function ContactBanner() {
  return <section className="contact-banner">
    <div className="container contact-banner-inner"><div><h2>Let’s get your<br />space working.</h2><p>Tell us what needs doing.<br />Start a conversation about your project.</p><div className="banner-actions"><LinkButton href="/contact/" className="button-white">Discuss your project</LinkButton><a className="text-link" href={instagram} target="_blank" rel="noopener noreferrer">View Instagram</a></div></div></div>
  </section>;
}


export function Benefit({ children }: { children: ReactNode }) {
  return <li>{children}<Check size={19} aria-hidden="true" /></li>;
}
