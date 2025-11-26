import { databases, appwriteConfig, ID } from '../config/appwrite';
import { Note } from '../types/note';
import { Query } from 'appwrite';
import authService from './authService';

class AppwriteService {
  // Get current user ID
  async getCurrentUserId(): Promise<string> {
    const user = await authService.getCurrentUser();
    if (!user) {
      throw new Error('User not authenticated');
    }
    return user.$id;
  }
  // Create a new note
  async createNote(content: string): Promise<Note> {
    try {
      // Generate a title from the first 50 characters of content
      const title = content.length > 50 
        ? content.substring(0, 50) + '...' 
        : content;

      const now = new Date().toISOString();
      const userId = await this.getCurrentUserId();

      const response = await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.collectionId,
        ID.unique(),
        {
          title,
          content,
          userId, // Use authenticated user ID
          createdAt: now,
          updatedAt: now,
          isArchived: false,
        }
      );

      return {
        id: response.$id,
        content: response.content,
        createdAt: response.createdAt,
        updatedAt: response.updatedAt,
      };
    } catch (error) {
      console.error('Error creating note:', error);
      throw error;
    }
  }

  // Get all notes for the current user
  async getNotes(): Promise<Note[]> {
    try {
      const userId = await this.getCurrentUserId();
      
      const response = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.collectionId,
        [
          Query.equal('userId', userId), // Filter by current user
          Query.orderDesc('createdAt')
        ]
      );

      return response.documents.map((doc: any) => ({
        id: doc.$id,
        content: doc.content,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
      }));
    } catch (error) {
      console.error('Error fetching notes:', error);
      throw error;
    }
  }

  // Update a note
  async updateNote(id: string, content: string): Promise<Note> {
    try {
      // Generate a title from the first 50 characters of content
      const title = content.length > 50 
        ? content.substring(0, 50) + '...' 
        : content;

      const response = await databases.updateDocument(
        appwriteConfig.databaseId,
        appwriteConfig.collectionId,
        id,
        {
          title,
          content,
          updatedAt: new Date().toISOString(),
        }
      );

      return {
        id: response.$id,
        content: response.content,
        createdAt: response.createdAt,
        updatedAt: response.updatedAt,
      };
    } catch (error) {
      console.error('Error updating note:', error);
      throw error;
    }
  }

  // Delete a note
  async deleteNote(id: string): Promise<void> {
    try {
      await databases.deleteDocument(
        appwriteConfig.databaseId,
        appwriteConfig.collectionId,
        id
      );
    } catch (error) {
      console.error('Error deleting note:', error);
      throw error;
    }
  }
}

export default new AppwriteService();
