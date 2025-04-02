import conf from '../conf/conf.js';
import { Client, Account, ID, Databases, Storage, Query } from "appwrite";

const defaultProductImage = '/images/default-product.png';

class Service {
    constructor() {
        this.client = new Client()
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjectId);
        this.account = new Account(this.client);
        this.databases = new Databases(this.client);
        this.bucket = new Storage(this.client);
        this.currentSession = null;
    }

    // ==================== Helper Methods ====================
    #normalizeImageIds(images) {
        if (!images) return '[]';
        if (Array.isArray(images)) return JSON.stringify(images);
        if (typeof images === 'string') {
            try {
                JSON.parse(images);
                return images;
            } catch {
                return JSON.stringify([images]);
            }
        }
        return '[]';
    }

    // ==================== Account Management ====================
    async deleteAccount() {
        try {
            return await this.account.delete();
        } catch (error) {
            console.error("Appwrite service :: deleteAccount :: error", error);
            throw error;
        }
    }

    // ==================== Session Management ====================
    async checkSession() {
        try {
            this.currentSession = await this.account.getSession('current');
            return true;
        } catch (error) {
            this.currentSession = null;
            return false;
        }
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

    async getProductById(documentId) {
        if (!documentId) throw new Error('Missing document ID');
        try {
            return await this.databases.getDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionIdproducts,
                documentId
            );
        } catch (error) {
            console.error("Error fetching product:", error);
            return null;
        }
    }

    async uploadImages(files) {
        try {
            const uploadPromises = files.map(file => 
                this.bucket.createFile(
                    conf.appwriteBucketId,
                    ID.unique(),
                    file
                )
            );
            const results = await Promise.all(uploadPromises);
            return results.map(result => result.$id);
        } catch (error) {
            console.error("Error uploading images:", error);
            return [];
        }
    }

    async uploadImage(file) {
        try {
            const result = await this.bucket.createFile(
                conf.appwriteBucketId,
                ID.unique(),
                file
            );
            return result;
        } catch (error) {
            console.error("Error uploading image:", error);
            return null;
        }
    }

    // In config.js - Fix the getImagePreview method
getImagePreview(fileId) {
    if (!fileId) return defaultProductImage;
    try {
        // Add .href to get the actual URL string
        return this.bucket.getFilePreview(conf.appwriteBucketId, fileId);
    } catch (error) {
        console.error("Error fetching image URL:", error);
        return defaultProductImage;
    }
}

    async createProduct(productData) {
        try {
            const imageIds = this.#normalizeImageIds(productData.image_ids);
            const { image_ids, ...cleanData } = productData;
            
            return await this.databases.createDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionIdproducts,
                ID.unique(),
                { ...cleanData, image_ids: imageIds }
            );
        } catch (error) {
            console.error("Error adding product:", error);
            return null;
        }
    }

    async addProduct(productData) {
        return this.createProduct(productData);
    }

    async updateProduct(productId, productData) {
        try {
            const imageIds = this.#normalizeImageIds(productData.image_ids);
            const { image_ids, ...cleanData } = productData;
            
            return await this.databases.updateDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionIdproducts,
                productId,
                { ...cleanData, image_ids: imageIds }
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
        let userAccount;
        try {
            userAccount = await this.account.create(ID.unique(), email, password, name);
            await this.account.createEmailPasswordSession(email, password);
            
            const userDoc = await this.databases.createDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionIdUsers,
                userAccount.$id,
                {
                    email,
                    name,
                    role: "customer",
                    createdAt: new Date().toISOString()
                }
            );
    
            return { ...userAccount, ...userDoc };
        } catch (error) {
            if (userAccount?.$id) {
                await this.account.delete(userAccount.$id).catch(() => {});
            }
            throw error;
        }
    }

    async login(email, password) {
        try {
            await this.account.createEmailSession(email, password);
            const userAccount = await this.account.get();
            const userData = await this.getUserData(userAccount.$id);
            
            return {
                ...userAccount,
                role: userData?.role || 'customer'
            };
        } catch (error) {
            console.error("Error logging in:", error);
            if (error.type === 'too_many_requests') {
                throw new Error('Too many attempts. Please try again later.');
            }
            throw new Error('Invalid email or password');
        }
    }

    async logout() {
        try {
            if (await this.checkSession()) {
                await this.account.deleteSession('current');
            }
            this.currentSession = null;
            return true;
        } catch (error) {
            console.error("Logout error:", error);
            return false;
        }
    }

    async getCurrentUser() {
        try {
            const userAccount = await this.account.get();
            const userData = await this.getUserData(userAccount.$id);
            return { 
                ...userAccount,
                role: userData?.role || 'customer',
                name: userData?.name || 'User'
            };
        } catch (error) {
            console.error("Error fetching current user:", error);
            return null;
        }
    }

    // ==================== User Management ====================
    async getUserData(userId) {
        try {
            return await this.databases.getDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionIdUsers,
                userId
            );
        } catch (error) {
            if (error.code === 404) {
                console.warn(`User document missing for ${userId}, creating default...`);
                return await this.databases.createDocument(
                    conf.appwriteDatabaseId,
                    conf.appwriteCollectionIdUsers,
                    userId,
                    {
                        role: 'customer',
                        name: 'User',
                        email: 'missing@example.com'
                    }
                );
            }
            console.error("Error fetching user data:", error);
            return null;
        }
    }

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
            throw error;
        }
    }

    // ==================== Order Management ====================
    async createOrder(userId, orderDetails) {
        try {
            return await this.databases.createDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionIdorders,
                ID.unique(),
                {
                    userId,
                    total: Math.round(orderDetails.totalAmount * 100)/100, // Properly format to 2 decimal places
                    status: 'pending',
                    shippingDetails: JSON.stringify(orderDetails.shippingDetails),
                    products: JSON.stringify(orderDetails.cart)
                }
            );
        } catch (error) {
            console.error("Error creating order:", error);
            throw error;
        }
    }

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
            console.error("Error fetching user orders:", error);
            return [];
        }
    }

    async getAllOrders() {
        try {
            const response = await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionIdorders,
                [Query.orderDesc('$createdAt')]
            );
            return response.documents;
        } catch (error) {
            console.error("Error fetching all orders:", error);
            return [];
        }
    }

    async updateOrderStatus(orderId, status) {
        try {
            return await this.databases.updateDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionIdorders,
                orderId,
                { status }
            );
        } catch (error) {
            console.error("Error updating order status:", error);
            throw error;
        }
    }
}

const service = new Service();
export default service;