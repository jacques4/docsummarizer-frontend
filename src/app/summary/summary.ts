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

  const pageHeight = doc.internal.pageSize.getHeight();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 10;
  const maxLineWidth = pageWidth - margin * 2;
  const lineHeight = 8;

  // Découper automatiquement le texte en lignes adaptées
  const lines = doc.splitTextToSize(this.summary, maxLineWidth);

  let y = 20;

  lines.forEach((line: string | string[]) => {
    if (y + lineHeight > pageHeight - margin) {
      doc.addPage();
      y = 20;
    }
    doc.text(line, margin, y);
    y += lineHeight;
  });

  doc.save('resume.pdf');
}


   exportSummary(): void {
    this.router.navigate(['/export'], { state: { summary: this.summary } });
  }

  deleteSummary(id: number): void {
  if (confirm("Voulez-vous vraiment supprimer ce résumé ?")) {
    this.apiService.deleteSummary(id).subscribe({
      next: (res) => {
        alert(res.message);
        this.summaries = this.summaries.filter(s => s.id !== id);
      },
      error: () => {
        alert("Erreur lors de la suppression du résumé");
      }
    });
  }
}


deleteAllSummaries(): void {
  if (confirm("Voulez-vous vraiment supprimer TOUS les résumés ?")) {
    this.apiService.deleteAllSummaries().subscribe({
      next: (res) => {
        alert(res.message);
        this.summaries = [];
      },
      error: () => {
        alert("Erreur lors de la suppression des résumés");
      }
    });
  }
}

exportSummaryFromHistory(text: string): void {
  const doc = new jsPDF();

  const pageHeight = doc.internal.pageSize.getHeight();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 10;
  const maxLineWidth = pageWidth - margin * 2;
  const lineHeight = 8;

  const lines = doc.splitTextToSize(text, maxLineWidth);

  let y = 20;

  lines.forEach((line: string | string[]) => {
    if (y + lineHeight > pageHeight - margin) {
      doc.addPage();
      y = 20;
    }
    doc.text(line, margin, y);
    y += lineHeight;
  });

  const filename = `resume_${new Date().getTime()}.pdf`;
  doc.save(filename);
}


}


