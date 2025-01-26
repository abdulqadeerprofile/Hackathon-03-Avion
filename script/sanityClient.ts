// sanityClient.ts
import { createClient } from '@sanity/client';
import dotenv from "dotenv"

dotenv.config()
export const client = createClient({
    projectId: 'ah48gcwm',
    dataset: 'production',    
    apiVersion: '2024-01-04', 
    useCdn: true,
    token: 'skkJzcZ6UNdK1Gk3jZ5wK7UzOUjYAT89VPgL8BD2KhSnjahXOobZN439sJ1jWQe6d3G5wCV4JIVD8r7TCdoV4bzRIOofOtcUWukZeUdPQyFTV5rwmNQ0COfid6fP7bDaiVpTjOA4jgEGX1KjTRg0qQE6XtkXms9ngNPg10EYVdztUzzIbiPP',
  });