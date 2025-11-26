import { Client, Databases, ID } from 'appwrite';

// Appwrite configuration
// TODO: Move these to environment variables for production
const APPWRITE_ENDPOINT = 'https://fra.cloud.appwrite.io/v1';
const APPWRITE_PROJECT_ID = '68f7b307002acb608db0';
const APPWRITE_DATABASE_ID = '6914fd900023b5cbe453';
const APPWRITE_COLLECTION_ID = '6914fde4002939021df4'; // Update this with your actual collection ID

// Initialize Appwrite Client
const client = new Client();

client
  .setEndpoint(APPWRITE_ENDPOINT) // Your Appwrite Endpoint
  .setProject(APPWRITE_PROJECT_ID); // Your project ID

// Initialize Databases
const databases = new Databases(client);

export { client, databases, ID };

// Export configuration
export const appwriteConfig = {
  endpoint: APPWRITE_ENDPOINT,
  projectId: APPWRITE_PROJECT_ID,
  databaseId: APPWRITE_DATABASE_ID,
  collectionId: APPWRITE_COLLECTION_ID,
};
