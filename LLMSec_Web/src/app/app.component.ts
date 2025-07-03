import { Component, inject } from '@angular/core';
import { Router, RouterOutlet, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthenticationService, ModeService } from './_services';
import { User } from './_models';
import { AlertComponent } from './_components';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ CommonModule, ReactiveFormsModule, AlertComponent, RouterOutlet, RouterModule ],
  templateUrl: './app.component.html'
})
export class AppComponent {
  private authenticationService = inject(AuthenticationService);
  private router = inject(Router);

  currentUser: User | null = null;
  mode: 'flag' | 'attacker' | 'defender' = 'attacker';

  constructor(private modeService: ModeService) {
    this.authenticationService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  setMode(mode: 'flag' | 'attacker' | 'defender') {
    this.mode = mode;
    this.modeService.setMode(mode);
    this.router.navigateByUrl('/');
  }

  openScoreboard(): void {
    this.router.navigateByUrl('/scoreboard');
  }

  logout(): void {
    this.authenticationService.logout();
    this.router.navigateByUrl('/login').then(() => {
      window.location.reload();
    });
  }

}
