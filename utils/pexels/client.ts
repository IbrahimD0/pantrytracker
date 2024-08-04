import { createClient } from 'pexels';

const client = createClient(process.env.NEXT_PUBLIC_PEXELS_API_KEY || '');

export default client;