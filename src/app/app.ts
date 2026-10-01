<<<<<<< HEAD
import { Component, ChangeDetectionStrategy } from '@angular/core';
=======
import { Component } from '@angular/core';
>>>>>>> 3a0aae9b4751934a996c2ea0e48805d964d9c3ee
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
<<<<<<< HEAD
  changeDetection: ChangeDetectionStrategy.Eager,
  template: ` <router-outlet /> `,
=======
  template: `
    <router-outlet />
  `
>>>>>>> 3a0aae9b4751934a996c2ea0e48805d964d9c3ee
})
export class AppComponent {}
