import { content } from './content';
import type { ServiceId } from './data';
import { serviceById, whatsappNumber } from './data';

export type Enquiry = { service: ServiceId; space: string; name: string; contact: string; project: string };
export type EnquiryErrors = Partial<Record<'name' | 'contact' | 'project', string>>;

export function validateEnquiry(value: Enquiry): EnquiryErrors {
  const errors: EnquiryErrors = {};
  if (!value.name.trim()) errors.name = content.contact.errors.name;
  const contact = value.contact.trim();
  const email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phone = /^\+?[\d\s().-]+$/;
  const digits = contact.replace(/\D/g, '').length;
  if (!contact) errors.contact = content.contact.errors.contactRequired;
  else if (!email.test(contact) && !(phone.test(contact) && digits >= 7 && digits <= 15)) errors.contact = content.contact.errors.contactInvalid;
  if (!value.project.trim()) errors.project = content.contact.errors.project;
  return errors;
}

export function enquiryMessage(value: Enquiry): string {
  return [
    content.contact.message.greeting,
    '',
    content.contact.message.service + ': ' + serviceById(value.service).name,
    content.contact.message.space + ': ' + value.space,
    content.contact.message.name + ': ' + value.name.trim(),
    content.contact.message.contact + ': ' + value.contact.trim(),
    '',
    value.project.trim(),
  ].join('\n');
}

export function whatsappDraft(message: string): string {
  return 'https://wa.me/' + whatsappNumber + '?text=' + encodeURIComponent(message);
}
