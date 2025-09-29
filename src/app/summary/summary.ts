import { ApiService } from './../services/api';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { jsPDF } from 'jspdf';

@Component({
  selector: 'app-summary',
  imports: [CommonModule],
  templateUrl: './summary.html',
  styleUrl: './summary.scss'
})
export class Summary {
  summary: string = '';
  loading = false;

  constructor(private router: Router, private apiService : ApiService) {
    const nav = this.router.getCurrentNavigation();
    this.summary = nav?.extras?.state?.['summary'] || '';
  }

summaries: any[] = [];

ngOnInit() {
  this.apiService.getSummaries().subscribe((data) => {
    this.summaries = data;
  });
}

  copyToClipboard(): void {
    navigator.clipboard.writeText(this.summary);
    alert('Résumé copié dans le presse-papier !');
  }
 

  exportToPDF(): void {
    const doc = new jsPDF();
    const lines = this.summary.split('\n');
    let y = 10;

    lines.forEach(line => {
      doc.text(line, 10, y);
      y += 10;
      if (y > 280) { // éviter de dépasser la page
        doc.addPage();
        y = 10;
      }
    });

    doc.save('resume.pdf');
  }

   exportSummary(): void {
    this.router.navigate(['/export'], { state: { summary: this.summary } });
  }

}


