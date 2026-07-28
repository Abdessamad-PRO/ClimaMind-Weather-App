import {
  Component, Input, OnChanges, ViewChild,
  ElementRef, AfterViewInit, ChangeDetectionStrategy
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeatherData, ForecastDay } from '../../core/models/weather.model';

@Component({
  selector: 'app-forecast-wave',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './forecast-wave.component.html',
  styleUrls: ['./forecast-wave.component.scss']
})
export class ForecastWaveComponent implements OnChanges, AfterViewInit {
  @Input() weather?: WeatherData;
  @ViewChild('waveCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;

  ngAfterViewInit() { this.drawWave(); }
  ngOnChanges() { if (this.canvasRef) setTimeout(() => this.drawWave(), 50); }

  private drawWave() {
    if (!this.canvasRef || !this.weather?.forecast?.length) return;
    const canvas = this.canvasRef.nativeElement;
    const parent = canvas.parentElement!;
    canvas.width = parent.offsetWidth;
    canvas.height = 60;
    const ctx = canvas.getContext('2d')!;
    const W = canvas.width;
    const H = canvas.height;

    const temps = this.weather.forecast.map(d => d.tempMax);
    const min = Math.min(...temps);
    const max = Math.max(...temps);
    const range = max - min || 1;
    const step = W / (temps.length - 1);

    const pts = temps.map((t, i) => ({
      x: i * step,
      y: H - 10 - ((t - min) / range) * (H - 20)
    }));

    const grd = ctx.createLinearGradient(0, 0, W, 0);
    grd.addColorStop(0, 'rgba(99,179,237,0.6)');
    grd.addColorStop(0.5, 'rgba(147,197,253,0.8)');
    grd.addColorStop(1, 'rgba(99,179,237,0.6)');

    ctx.strokeStyle = grd;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y);
    for (let i = 1; i < pts.length; i++) {
      const mx = (pts[i - 1].x + pts[i].x) / 2;
      ctx.bezierCurveTo(mx, pts[i - 1].y, mx, pts[i].y, pts[i].x, pts[i].y);
    }
    ctx.stroke();

    // Fill under wave
    ctx.lineTo(W, H);
    ctx.lineTo(0, H);
    ctx.closePath();
    const fill = ctx.createLinearGradient(0, 0, 0, H);
    fill.addColorStop(0, 'rgba(99,179,237,0.12)');
    fill.addColorStop(1, 'rgba(99,179,237,0)');
    ctx.fillStyle = fill;
    ctx.fill();

    // Dots
    pts.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = '#93c5fd';
      ctx.fill();
    });
  }

  getIcon(day: ForecastDay): string {
    const map: Record<string, string> = {
      'clear': '☀️', 'partly-cloudy': '⛅', 'cloudy': '☁️',
      'rain': '🌧️', 'drizzle': '🌦️', 'thunderstorm': '⛈️',
      'stormy': '🌩️', 'snow': '❄️', 'mist': '🌫️'
    };
    return map[day.condition] || '🌤️';
  }
}