import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { UserService } from '../_services';

import { User, ScoreEntry } from '../_models';

@Component({
  selector: 'app-scoreboard',
  standalone: true,
  imports: [CommonModule, NgxChartsModule],
  templateUrl: './scoreboard.component.html'
})
export class ScoreboardComponent implements OnInit {
  chartData: any[] = [];
  loading: boolean = false;
  customColors = [{ name: 'Score', value: '#ffffff' }];

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.loading = true;
    this.userService.getScoreboard().subscribe({
      next: (users) => {
        // Ensure response is an array
        const usersArray = Array.isArray(users) ? users : Object.values(users);
        // Use `usersArray` for mapping instead of `users`
        this.chartData = usersArray.map(user => ({
          name: user.username,
          series: (user.scores ?? []).map((entry: ScoreEntry) => ({
            name: new Date(entry.submissionDate).getTime(),
            value: entry.score
          }))
        }));
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching scoreboard:', err);
        this.loading = false;
      }
    });
  }
}
