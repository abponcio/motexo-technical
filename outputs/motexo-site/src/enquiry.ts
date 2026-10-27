import type { ServiceId } from './data';
import { serviceById, whatsappNumber } from './data';

export type Enquiry = { service: ServiceId; space: string; name: string; contact: string; project: string };
export type EnquiryErrors = Partial<Record<'name' | 'contact' | 'project', string>>;

export function validateEnquiry(value: Enquiry): EnquiryErrors {
  const errors: EnquiryErrors = {};
  if (!value.name.trim()) errors.name = 'Add your name so the team knows who to speak to.';
  const contact = value.contact.trim();
  const email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phone = /^\+?[\d\s().-]+$/;
  const digits = contact.replace(/\D/g, '').length;
  if (!contact) errors.contact = 'Add an email address or phone number.';
  else if (!email.test(contact) && !(phone.test(contact) && digits >= 7 && digits <= 15)) errors.contact = 'Use a complete email address or phone number, including its area code.';
  if (!value.project.trim()) errors.project = 'Tell us a little about the work you need.';
  return errors;
}

export function enquiryMessage(value: Enquiry): string {
  return [
    'Hello Motexo, I would like to discuss a project.',
    '',
    'Service: ' + serviceById(value.service).name,
    'Space: ' + value.space,
    'Name: ' + value.name.trim(),
    'Contact: ' + value.contact.trim(),
    '',
    value.project.trim(),
  ].join('\n');
}

export function whatsappDraft(message: string): string {
  return 'https://wa.me/' + whatsappNumber + '?text=' + encodeURIComponent(message);
}
