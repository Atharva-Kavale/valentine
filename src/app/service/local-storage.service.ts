import { Injectable } from '@angular/core';

export interface BoxState {
  boxId: number;
  openedAt: number | null;
  unlocksAt: number | null;
}

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  private readonly STORAGE_KEY = 'valentine_box_progress';
  private readonly AUDIO_VOLUME_KEY = 'valentine_audio_volume';
  private readonly AUDIO_SONG_KEY = 'valentine_selected_song';
  private readonly TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;

  constructor() {}

  /**
   * Initialize storage with dynamic count from backend
   * This should be called after fetching the count from the API
   */
  initializeStorageWithCount(count: number): void {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (!stored) {
      const initialState: BoxState[] = Array.from({ length: count }, (_, i) => ({
        boxId: i + 1,
        openedAt: null,
        unlocksAt: i === 0 ? Date.now() : null,
      }));
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(initialState));
    } else {
      // Storage exists - check if we need to add/remove boxes based on new count
      const existingStates: BoxState[] = JSON.parse(stored);

      if (existingStates.length !== count) {
        // Adjust the storage to match the new count
        if (count > existingStates.length) {
          // Add new boxes
          for (let i = existingStates.length; i < count; i++) {
            existingStates.push({
              boxId: i + 1,
              openedAt: null,
              unlocksAt: null,
            });
          }
        } else {
          // Remove excess boxes
          existingStates.splice(count);
        }
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(existingStates));
      }
    }
  }

  getBoxState(boxId: number): BoxState | null {
    const states = this.getAllBoxStates();
    return states.find((state) => state.boxId === boxId) || null;
  }

  getAllBoxStates(): BoxState[] {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (!stored) {
      // Return empty array if not initialized yet
      // Storage will be initialized when count is fetched from backend
      return [];
    }
    return JSON.parse(stored);
  }

  setBoxOpenedTime(boxId: number): void {
    const states = this.getAllBoxStates();
    const currentTime = Date.now();

    const boxIndex = states.findIndex((state) => state.boxId === boxId);
    if (boxIndex !== -1) {
      // Only mark as opened if it hasn't been opened before
      if (states[boxIndex].openedAt === null) {
        states[boxIndex].openedAt = currentTime;

        const nextBoxIndex = states.findIndex(
          (state) => state.boxId === boxId + 1,
        );
        if (nextBoxIndex !== -1) {
          states[nextBoxIndex].unlocksAt = currentTime + this.TWENTY_FOUR_HOURS;
        }

        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(states));
      }
    }
  }

  getNextUnlockTime(boxId: number): number | null {
    const state = this.getBoxState(boxId);
    return state?.unlocksAt || null;
  }

  isBoxUnlocked(boxId: number): boolean {
    const state = this.getBoxState(boxId);
    if (!state) return false;

    if (boxId === 1) return true;

    if (state.unlocksAt === null) return false;

    return Date.now() >= state.unlocksAt;
  }

  getRemainingTime(boxId: number): number {
    const unlockTime = this.getNextUnlockTime(boxId);
    if (unlockTime === null) return Infinity;

    const remaining = unlockTime - Date.now();
    return remaining > 0 ? remaining : 0;
  }

  // Audio preference methods
  saveVolume(volume: number): void {
    localStorage.setItem(this.AUDIO_VOLUME_KEY, volume.toString());
  }

  loadVolume(): number {
    const saved = localStorage.getItem(this.AUDIO_VOLUME_KEY);
    if (saved !== null) {
      const volume = parseFloat(saved);
      return isNaN(volume) ? 0.5 : Math.max(0, Math.min(1, volume));
    }
    return 0.5;
  }

  saveSongSelection(songId: number): void {
    localStorage.setItem(this.AUDIO_SONG_KEY, songId.toString());
  }

  loadSongSelection(): number | null {
    const saved = localStorage.getItem(this.AUDIO_SONG_KEY);
    if (saved !== null) {
      const songId = parseInt(saved);
      return isNaN(songId) ? null : songId;
    }
    return null;
  }
}
