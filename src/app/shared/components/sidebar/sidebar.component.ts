import { Component, EventEmitter, Output } from '@angular/core';
import { GifsService } from '../../../gifs/services/gifs.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent {
  constructor(private gifsService: GifsService) {}

  get tagsHistory(): string[] {
    return this.gifsService.tagsHistory;
  }

  tagSelected(tag: string): void {
    this.gifsService.searchTag(tag);
  }
}
