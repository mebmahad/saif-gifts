import conf from '../conf/conf.js';
import { Client, ID, Databases, Storage, Query, Account } from "appwrite";

class Service {
    constructor() {
        this.client = new Client()
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjectId);
        this.databases = new Databases(this.client);
        this.storage = new Storage(this.client);
        this.account = new Account(this.client);
    }

    // ==================== Product Functions ====================
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

    async getProductById(productId) {
        try {
            return await this.databases.getDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionIdproducts,
                productId
            );
        } catch (error) {
            console.error("Error fetching product:", error);
            return null;
        }
    }

    async uploadImage(file) {
        try {
            const response = await this.storage.createFile(
                conf.appwriteBucketId,
                ID.unique(),
                file
            );
            return response; // Return full response object
        } catch (error) {
            console.error("Error uploading image:", error);
            return null;
        }
    }

    getImagePreview(imageId) {
        try {
            return this.storage.getFilePreview(
                conf.appwriteBucketId,
                imageId
            );
        } catch (error) {
            console.error("Error fetching image URL:", error);
            return null;
        }
    }

    async addProduct(productData) {
        try {
            return await this.databases.createDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionIdproducts,
                ID.unique(),
                productData
            );
        } catch (error) {
            console.error("Error adding product:", error);
            return null;
        }
    }

    async updateProduct(productId, productData) {
        try {
            return await this.databases.updateDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionIdproducts,
                productId,
                productData
            );
        } catch (error) {
            console.error("Error updating product:", error);
            return null;
        }
    }

    async deleteProduct(productId) {
        try {
            await this.databases.deleteDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionIdproducts,
                productId
            );
            return true;
        } catch (error) {
            console.error("Error deleting product:", error);
            return false;
        }
    }

    // ==================== Auth Functions ====================
    async createAccount({ email, password, name }) {
        try {
          // 1. Create account
          const userAccount = await this.account.create(ID.unique(), email, password, name);
          
          // 2. Create session
          await this.login({ email, password });
      
          // 3. Create user document (now authenticated)
          await this.databases.createDocument(
            conf.appwriteDatabaseId,
            conf.appwriteCollectionIdUsers,
            userAccount.$id, // Use account ID as document ID
            { email, name, role: "customer" }
          );
      
          return userAccount;
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

    // ==================== User Management ====================
    async getAllUsers() {
        try {
            const response = await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionIdUsers
            );
            return response.documents;
        } catch (error) {
            console.error("Error fetching users:", error);
            return [];
        }
    }

    async updateUserRole(userId, role) {
        try {
            return await this.databases.updateDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionIdUsers,
                userId,
                { role }
            );
        } catch (error) {
            console.error("Error updating user role:", error);
            return null;
        }
    }

    // ==================== Order Management ====================

    async createOrder({ userId, products, total }) {
        try {
          return await this.databases.createDocument(
            conf.appwriteDatabaseId,
            conf.appwriteCollectionIdorders,
            "orders",
            ID.unique(),
            { userId, products, total, status: "pending" }
          );
        } catch (error) {
          console.error("Error creating order:", error);
          return null;
        }
      }
      
      async getOrdersByUser(userId) {
        try {
          const response = await this.databases.listDocuments(
            conf.appwriteDatabaseId,
            conf.appwriteCollectionIdorders,
            "orders",
            [Query.equal("userId", userId)]
          );
          return response.documents;
        } catch (error) {
          console.error("Error fetching orders:", error);
          return [];
        }
      }
}

const service = new Service();
export default service;