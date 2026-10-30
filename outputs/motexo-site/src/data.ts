import { content } from './content';
export type ServiceId = 'electrical' | 'networking' | 'automation' | 'spaces' | 'events';
type Service = {
  id: ServiceId; name: string; short: string; headline: string; description: string;
  topics: string[]; image: string; alt: string; illustrative: boolean; source?: string;
};
export const services: Service[] = (['electrical', 'networking', 'automation', 'spaces', 'events'] as const).map(id => ({ id, ...content.services[id] }));

export function serviceById(id: string | null | undefined) {
  return services.find(service => service.id === id) ?? services[0];
}

export type WorkCategory = 'all' | 'infrastructure' | 'spaces' | 'events';
export const work = content.gallery.items;
export function filterWork(category: WorkCategory) {
  return category === 'all' ? [...work] : work.filter(item => item.category === category);
}

export const { instagram, whatsappNumber } = content.business;
export const businessPhone = content.business.phone;
