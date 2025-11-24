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
  private readonly TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;

  constructor() {
    this.initializeStorage();
  }

  private initializeStorage(): void {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (!stored) {
      const initialState: BoxState[] = Array.from({ length: 9 }, (_, i) => ({
        boxId: i + 1,
        openedAt: null,
        unlocksAt: i === 0 ? Date.now() : null,
      }));
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(initialState));
    }
  }

  getBoxState(boxId: number): BoxState | null {
    const states = this.getAllBoxStates();
    return states.find((state) => state.boxId === boxId) || null;
  }

  getAllBoxStates(): BoxState[] {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (!stored) {
      this.initializeStorage();
      return this.getAllBoxStates();
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

  clearAllProgress(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    this.initializeStorage();
  }
}
