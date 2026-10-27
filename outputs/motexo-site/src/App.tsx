import { Check } from '@phosphor-icons/react';
import { ServiceExplorer } from './explorers';
import Hero from './Hero';
import { ContactBanner, Footer, Header } from './shared';
import WorkGallery from './WorkGallery';
import Contact from './Contact';
import { instagram } from './data';

function Approach() {
  const steps = [
    { title: 'Understand the space', text: 'Start with what you need, and what is already there.' },
    { title: 'Plan the work', text: 'Talk through the requirements and practical next steps.' },
    { title: 'Install with care', text: 'Keep the details and the organization in view.' },
    { title: 'Walk through the result', text: 'Make space for the final details and your questions.' },
  ];
  return <section className="approach-section section" id="approach"><div className="container"><div className="section-heading"><h2>From the first look<br />to the final detail.</h2><p>A useful place to start: your space, your requirements,<br className="desktop-break" /> and a conversation about the work.</p></div>
    <ol className="process-list">{steps.map((step, index) => <li key={step.title}><span className="process-number">0{index + 1}</span><h3>{step.title}</h3><p>{step.text}</p></li>)}</ol>
    <div className="faq"><h3>A few practical questions.</h3>
      <details><summary>Can we discuss an existing installation?<span className="faq-plus" aria-hidden="true" /></summary><p>Yes. Tell us about the space, what is already there and what you would like to improve. The team can discuss the next steps with you.</p></details>
      <details><summary>What should I share about my project?<span className="faq-plus" aria-hidden="true" /></summary><p>The type of space, the work you need, its location and your preferred timing are a useful starting point. You can add photos when you speak with the team.</p></details>
      <details><summary>Are the work photos from Motexo?<span className="faq-plus" aria-hidden="true" /></summary><p>The work archive uses original collages shared on <a href={instagram} target="_blank" rel="noopener noreferrer">Motexo’s Instagram</a>. The scroll journey and service close-ups are illustrations used to explain the services.</p></details>
    </div>
  </div></section>;
}

function PageIntro({ title, description, page }: { title: React.ReactNode; description: React.ReactNode; page: string }) {
  return <div className="page-intro container"><div className="breadcrumb"><a href="/">Home</a><span>/</span><span>{page}</span></div><h1>{title}</h1><p>{description}</p></div>;
}

export default function App() {
  const page = window.location.pathname.split('/').filter(Boolean)[0] || 'home';
  const current = ['home', 'expertise', 'work', 'contact'].includes(page) ? page : 'home';
  return <>
    <Header page={current} />
    {current === 'home' && <main id="main"><Hero /><ServiceExplorer /><WorkGallery preview /><Approach /><ContactBanner /></main>}
    {current === 'expertise' && <main id="main"><PageIntro page="Expertise" title={<>Technical work.<br />Considered from every angle.</>} description={<>Electrical, IT and network infrastructure for offices, warehouses and event spaces.<br />Explore an area, then tell us what your space needs.</>} /><ServiceExplorer standalone /><div className="expertise-close"><div className="container"><h2>Details that<br />make sense.</h2><ul><li><Check size={22} aria-hidden="true" />Clear routes</li><li><Check size={22} aria-hidden="true" />Tidy connections</li><li><Check size={22} aria-hidden="true" />Considered finishes</li></ul></div></div><ContactBanner /></main>}
    {current === 'work' && <main id="main"><PageIntro page="Work" title={<>Work, in<br />the details.</>} description={<>A closer look at the people, spaces and technical work shared by Motexo.<br /><a className="text-link" href={instagram} target="_blank" rel="noopener noreferrer">From the Motexo Instagram archive</a></>} /><WorkGallery /><ContactBanner /></main>}
    {current === 'contact' && <Contact />}
    <Footer />
  </>;
}
