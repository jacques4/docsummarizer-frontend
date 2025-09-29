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
    } else if (this.selectedFormat === 'pdf') {
      const doc = new jsPDF();
      const lines = this.summary.split('\n');
      let y = 10;

      lines.forEach(line => {
        doc.text(line, 10, y);
        y += 10;
      });

      doc.save('resume.pdf');
    }
  }


}
