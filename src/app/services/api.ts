import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://localhost:5000';

  constructor(private http: HttpClient) {}

  // Résumer un document
  summarizeDocument(file: File): Observable<{ summary?: string, error?: string }> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<{ summary?: string, error?: string }>(
      `${this.baseUrl}/summarize`,
      formData
    );
  }

  getSummaries() {
  return this.http.get<{ id: number; text: string; lang: string; created_at: string }[]>(
    `${this.baseUrl}/summaries`
  );
}


}
