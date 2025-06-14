import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { MovieDetails } from './pages/movie-details/movie-details';
import { Movies } from './pages/movies/movies';
import { Series } from './pages/series/series';
import { SerieDetails } from './pages/serie-details/serie-details';
import { Celebrities } from './pages/celebrities/celebrities';
import { CelebrityDetails } from './pages/celebrity-details/celebrity-details';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'movies', component: Movies },
  { path: 'movies/:id', component: MovieDetails },
  { path: 'series', component: Series },
  { path: 'series/:id', component: SerieDetails },
  { path: 'celebrities', component: Celebrities },
  { path: 'celebrities/:id', component: CelebrityDetails },
  { path: '**', redirectTo: '' },
];
