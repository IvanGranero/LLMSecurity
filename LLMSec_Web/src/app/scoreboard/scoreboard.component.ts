import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxChartsModule } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-scoreboard',
  standalone: true,
  imports: [CommonModule, NgxChartsModule],
  templateUrl: './scoreboard.component.html',
  styleUrls: ['./scoreboard.component.css']
})
export class ScoreboardComponent implements OnInit {
  chartData: any[] = [];

  ngOnInit() {
    const users = [
      {
        name: 'Team Alpha',
        score_timeline: [
          { timestamp: new Date("2025-06-01T13:00:00Z"), score: 150 },
          { timestamp: new Date("2025-06-01T14:00:00Z"), score: 200 }
        ]
      },
      {
        name: 'Team Beta',
        score_timeline: [
          { timestamp: new Date("2025-06-01T13:30:00Z"), score: 100 },
          { timestamp: new Date("2025-06-01T14:30:00Z"), score: 180 }
        ]
      }
    ];

    this.chartData = users.map(user => ({
      name: user.name,
      series: user.score_timeline.map(entry => ({
        name: entry.timestamp.toISOString(),
        value: entry.score
      }))
    }));
  }
}
