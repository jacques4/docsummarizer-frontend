import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../services/api';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-upload',
  imports: [CommonModule],
  templateUrl: './upload.html',
  styleUrl: './upload.scss'
})
export class Upload {
  errorMessage: string = '';
  selectedFile: File | null = null;
  summary: string = '';
  loading: boolean = false;
  private currentSubscription: Subscription | null = null; 

  constructor(private apiService: ApiService, private router: Router) {}

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  onUpload(): void {
    if (!this.selectedFile) return;
    this.loading = true;

    if (this.currentSubscription) {
      this.currentSubscription.unsubscribe();
    }
     this.currentSubscription = this.apiService.summarizeDocument(this.selectedFile).subscribe({
      next: (res) => {
        if (res.summary) {
          this.summary = res.summary || '';
          this.loading = false;
        }
      },
      error: (err) => {
        console.log(err);
                
        this.errorMessage = err?.error?.error || 'Erreur inconnue';
        this.loading = false;
      }
    });
  }

    onCancel(): void {
    if (this.currentSubscription) {
      this.currentSubscription.unsubscribe();
      this.loading = false;
      this.summary = '';
      this.errorMessage = 'Traduction annulée.';
      this.currentSubscription = null;
    }
  }
  exportSummary(): void {
    this.router.navigate(['/export'], { state: { summary: this.summary } });
  }
}
