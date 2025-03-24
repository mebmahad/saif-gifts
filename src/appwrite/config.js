import conf from '../conf/conf.js';
import { Client, Account, ID, Databases, Storage, Query } from "appwrite";

class Service {
    constructor() {
        this.client = new Client()
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjectId);
        this.account = new Account(this.client);
        this.databases = new Databases(this.client);
        this.bucket = new Storage(this.client);
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
            const response = await this.bucket.createFile(
                conf.appwriteBucketId,
                ID.unique(),
                file
            );
            return response;
        } catch (error) {
            console.error("Error uploading image:", error);
            return null;
        }
    }

    getImagePreview(imageId) {
        try {
            return this.bucket.getFilePreview(
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

    // Add new method for creating orders
    async createOrder(userId, orderDetails) {
        try {
            const response = await databases.createDocument(
                conf.databaseId,
                conf.ordersCollectionId,
                ID.unique(),
                {
                    userId: userId,
                    total: Math.round(orderDetails.totalAmount),
                    status: 'pending',
                    shippingDetails: JSON.stringify(orderDetails.shippingDetails),
                    products: JSON.stringify(orderDetails.cart)
                }
            );
            return response;
        } catch (error) {
            console.error("Appwrite service :: createOrder :: error", error);
            return false;
        }
    }

    // Add method to fetch user orders
    async getUserOrders(userId) {
        try {
            const response = await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionIdorders,
                [
                    Query.equal('userId', userId),
                    Query.orderDesc('$createdAt')
                ]
            );
            return response.documents;
        } catch (error) {
            console.error("Appwrite service :: getUserOrders :: error", error);
            return [];
        }
    }
}

const service = new Service();
export default service;