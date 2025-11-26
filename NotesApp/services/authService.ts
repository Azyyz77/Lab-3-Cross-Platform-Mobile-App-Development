import { ID, Account } from 'appwrite';
import { client } from '../config/appwrite';

class AuthService {
  account: Account;

  constructor() {
    this.account = new Account(client);
  }

  // Register a new user
  async createAccount(email: string, password: string, name: string) {
    try {
      const userAccount = await this.account.create(
        ID.unique(),
        email,
        password,
        name
      );

      if (userAccount) {
        return this.login(email, password);
      } else {
        return userAccount;
      }
    } catch (error) {
      console.error("Error creating account:", error);
      throw error;
    }
  }

  // Log in an existing user
  async login(email: string, password: string) {
    try {
      return await this.account.createEmailPasswordSession(email, password);
    } catch (error) {
      console.error("Error logging in:", error);
      throw error;
    }
  }

  // Get current session/user
  async getCurrentUser() {
    try {
      return await this.account.get();
    } catch (error: any) {
      // Don't log error for guests (expected when not logged in)
      if (error?.code !== 401) {
        console.error("Error getting current user:", error);
      }
      return null;
    }
  }

  // Log out the current user
  async logout() {
    try {
      return await this.account.deleteSession("current");
    } catch (error) {
      console.error("Error logging out:", error);
      throw error;
    }
  }

  // Check if user is logged in
  async isLoggedIn(): Promise<boolean> {
    try {
      const user = await this.getCurrentUser();
      return user !== null;
    } catch (error) {
      return false;
    }
  }
}

const authService = new AuthService();
export default authService;
