import { Routes } from '@angular/router';
import { Upload } from './upload/upload';
import { Summary } from './summary/summary';
import { Export } from './export/export';

export const routes: Routes = [
      // route par défaut
  { path: '', redirectTo: '', pathMatch: 'full' },
 { path: '', component: Upload},
  { path: 'summary', component: Summary },
  { path: 'export', component: Export },
    { path: '**', redirectTo: '' }

];
