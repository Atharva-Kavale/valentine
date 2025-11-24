import { Routes } from '@angular/router';
import { reasonGuard } from './guard/reason.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'gallery',
    loadComponent: () =>
      import('./pages/gallery/gallery.component').then(
        (m) => m.GalleryComponent,
      ),
  },
  {
    path: 'reason/:id',
    loadComponent: () =>
      import('./pages/reason/reason.component').then((m) => m.ReasonComponent),
    canActivate: [reasonGuard],
  },
];
