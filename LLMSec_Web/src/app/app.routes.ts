import { Routes } from '@angular/router';

import { HomeComponent } from './home';
import { LoginComponent } from './login';
import { RegisterComponent } from './register';
import { ScoreboardComponent } from './scoreboard';
import { AuthGuard } from './_guards';

export const routes: Routes = [
    { path: '', component: HomeComponent, canActivate: [AuthGuard] },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'scoreboard', component: ScoreboardComponent },    

    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];

