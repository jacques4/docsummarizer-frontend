import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { jsPDF } from 'jspdf';

@Component({
  selector: 'app-export',
  imports: [FormsModule],
  templateUrl: './export.html',
  styleUrl: './export.scss'
})
export class Export {
  selectedFormat: string = 'txt';
  summary: string = '';

  constructor(private router: Router) {
    const nav = this.router.getCurrentNavigation();
    this.summary = nav?.extras?.state?.['summary'] || '';
  }


export(): void {
    if (this.selectedFormat === 'txt') {
      const blob = new Blob([this.summary], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'resume.txt';
      a.click();
      window.URL.revokeObjectURL(url);
    }else if (this.selectedFormat === 'pdf') {
  const doc = new jsPDF();

  const pageHeight = doc.internal.pageSize.getHeight();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 10;
  const maxLineWidth = pageWidth - margin * 2;
  const lineHeight = 8;

  // Découper le texte en lignes qui tiennent dans la largeur de la page
  const lines = doc.splitTextToSize(this.summary, maxLineWidth);

  let y = 20; // Position verticale de départ

  lines.forEach((line: string | string[]) => {
    // Si on dépasse la page, on en ajoute une nouvelle
    if (y + lineHeight > pageHeight - margin) {
      doc.addPage();
      y = 20; // Reset position en haut de la nouvelle page
    }
    doc.text(line, margin, y);
    y += lineHeight;
  });

  doc.save('resume.pdf');
}
  }

}
