import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SessionStorageService {
  /**
   * Check if sessionStorage is available
   */
  private isAvailable(): boolean {
    try {
      const test = '__storage_test__';
      sessionStorage.setItem(test, test);
      sessionStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Set item in sessionStorage
   */
  setItem(key: string, value: string): boolean {
    if (!this.isAvailable()) {
      console.warn('SessionStorage is not available');
      return false;
    }

    try {
      sessionStorage.setItem(key, value);
      return true;
    } catch (error) {
      console.error('Failed to set item in sessionStorage:', error);
      return false;
    }
  }

  /**
   * Get item from sessionStorage
   */
  getItem(key: string): string | null {
    if (!this.isAvailable()) {
      return null;
    }

    try {
      return sessionStorage.getItem(key);
    } catch (error) {
      console.error('Failed to get item from sessionStorage:', error);
      return null;
    }
  }

  /**
   * Remove item from sessionStorage
   */
  removeItem(key: string): boolean {
    if (!this.isAvailable()) {
      return false;
    }

    try {
      sessionStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Failed to remove item from sessionStorage:', error);
      return false;
    }
  }

  /**
   * Clear all items from sessionStorage
   */
  clear(): boolean {
    if (!this.isAvailable()) {
      return false;
    }

    try {
      sessionStorage.clear();
      return true;
    } catch (error) {
      console.error('Failed to clear sessionStorage:', error);
      return false;
    }
  }

  /**
   * Check if key exists in sessionStorage
   */
  hasItem(key: string): boolean {
    return this.getItem(key) !== null;
  }

  /**
   * Get all keys in sessionStorage
   */
  getAllKeys(): string[] {
    if (!this.isAvailable()) {
      return [];
    }

    try {
      const keys: string[] = [];
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (key) {
          keys.push(key);
        }
      }
      return keys;
    } catch (error) {
      console.error('Failed to get keys from sessionStorage:', error);
      return [];
    }
  }

  /**
   * Set object in sessionStorage (automatically stringifies)
   */
  setObject<T>(key: string, value: T): boolean {
    try {
      const jsonString = JSON.stringify(value);
      return this.setItem(key, jsonString);
    } catch (error) {
      console.error('Failed to stringify object:', error);
      return false;
    }
  }

  /**
   * Get object from sessionStorage (automatically parses)
   */
  getObject<T>(key: string): T | null {
    const jsonString = this.getItem(key);
    if (!jsonString) {
      return null;
    }

    try {
      return JSON.parse(jsonString) as T;
    } catch (error) {
      console.error('Failed to parse JSON from sessionStorage:', error);
      return null;
    }
  }

  /**
   * Get storage size in bytes (approximate)
   */
  getStorageSize(): number {
    if (!this.isAvailable()) {
      return 0;
    }

    try {
      let total = 0;
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (key) {
          const value = sessionStorage.getItem(key);
          if (value) {
            total += key.length + value.length;
          }
        }
      }
      return total * 2; // UTF-16 uses 2 bytes per character
    } catch (error) {
      console.error('Failed to calculate storage size:', error);
      return 0;
    }
  }
}
