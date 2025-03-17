import { Client, Databases, Storage } from "appwrite";

const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1") // Your Appwrite endpoint
  .setProject("YOUR_PROJECT_ID"); // Replace with your project ID

export const databases = new Databases(client);
export const storage = new Storage(client); // Add Storage service