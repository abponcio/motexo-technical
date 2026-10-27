import { content } from './content';
import { useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { Check, Copy, InstagramLogo, WhatsappLogo } from '@phosphor-icons/react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { businessPhone, instagram, serviceById, services, whatsappNumber } from './data';
import type { Enquiry, EnquiryErrors } from './enquiry';
import { enquiryMessage, validateEnquiry, whatsappDraft } from './enquiry';
import { Lines, serviceIcons } from './shared';

export default function Contact() {
  const selectedService = serviceById(new URLSearchParams(window.location.search).get('service'));
  const [value, setValue] = useState<Enquiry>({ service: selectedService.id, space: content.contact.spaces[0], name: '', contact: '', project: '' });
  const [errors, setErrors] = useState<EnquiryErrors>({});
  const [review, setReview] = useState(false);
  const [copyStatus, setCopyStatus] = useState('');
  const nameRef = useRef<HTMLInputElement>(null);
  const contactRef = useRef<HTMLInputElement>(null);
  const projectRef = useRef<HTMLTextAreaElement>(null);
  const reviewRef = useRef<HTMLHeadingElement>(null);
  const formTitleRef = useRef<HTMLHeadingElement>(null);
  const returning = useRef(false);
  const reduce = useReducedMotion();
  const message = enquiryMessage(value);
  function change(field: keyof Enquiry, next: string) {
    setValue(previous => ({ ...previous, [field]: next }));
    if (field === 'name' || field === 'contact' || field === 'project') setErrors(previous => ({ ...previous, [field]: undefined }));
  }
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const found = validateEnquiry(value);
    setErrors(found);
    if (Object.keys(found).length) {
      const input = found.name ? nameRef : found.contact ? contactRef : projectRef;
      input.current?.focus();
      return;
    }
    setReview(true);
    setCopyStatus('');
  }
  async function copy() {
    try { await navigator.clipboard.writeText(message); setCopyStatus(content.contact.copied); }
    catch { setCopyStatus(content.contact.copyFailed); }
  }
  return <main id="main" className="contact-page">
    <div className="contact-layout">
      <section className="contact-intro">
        <div className="breadcrumb"><a href="/">{content.common.home}</a><span>/</span><span>{content.navigation.contact}</span></div>
        <h1><Lines text={content.contact.title} /></h1><p><Lines text={content.contact.text} /></p>
        <div className="contact-intro-bottom"><p><Lines text={content.contact.spacesText} /></p><a href={'tel:+' + whatsappNumber} className="contact-phone">{businessPhone}</a><a className="text-link" href={instagram} target="_blank" rel="noopener noreferrer"><InstagramLogo size={20} aria-hidden="true" />{content.common.viewInstagram}</a></div>
      </section>
      <section className="enquiry-section" aria-label={content.contact.label}>
        <ol className="enquiry-steps"><li aria-current={!review ? 'step' : undefined}>{content.contact.steps[0]}</li><li aria-current={review ? 'step' : undefined}>{content.contact.steps[1]}</li></ol>
        <AnimatePresence mode="wait" initial={false}>
          {!review ? <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduce ? 0 : .12 }} onAnimationComplete={() => { if (returning.current) { formTitleRef.current?.focus(); returning.current = false; } }}>
            <h2 tabIndex={-1} ref={formTitleRef}>{content.contact.formTitle}</h2>
            <form onSubmit={submit} noValidate>
              <fieldset className="service-choices"><legend className="visually-hidden">{content.contact.serviceLabel}</legend>{services.map(service => { const Icon = serviceIcons[service.id]; return <label className="service-choice" key={service.id}><input type="radio" name="service" value={service.id} checked={value.service === service.id} onChange={() => change('service', service.id)} /><span className="service-choice-body"><Icon size={28} weight="light" aria-hidden="true" /><span>{service.name}</span><span className="choice-mark" aria-hidden="true">{value.service === service.id && <Check size={16} weight="bold" />}</span></span></label>; })}</fieldset>
              <fieldset className="space-choices"><legend>{content.contact.spaceLabel}</legend><div>{content.contact.spaces.map(space => <label key={space}><input type="radio" name="space" checked={value.space === space} onChange={() => change('space', space)} /><span>{space}</span></label>)}</div></fieldset>
              <div className="field-row">
                <div className="field"><label htmlFor="name">{content.contact.nameLabel}</label><input id="name" ref={nameRef} autoComplete="name" maxLength={120} required value={value.name} aria-invalid={!!errors.name} aria-describedby={errors.name ? 'name-error' : undefined} onChange={event => change('name', event.target.value)} />{errors.name && <p id="name-error" className="field-error">{errors.name}</p>}</div>
                <div className="field"><label htmlFor="contact">{content.contact.contactLabel}</label><input id="contact" ref={contactRef} type="text" autoComplete="email" maxLength={120} required value={value.contact} aria-invalid={!!errors.contact} aria-describedby={errors.contact ? 'contact-error' : undefined} onChange={event => change('contact', event.target.value)} />{errors.contact && <p id="contact-error" className="field-error">{errors.contact}</p>}</div>
              </div>
              <div className="field"><label htmlFor="project">{content.contact.projectLabel}</label><textarea id="project" ref={projectRef} rows={4} maxLength={2000} required placeholder={content.contact.projectPlaceholder} value={value.project} aria-invalid={!!errors.project} aria-describedby={errors.project ? 'project-error' : 'project-help'} onChange={event => change('project', event.target.value)} />{errors.project ? <p id="project-error" className="field-error">{errors.project}</p> : <p id="project-help" className="field-help">{content.contact.projectHelp}</p>}</div>
              <button type="submit" className="button">{content.contact.reviewButton}</button><p className="not-sent">{content.contact.notSent}</p>
            </form>
          </motion.div> : <motion.div key="review" className="enquiry-review" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduce ? 0 : .12 }} onAnimationComplete={() => reviewRef.current?.focus()}>
            <h2 ref={reviewRef} tabIndex={-1}>{content.contact.reviewTitle}</h2><p>{content.contact.reviewText}</p>
            <label className="visually-hidden" htmlFor="message-draft">{content.contact.draftLabel}</label><textarea id="message-draft" className="message-draft" readOnly rows={13} value={message} />
            <a className="button" href={whatsappDraft(message)} target="_blank" rel="noopener noreferrer">{content.contact.continueButton}<WhatsappLogo size={22} aria-hidden="true" /></a>
            <div className="review-secondary"><button type="button" className="text-link" onClick={() => { returning.current = true; setReview(false); }}>{content.contact.editButton}</button><button type="button" className="text-link" onClick={copy}><Copy size={17} aria-hidden="true" />{content.contact.copyButton}</button></div>
            <p className="copy-status" role="status">{copyStatus || content.contact.draftStatus}</p>
          </motion.div>}
        </AnimatePresence>
      </section>
    </div>
  </main>;
}
