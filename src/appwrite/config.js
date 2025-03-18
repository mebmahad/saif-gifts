import conf from '../conf/conf.js';
import { Client, ID, Databases, Storage, Query, Account } from "appwrite";

class Service {
    constructor() {
        this.client = new Client()
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjectId);
        this.databases = new Databases(this.client);
        this.storage = new Storage(this.client);
        this.account = new Account(this.client); // Add Account service
    }

    // Fetch all products
    async getProducts() {
        try {
            const response = await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionIdproducts
            );
            return response.documents;
        } catch (error) {
            console.error("Error fetching products:", error);
            return [];
        }
    }

    // Fetch a single product by ID
    async getProductById(productId) {
        try {
            const response = await this.databases.getDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionIdproducts,
                productId
            );
            return response;
        } catch (error) {
            console.error("Error fetching product:", error);
            return null;
        }
    }

    // Upload an image to Appwrite Storage
    async uploadImage(file) {
        try {
            const response = await this.storage.createFile(
                conf.appwriteBucketId, // Bucket ID
                ID.unique(),           // Unique file ID
                file                   // File object
            );
            return response.$id; // Return the file ID
        } catch (error) {
            console.error("Error uploading image:", error);
            return null;
        }
    }

    // Get image preview URL
    getImagePreview(imageId) {
        try {
            return this.storage.getFilePreview(
                conf.appwriteBucketId, // Bucket ID
                imageId                // File ID
            );
        } catch (error) {
            console.error("Error fetching image URL:", error);
            return null;
        }
    }

    // Add a new product
    async addProduct({ name, price, description, category, image_id }) {
        try {
            const response = await this.databases.createDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionIdproducts,
                ID.unique(), // Unique document ID
                { name, price, description, category, image_id }
            );
            return response;
        } catch (error) {
            console.error("Error adding product:", error);
            return null;
        }
    }

    // Update a product
    async updateProduct(productId, { name, price, description, category, image_id }) {
        try {
            const response = await this.databases.updateDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionIdproducts,
                productId,
                { name, price, description, category, image_id }
            );
            return response;
        } catch (error) {
            console.error("Error updating product:", error);
            return null;
        }
    }

    // Delete a product
    async deleteProduct(productId) {
        try {
            await this.databases.deleteDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionIdproducts,
                productId
            );
            return true; // Success
        } catch (error) {
            console.error("Error deleting product:", error);
            return false;
        }
    }

    async createAccount({ email, password, name }) {
        try {
            return await this.account.create(ID.unique(), email, password, name);
        } catch (error) {
            console.error("Error creating account:", error);
            return null;
        }
    }

    async login({ email, password }) {
        try {
            return await this.account.createEmailPasswordSession(email, password);
        } catch (error) {
            console.error("Error logging in:", error);
            return null;
        }
    }

    async getCurrentUser() {
        try {
            return await this.account.get();
        } catch (error) {
            console.error("Error fetching current user:", error);
            return null;
        }
    }

    async logout() {
        try {
            return await this.account.deleteSessions();
        } catch (error) {
            console.error("Error logging out:", error);
            return null;
        }
    }

    // ==================== Admin-Specific Functions ====================
    async getAllUsers() {
        try {
            return await this.account.list();
        } catch (error) {
            console.error("Error fetching users:", error);
            return [];
        }
    }

    async updateUserRole(userId, role) {
        try {
            // Requires a custom user collection in Appwrite (e.g., "users_metadata")
            return await this.databases.updateDocument(
                conf.appwriteDatabaseId,
                "users_metadata", // Create this collection in Appwrite
                userId,
                { role }
            );
        } catch (error) {
            console.error("Error updating user role:", error);
            return null;
        }
    }
}

const service = new Service();
export default service;