<<<<<<< HEAD
import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
=======
import { Component, inject } from '@angular/core';
>>>>>>> 3a0aae9b4751934a996c2ea0e48805d964d9c3ee
import { CommonModule } from '@angular/common';
import { FirebaseService } from '../../../core/services/firebase.service';

@Component({
  selector: 'app-print-menu',
  standalone: true,
  imports: [CommonModule],
<<<<<<< HEAD
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './print-menu.component.html',
=======
  templateUrl: './print-menu.component.html'
>>>>>>> 3a0aae9b4751934a996c2ea0e48805d964d9c3ee
})
export class PrintMenuComponent {
  fb = inject(FirebaseService);

  printMenu() {
    window.print();
  }
}
