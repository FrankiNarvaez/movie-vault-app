import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
})
export class Header {
  // Desktop menus
  protected isMoviesMenuOpen = signal(false);
  protected isSeriesMenuOpen = signal(false);
  protected isStreamingMenuOpen = signal(false);

  // Movil menus
  protected isMovilMenuOpen = signal(false);
  protected isMoviesMovilMenuOpen = signal(false);
  protected isSeriesMovilMenuOpen = signal(false);
  protected isStreamingMovilMenuOpen = signal(false);

  // Search bar
  protected isSearchBarOpen = signal(false);

  protected readonly itemsMoviesNav: subMenuItem[] = [
    { name: 'Trending', url: '#' },
    { name: 'Popular', url: '#' },
    { name: 'Marvel', url: '#' },
  ];

  protected itemsSeriesNav: subMenuItem[] = [
    { name: 'Trending', url: '#' },
    { name: 'Popular', url: '#' },
    { name: 'Hulu', url: '#' },
  ];

  protected itemsStreamingNav: subMenuItem[] = [
    { name: 'Netflix', url: '#' },
    { name: 'Disney +', url: '#' },
    { name: 'Crunchyroll', url: '#' },
  ];

  showMoviesMenu() {
    this.isMoviesMenuOpen.set(true);
  }

  hideMoviesMenu() {
    this.isMoviesMenuOpen.set(false);
  }

  showSeriesMenu() {
    this.isSeriesMenuOpen.set(true);
  }

  hideSeriesMenu() {
    this.isSeriesMenuOpen.set(false);
  }

  showStreamingMenu() {
    this.isStreamingMenuOpen.set(true);
  }

  hideStreamingMenu() {
    this.isStreamingMenuOpen.set(false);
  }

  openMovilMenu() {
    this.isMovilMenuOpen.set(true);
  }

  closeMovilMenu() {
    this.isMovilMenuOpen.set(false);
  }

  toggleMoviesMovilMenu() {
    this.isMoviesMovilMenuOpen.update((current) => !current);
  }

  toggleSeriesMovilMenu() {
    this.isSeriesMovilMenuOpen.update((current) => !current);
  }

  toggleStreamingMenu() {
    this.isStreamingMenuOpen.update((current) => !current);
  }

  toggleSearchBar() {
    this.isSearchBarOpen.update((current) => !current);
  }
}

interface subMenuItem {
  name: string;
  url: string;
}
