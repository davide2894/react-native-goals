import { PersistentStorage } from "apollo3-cache-persist";

/**
 * Wrapper for Expo's SecureStore for React Native.
 *
 * @example
 * const persistor = new CachePersistor({
 *   cache,
 *   storage: new AsyncStorageWrapper(AsyncStorage),
 * });
 *
 */

//TODO: create -> submit PR to include SecureStoreWrapper in apollo3-cache-persist supported prover wrappers

export default class SecureStoreWrapper
  implements PersistentStorage<string | null>
{
  protected storage;

  constructor(storage) {
    this.storage = storage;
  }

  async getItem(key: string): Promise<string> {
    return await this.storage.getItemAsync(key);
  }
  async removeItem(key: string): Promise<void> {
    return await this.storage.deleteItemAsync(key);
  }
  async setItem(key: string, value: string): Promise<void> {
    return await this.storage.setItemAsync(key, value);
  }
}
