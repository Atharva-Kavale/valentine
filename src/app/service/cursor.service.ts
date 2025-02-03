import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { HeartParticle } from '../model/heart-particle';

@Injectable({
  providedIn: 'root',
})
export class CursorService {
  private renderer: Renderer2;
  private readonly MAX_HEARTS = 20;
  private readonly MIN_DISTANCE = 30; // Minimum pixels between hearts
  private readonly CLEANUP_DELAY = 1500; // Time before heart disappears
  private hearts: HTMLElement[] = [];
  private lastHeartPosition = { x: 0, y: 0 };
  private canCreateHeart = true;

  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  initializeTrail() {
    if (window.innerWidth <= 768) return; // Don't initialize on mobile

    document.addEventListener('mousemove', (e: MouseEvent) => {
      if (this.canCreateHeart && this.hearts.length < this.MAX_HEARTS) {
        const distance = Math.hypot(
          e.pageX - this.lastHeartPosition.x,
          e.pageY - this.lastHeartPosition.y
        );

        if (distance >= this.MIN_DISTANCE) {
          this.createHeart(e.pageX, e.pageY);
          this.lastHeartPosition = { x: e.pageX, y: e.pageY };
          this.canCreateHeart = false;

          // Allow next heart creation after small delay
          setTimeout(() => {
            this.canCreateHeart = true;
          }, 50); // Adjust this delay to control trail density
        }
      }
    });
  }

  private createHeart(x: number, y: number) {
    const heart = this.renderer.createElement('div');

    // Apply styles
    this.renderer.addClass(heart, 'heart-trail');
    this.renderer.setStyle(heart, 'position', 'fixed');
    this.renderer.setStyle(heart, 'left', `${x}px`);
    this.renderer.setStyle(heart, 'top', `${y}px`);
    this.renderer.setStyle(heart, 'pointer-events', 'none');
    this.renderer.setStyle(heart, 'z-index', '9999');
    this.renderer.setStyle(heart, 'font-size', '20px');
    this.renderer.setStyle(heart, 'transform', 'translate(-50%, -50%)');

    // Add content
    heart.innerHTML = '❤️';

    // Add to document and track
    document.body.appendChild(heart);
    this.hearts.push(heart);

    // Remove after animation
    setTimeout(() => {
      if (heart.parentNode) {
        heart.parentNode.removeChild(heart);
        this.hearts = this.hearts.filter((h) => h !== heart);
      }
    }, this.CLEANUP_DELAY);
  }
}
