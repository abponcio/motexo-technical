import { content } from './content';
import { Fragment, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Check, InstagramLogo, Lightning, List, Network, Phone, Warehouse, X, CalendarDots, HouseLine } from '@phosphor-icons/react';
import type { ReactNode } from 'react';
import { businessPhone, instagram, whatsappNumber } from './data';

export function Lines({ text, desktop = false }: { text: string; desktop?: boolean }) {
  return <>{text.split('\n').map((line, index) => <Fragment key={index}>{index > 0 && <>{' '}<br className={desktop ? 'desktop-break' : undefined} /></>}{line}</Fragment>)}</>;
}

export const serviceIcons = { electrical: Lightning, networking: Network, automation: HouseLine, spaces: Warehouse, events: CalendarDots };
export function LinkButton({ href, children, className = '', external = false }: { href: string; children: ReactNode; className?: string; external?: boolean }) {
  return <a href={href} className={'button ' + className} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>{children}</a>;
}
export function Logo({ full = false }: { full?: boolean }) {
  return <span className={"logo " + (full ? "logo-full" : "logo-wordmark")}><img src="/assets/motexo-logo-full-enhanced.png" alt={full ? content.business.fullName : content.business.name} width="1983" height="793" /></span>;
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
  const links = [{ label: content.navigation.expertise, href: '/expertise/', page: 'expertise' }, { label: content.navigation.approach, href: '/#approach', page: 'approach' }, { label: content.navigation.work, href: '/work/', page: 'work' }, { label: content.navigation.contact, href: '/contact/', page: 'contact' }];
  return <>
    <a className="skip-link" href="#main">{content.navigation.skip}</a>
    <header className="site-header" ref={headerRef}>
      <div className="header-inner">
        <a href="/" className="brand" aria-label={content.common.homeLink}><Logo /></a>
        <nav aria-label={content.navigation.mainLabel} className="desktop-nav">{links.map(link => <a key={link.label} href={link.href} aria-current={page === link.page ? 'page' : undefined}>{link.label}</a>)}</nav>
        <LinkButton href="/contact/" className="header-enquiry">{content.common.discussProject}</LinkButton>
        <button ref={toggleRef} className="menu-toggle" aria-expanded={open} aria-controls="mobile-nav" aria-label={open ? content.navigation.close : content.navigation.open} onClick={() => setOpen(!open)}>{open ? <X size={28} /> : <List size={28} />}</button>
      </div>
      <AnimatePresence>{open && <motion.nav id="mobile-nav" className="mobile-nav" aria-label={content.navigation.mobileLabel} initial={{ opacity: 0, y: reduce ? 0 : -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: reduce ? 0 : -6 }} transition={{ duration: reduce ? 0 : .18 }}>
        {links.map(link => <a key={link.label} href={link.href} aria-current={page === link.page ? 'page' : undefined} onClick={() => setOpen(false)}>{link.label}</a>)}
        <LinkButton href="/contact/">{content.common.discussProject}</LinkButton>
      </motion.nav>}</AnimatePresence>
    </header>
  </>;
}

export function Footer() {
  return <footer className="site-footer">
    <div className="footer-main container">
      <div className="footer-brand"><a href="/" aria-label={content.common.homeLink}><Logo full /></a><p><Lines text={content.footer.tagline} /></p></div>
      <div><h2>{content.footer.explore}</h2><a href="/expertise/">{content.navigation.expertise}</a><a href="/#approach">{content.navigation.approach}</a><a href="/work/">{content.footer.work}</a></div>
      <div><h2>{content.footer.contact}</h2><a href="/contact/">{content.common.discussProject}</a><a href={'tel:+' + whatsappNumber}><Phone size={17} aria-hidden="true" />{businessPhone}</a><a href={instagram} target="_blank" rel="noopener noreferrer"><InstagramLogo size={18} aria-hidden="true" />{content.common.instagram}</a></div>
      <div className="footer-location"><h2>{content.footer.location}</h2><p><Lines text={content.business.address} /></p></div>
    </div>
    <div className="footer-bottom container"><span>© {new Date().getFullYear()} {content.business.fullName}</span><span>{content.footer.credit}</span></div>
  </footer>;
}


export function ContactBanner() {
  return <section className="contact-banner">
    <div className="container contact-banner-inner"><div><h2><Lines text={content.banner.title} /></h2><p><Lines text={content.banner.text} /></p><div className="banner-actions"><LinkButton href="/contact/" className="button-white">{content.common.discussProject}</LinkButton><a className="text-link" href={instagram} target="_blank" rel="noopener noreferrer">{content.common.viewInstagram}</a></div></div></div>
  </section>;
}


export function Benefit({ children }: { children: ReactNode }) {
  return <li>{children}<Check size={19} aria-hidden="true" /></li>;
}
