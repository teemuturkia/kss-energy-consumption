import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ChartOptions, ChartType } from 'chart.js';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.sass']
})
export class ChartComponent implements OnInit {

  private labels = ['Tammi', 'Helmi', 'Maalis', 'Huhti', 'Touko', 'Kesä', 'Heinä', 'Elo', 'Syys', 'Loka', 'Marras', 'Joulu'];
  showWarning = false;
  public data = {
    labels: this.labels,
    datasets: [] as any[]
  };

  public lineChartOptions: (ChartOptions & { annotation?: any }) = {
    responsive: true
  };
  public lineChartType: ChartType = 'line';

  constructor(private http: HttpClient) {
  }

  private convertToDataSet(httpData: any) {
    const dataSets: any[] = [];
    const years = Object.keys(httpData).sort();
    this.showWarning = false;
    if (years.length === 0) {
      console.log('warniiing');
      this.showWarning = true;
    }
    console.log('years', years);
    years.forEach(year => {
      const months = httpData[year];
      const keys = Object.keys(months);
      let first = parseInt(keys[0]), last = parseInt(keys[0]);
      keys.forEach(key => {
        const keyInt = parseInt(key);
        first = Math.min(keyInt, first);
        last = Math.max(keyInt, last);
      });
      if (first > 1) {
        for (let i = first - 1; i > 0; i--) {
          months[i] = 0;
        }
      }
      const sorted = Object.keys(months).sort((a, b) => {
        return parseInt(a) - parseInt(b);
      });
      dataSets.push({
        label: year,
        data: sorted.map(key => months[key])
      });
    });
    this.data = {
      labels: this.labels,
      datasets: dataSets
    }
  }

  ngOnInit(): void {
    this.http.get('/api/consumption').subscribe((res) => {
      this.convertToDataSet(res);
    }, console.error)
  }

}
