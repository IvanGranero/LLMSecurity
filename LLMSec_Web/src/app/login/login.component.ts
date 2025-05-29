import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil, first } from 'rxjs';
import { AlertService, AuthenticationService } from '../_services';
import { CommonModule, NgIf } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
    templateUrl: 'login.component.html',
    imports: [NgIf, FormsModule, ReactiveFormsModule, CommonModule, RouterModule]
})
export class LoginComponent implements OnInit, OnDestroy {
    loginForm!: FormGroup;
    loading = false;
    submitted = false;
    returnUrl!: string;
    private destroy$ = new Subject<void>();

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService,
        private alertService: AlertService
    ) {
        // redirect to home if already logged in
        if (this.authenticationService.currentUserValue) { 
            this.router.navigate(['/']);
        }
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    ngOnInit() {
        this.loginForm = this.formBuilder.group({
            email: ['', Validators.required],
            password: ['', Validators.required]
        });

        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    }

    // convenience getter for easy access to form fields
    get f() { return this.loginForm.controls; }

    onSubmit() {
        this.submitted = true;

        // stop here if form is invalid
        if (this.loginForm.invalid) return;

        this.loading = true;
        this.authenticationService.login(this.f['email'].value, this.f['password'].value)
        .pipe(first(), takeUntil(this.destroy$))
        .subscribe({
            next: () => {
                this.router.navigate([this.returnUrl]);
            },
            error: (error) => {
                this.alertService.error(error?.error?.message || 'Login failed');
                this.loading = false;
            }
        });
    }
}
