import { content } from './content';
import { Check } from '@phosphor-icons/react';
import { ServiceExplorer } from './explorers';
import Hero from './Hero';
import { ContactBanner, Footer, Header, Lines } from './shared';
import WorkGallery from './WorkGallery';
import Contact from './Contact';
import { instagram } from './data';

function Approach() {
  const steps = content.approach.steps;
  const faqs: { question: string; answer: string; linkText?: string; afterLink?: string }[] = content.approach.faqs;
  return <section className="approach-section section" id="approach"><div className="container"><div className="section-heading"><h2><Lines text={content.approach.title} /></h2><p><Lines text={content.approach.text} desktop /></p></div>
    <ol className="process-list">{steps.map((step, index) => <li key={step.title}><span className="process-number">0{index + 1}</span><h3>{step.title}</h3><p>{step.text}</p></li>)}</ol>
    <div className="faq"><h3>{content.approach.faqTitle}</h3>
      {faqs.map(faq => <details key={faq.question}><summary>{faq.question}<span className="faq-plus" aria-hidden="true" /></summary><p>{faq.answer}{faq.linkText && <> <a href={instagram} target="_blank" rel="noopener noreferrer">{faq.linkText}</a>{faq.afterLink}</>}</p></details>)}
    </div>
  </div></section>;
}

function PageIntro({ title, description, page }: { title: React.ReactNode; description: React.ReactNode; page: string }) {
  return <div className="page-intro container"><div className="breadcrumb"><a href="/">{content.common.home}</a><span>/</span><span>{page}</span></div><h1>{title}</h1><p>{description}</p></div>;
}

export default function App() {
  const page = window.location.pathname.split('/').filter(Boolean)[0] || 'home';
  const current = ['home', 'expertise', 'work', 'contact'].includes(page) ? page : 'home';
  return <>
    <Header page={current} />
    {current === 'home' && <main id="main"><Hero /><ServiceExplorer /><WorkGallery preview /><Approach /><ContactBanner /></main>}
    {current === 'expertise' && <main id="main"><PageIntro page={content.navigation.expertise} title={<Lines text={content.pages.expertise.title} />} description={<Lines text={content.pages.expertise.description} />} /><ServiceExplorer standalone /><div className="expertise-close"><div className="container"><h2><Lines text={content.pages.expertise.closingTitle} /></h2><ul>{content.pages.expertise.benefits.map(benefit => <li key={benefit}><Check size={22} aria-hidden="true" />{benefit}</li>)}</ul></div></div><ContactBanner /></main>}
    {current === 'work' && <main id="main"><PageIntro page={content.navigation.work} title={<Lines text={content.pages.work.title} />} description={<>{content.pages.work.description}<br /><a className="text-link" href={instagram} target="_blank" rel="noopener noreferrer">{content.pages.work.archiveLink}</a></>} /><WorkGallery /><ContactBanner /></main>}
    {current === 'contact' && <Contact />}
    <Footer />
  </>;
}
