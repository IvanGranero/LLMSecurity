import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil, first } from 'rxjs';
import { AlertService, UserService, AuthenticationService } from '../_services';
import { CommonModule, NgIf } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
    templateUrl: 'register.component.html',
    imports: [NgIf, FormsModule, ReactiveFormsModule, CommonModule, RouterModule]
})
export class RegisterComponent implements OnInit, OnDestroy {
    registerForm!: FormGroup;
    loading = false;
    submitted = false;
    private destroy$ = new Subject<void>();    

    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private authenticationService: AuthenticationService,
        private userService: UserService,
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
        this.registerForm = this.formBuilder.group({
            name: ['', Validators.required],
            email: ['', Validators.required],
            password: ['', [Validators.required, Validators.minLength(6)]]
        });
    }

    // convenience getter for easy access to form fields
    get f() { return this.registerForm.controls; }

    onSubmit() {
        this.submitted = true;

        // stop here if form is invalid
        if (this.registerForm.invalid) {
            return;
        }

        this.loading = true;
        this.userService.register(this.registerForm.value)
            .pipe(first(), takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    this.alertService.success('Registration successful, an email has been sent to you, please verify your email', true);
                    this.router.navigate(['/login']);
                },
            error: (error) => {
                    this.alertService.error(error);
                    this.loading = false;
                }
            });
    }
}
