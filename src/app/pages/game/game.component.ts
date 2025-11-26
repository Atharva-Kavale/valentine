import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GalleryService } from '../../service/gallery.service';
import { HttpService } from '../../service/http.service';
import { Highscore } from '../../model/highscore';
import { Subject, takeUntil, switchMap } from 'rxjs';

interface MemoryCard {
  id: string;
  imageUrl: string;
  isFlipped: boolean;
  isMatched: boolean;
}

@Component({
  selector: 'app-game',
  imports: [CommonModule, FormsModule],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss',
})
export class GameComponent implements OnInit, OnDestroy {
  cards: MemoryCard[] = [];
  flippedCards: MemoryCard[] = [];
  moves = 0;
  matches = 0;
  isProcessing = false;
  gameWon = false;
  highscores: Highscore[] = [];
  playerName = '';
  isSubmittingScore = false;
  scoreSubmitted = false;
  showResetNotification = false;
  private destroy$ = new Subject<void>();

  constructor(
    private galleryService: GalleryService,
    private httpService: HttpService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.initializeGame();
    this.loadHighscores();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  initializeGame(): void {
    this.galleryService
      .getGalleryItems()
      .pipe(takeUntil(this.destroy$))
      .subscribe((images) => {
        // Filter only images (not videos)
        const imageItems = images.filter((item) => item.type === 'image');

        // Take 6 images, or use placeholder if less than 6
        const selectedImages = imageItems.slice(0, 6);

        // If less than 6 images, fill with placeholders
        while (selectedImages.length < 6) {
          selectedImages.push({
            id: Math.random(),
            url: '/placeholder.svg',
            type: 'image',
            alt: 'Placeholder',
          });
        }

        // Create pairs of cards
        const cardPairs = selectedImages.flatMap((image, index) => [
          {
            id: `${image.id}-a-${index}`,
            imageUrl: image.url,
            isFlipped: false,
            isMatched: false,
          },
          {
            id: `${image.id}-b-${index}`,
            imageUrl: image.url,
            isFlipped: false,
            isMatched: false,
          },
        ]);

        // Shuffle cards
        this.cards = this.shuffleArray(cardPairs);
      });
  }

  shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  flipCard(card: MemoryCard): void {
    if (
      this.isProcessing ||
      card.isFlipped ||
      card.isMatched
    ) {
      return;
    }

    card.isFlipped = true;
    this.flippedCards.push(card);

    if (this.flippedCards.length === 2) {
      this.moves++;
      this.checkForMatch();
    }
  }

  checkForMatch(): void {
    this.isProcessing = true;
    const [card1, card2] = this.flippedCards;

    if (card1.imageUrl === card2.imageUrl) {
      // Match found
      card1.isMatched = true;
      card2.isMatched = true;
      this.matches++;
      this.flippedCards = [];
      this.isProcessing = false;

      // Check if game is won
      if (this.matches === 6) {
        this.gameWon = true;
      }
    } else {
      // No match - flip back automatically after short delay
      setTimeout(() => {
        card1.isFlipped = false;
        card2.isFlipped = false;
        this.flippedCards = [];
        this.isProcessing = false;
        this.cdr.detectChanges();
      }, 800);
    }
  }

  resetGame(): void {
    this.moves = 0;
    this.matches = 0;
    this.flippedCards = [];
    this.isProcessing = false;
    this.gameWon = false;
    this.scoreSubmitted = false;
    this.playerName = '';
    this.initializeGame();

    // Show reset notification
    this.showResetNotification = true;
    setTimeout(() => {
      this.showResetNotification = false;
      this.cdr.detectChanges();
    }, 1000);
  }

  loadHighscores(): void {
    this.httpService
      .getHighscores()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (scores) => {
          this.highscores = [...scores];
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Error loading highscores:', error);
        },
      });
  }

  submitHighscore(): void {
    if (!this.playerName.trim() || this.isSubmittingScore || this.scoreSubmitted) {
      return;
    }

    this.isSubmittingScore = true;

    this.httpService
      .addHighscore(this.playerName, this.moves)
      .pipe(
        switchMap(() => this.httpService.getHighscores()),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (scores) => {
          this.scoreSubmitted = true;
          this.isSubmittingScore = false;
          this.highscores = [...scores];
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Error submitting highscore:', error);
          this.isSubmittingScore = false;
          this.cdr.detectChanges();
        },
      });
  }
}
