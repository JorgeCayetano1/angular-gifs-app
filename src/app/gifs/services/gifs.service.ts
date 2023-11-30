import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Gif, SearchResponse } from '../interfaces/gifs.interfaces';

@Injectable({ providedIn: 'root' })
export class GifsService {
  public gifList: Gif[] = [];

  private _tagsHistory: string[] = [];
  private apiKey: string = '0dssVosxpVMic4ExvEy3t8V96EXxAOhB';
  private serviceUrl: string = 'https://api.giphy.com/v1/gifs';

  constructor(private httpClient: HttpClient) {
    this.loadLocalStorage();
    console.log('Gifs Service Ready', this._tagsHistory);
  }

  get tagsHistory() {
    return [...this._tagsHistory];
  }

  private organizeTagsHistory(tag: string) {
    tag = tag.toLowerCase();

    if (this._tagsHistory.includes(tag)) {
      this._tagsHistory = this._tagsHistory.filter((oldTag) => oldTag !== tag);
    }

    this._tagsHistory.unshift(tag);
    this._tagsHistory = this._tagsHistory.splice(0, 10);
    this.saveLocalStorage();
  }

  private saveLocalStorage(): void {
    localStorage.setItem('tagsHistory', JSON.stringify(this._tagsHistory));
  }

  private async loadLocalStorage(): Promise<void> {
    const tagsHistory = localStorage.getItem('tagsHistory');
    if (tagsHistory) {
      this._tagsHistory = JSON.parse(tagsHistory);

      if (this._tagsHistory.length > 0)
        await this.searchTag(this._tagsHistory[0]);
    }
  }

  async searchTag(tag: string): Promise<void> {
    if (tag.length === 0) return;
    this.organizeTagsHistory(tag);

    const params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('limit', '10')
      .set('q', tag);

    this.httpClient
      .get<SearchResponse>(`${this.serviceUrl}/search`, { params })
      .subscribe(({ data }) => {
        this.gifList = data;
      });
  }
}
