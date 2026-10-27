export type ServiceId = 'electrical' | 'networking' | 'spaces' | 'events';
export const services = [
  { id: 'electrical', name: 'Electrical works', short: 'Electrical', headline: 'Care in every connection.', description: 'Electrical installation and improvements for the places your business depends on.', topics: ['Electrical installations', 'Cable organization', 'Practical improvements'], image: 'electrical-detail.webp', alt: 'Illustrative electrical installation with neatly organized cable containment', illustrative: true },
  { id: 'networking', name: 'IT & networking', short: 'IT & networking', headline: 'Connections worth getting right.', description: 'From data points to organized racks, start with the connections your space needs.', topics: ['Data cabling', 'Rack organization', 'Workspace connectivity'], image: 'rack-hero.webp', alt: 'Illustrative black network rack with carefully organized red patch leads', illustrative: true },
  { id: 'spaces', name: 'Office & warehouse', short: 'Office & warehouse', headline: 'Built around your space.', description: 'Practical technical work for an office taking shape, a warehouse changing, or an existing space that needs attention.', topics: ['Office improvements', 'Warehouse requirements', 'Existing installations'], image: 'interior-work.jpg', alt: 'Motexo social collage showing interior work in progress and installation work', illustrative: false, source: 'https://www.instagram.com/motexotechnicalservices/p/CPF6zZyFbgt/' },
  { id: 'events', name: 'Event support', short: 'Event support', headline: 'The work behind the occasion.', description: 'Talk through the technical and on-site work your event space needs, from the first setup to the finishing details.', topics: ['Event-space requirements', 'On-site technical work', 'Setup and organization'], image: 'tennis-event.jpg', alt: 'Motexo social collage of technicians working with cables at a tennis venue', illustrative: false, source: 'https://www.instagram.com/motexotechnicalservices/p/CPF4tS3lqcO/' },
] as const;

export function serviceById(id: string | null | undefined) {
  return services.find(service => service.id === id) ?? services[0];
}

export type WorkCategory = 'all' | 'infrastructure' | 'spaces' | 'events';
export const work = [
  { id: 'tennis', title: 'Tennis-event setup', category: 'events', image: 'tennis-event.jpg', width: 546, height: 640, description: 'Cable work, setup and the people behind the occasion.', source: 'https://www.instagram.com/motexotechnicalservices/p/CPF4tS3lqcO/' },
  { id: 'infrastructure', title: 'Electrical & infrastructure', category: 'infrastructure', image: 'infrastructure.jpg', width: 640, height: 640, description: 'A closer look at installations and work in progress.', source: 'https://www.instagram.com/motexotechnicalservices/p/CPF3JQ3FuO6/' },
  { id: 'interiors', title: 'Interior works', category: 'spaces', image: 'interior-work.jpg', width: 627, height: 640, description: 'Practical work as commercial spaces take shape.', source: 'https://www.instagram.com/motexotechnicalservices/p/CPF6zZyFbgt/' },
  { id: 'team', title: 'Work in progress', category: 'spaces', image: 'site-work.jpg', width: 556, height: 640, description: 'People, technical details and spaces shared by the team.', source: 'https://www.instagram.com/motexotechnicalservices/p/CPGASNvFIVM/' },
] as const;

export function filterWork(category: WorkCategory) {
  return category === 'all' ? [...work] : work.filter(item => item.category === category);
}

export const instagram = 'https://www.instagram.com/motexotechnicalservices/';
export const whatsappNumber = '971529628748';
export const businessPhone = '+971 52 962 8748';
