import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AlertService } from '../_services';
import { NgIf, CommonModule } from '@angular/common';

@Component({
    selector: 'alert',
    templateUrl: 'alert.component.html',
    imports: [NgIf, CommonModule]
})
export class AlertComponent implements OnInit, OnDestroy {
    private subscription!: Subscription;
    message: any;
    private timeoutId: any;
    fadeOut = false;

    constructor(private alertService: AlertService) {}

    ngOnInit() {
        this.subscription = this.alertService.getMessage().subscribe(message => {
            this.message = message;
            this.fadeOut = false;

            if (this.timeoutId) {
                clearTimeout(this.timeoutId);
            }

            this.timeoutId = setTimeout(() => {
                this.fadeOut = true;

                // Wait for the fade-out animation to finish before clearing the message
                setTimeout(() => {
                    this.message = null;
                }, 500); // Match this with the CSS transition duration
            }, 3000);
        });
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
        }
    }
}