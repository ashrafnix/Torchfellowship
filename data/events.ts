import { Event } from '../lib/types';

export const tuesdayFellowship: Event = {
  id: 'tuesday-fellowship-static',
  created_at: new Date().toISOString(),
  title: 'Weekly Tuesday Fellowship',
  location: 'Light Grounds, Mutundwe',
  event_date: 'recurring-tuesday',
  event_time: '5:00 PM - 8:00 PM',
  registration_required: false,
  description: "Join us every week for a vibrant, transformative evening of worship, in-depth teaching of the Word, and powerful fellowship. It's the perfect place to recharge your faith and connect with the community.",
  image_base64: 'https://res.cloudinary.com/dn2mbmhmi/image/upload/v1755268391/worship-crowd_yhefqw.png'
};
