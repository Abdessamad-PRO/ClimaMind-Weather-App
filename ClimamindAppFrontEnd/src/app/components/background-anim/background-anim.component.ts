import {
  Component, Input, OnChanges, SimpleChanges,
  ViewChild, ElementRef, AfterViewInit, OnDestroy,
  NgZone, ChangeDetectionStrategy
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeatherCondition } from '../../core/models/weather.model';

@Component({
  selector: 'app-background-anim',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './background-anim.component.html',
  styleUrl: './background-anim.component.scss'
})
export class BackgroundAnimComponent implements AfterViewInit, OnChanges, OnDestroy {
  @Input() condition: WeatherCondition = 'clear';
  @Input() isDay = true;   // ← reçu du dashboard
  @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;

  rays = Array.from({ length: 12 }, (_, i) => i * 30);
  showSun    = false;
  showClouds = false;
  darkClouds = false;
  lightningFlash = false;

  private ctx!: CanvasRenderingContext2D;
  private animId!: number;
  private drops: Drop[]       = [];
  private flakes: Flake[]     = [];
  private mistLayers: Mist[]  = [];
  private stars: Star[]       = [];
  private lightningTimer = 0;
  private W = 0;
  private H = 0;

  constructor(private zone: NgZone) {}

  get skyClass(): string {
    const prefix = this.isDay ? 'day' : 'night';
    return `${prefix}-${this.condition}`;
  }

  ngAfterViewInit() {
    this.ctx = this.canvasRef.nativeElement.getContext('2d')!;
    this.resize();
    window.addEventListener('resize', () => this.resize());
    this.applyCondition();
    this.zone.runOutsideAngular(() => this.animate());
  }

  ngOnChanges(changes: SimpleChanges) {
    if ((changes['condition'] || changes['isDay']) && this.ctx) {
      this.applyCondition();
    }
  }

  ngOnDestroy() {
    cancelAnimationFrame(this.animId);
    window.removeEventListener('resize', () => this.resize());
  }

  private resize() {
    const c = this.canvasRef.nativeElement;
    c.width = this.W = window.innerWidth;
    c.height = this.H = window.innerHeight;
    this.applyCondition();
  }

  private applyCondition() {
    this.drops      = [];
    this.flakes     = [];
    this.mistLayers = [];
    this.stars      = [];

    const c = this.condition;
    this.showSun    = this.isDay && (c === 'clear' || c === 'partly-cloudy');
    this.showClouds = c !== 'clear';
    this.darkClouds = ['rain','drizzle','thunderstorm','stormy','cloudy'].includes(c);

    // Étoiles la nuit (plus ou moins selon les nuages)
    if (!this.isDay) {
      const starCount = c === 'clear' ? 220
                      : c === 'partly-cloudy' ? 100
                      : c === 'mist' ? 30 : 0;
      this.initStars(starCount);
    }

    if (c === 'rain' || c === 'drizzle')               this.initRain(c === 'drizzle' ? 130 : 300);
    if (c === 'thunderstorm' || c === 'stormy')        this.initRain(460, true);
    if (c === 'snow')                                  this.initSnow();
    if (c === 'mist')                                  this.initMist();
  }

  // ── ÉTOILES ──
  private initStars(count: number) {
    for (let i = 0; i < count; i++) {
      this.stars.push({
        x: Math.random() * this.W,
        y: Math.random() * this.H * 0.75,
        r: 0.4 + Math.random() * 1.4,
        alpha: 0.4 + Math.random() * 0.6,
        twinkleSpeed: 0.5 + Math.random() * 2,
        twinklePhase: Math.random() * Math.PI * 2
      });
    }
  }

  // ── PLUIE ──
  private initRain(count: number, heavy = false) {
    for (let i = 0; i < count; i++) {
      this.drops.push({
        x: Math.random() * this.W,
        y: Math.random() * this.H,
        len:   heavy ? 18 + Math.random() * 22 : 12 + Math.random() * 14,
        speed: heavy ? 22 + Math.random() * 14  : 16 + Math.random() * 10,
        alpha: 0.35 + Math.random() * 0.45,
        width: heavy ? 1.2 + Math.random() * 0.8 : 0.7 + Math.random() * 0.5,
        splash: false, splashR: 0, splashX: 0, splashY: 0
      });
    }
  }

  // ── NEIGE ──
  private initSnow() {
    for (let i = 0; i < 180; i++) {
      this.flakes.push({
        x: Math.random() * this.W,
        y: Math.random() * this.H,
        r:     1.5 + Math.random() * 4,
        speed: 0.8 + Math.random() * 1.8,
        drift: (Math.random() - 0.5) * 0.8,
        alpha: 0.5 + Math.random() * 0.45,
        phase: Math.random() * Math.PI * 2
      });
    }
  }

  // ── BRUME ──
  private initMist() {
    for (let i = 0; i < 5; i++) {
      this.mistLayers.push({
        x: Math.random() * this.W,
        y: this.H * 0.3 + Math.random() * this.H * 0.5,
        w: 400 + Math.random() * 600,
        h: 80 + Math.random() * 120,
        speed: 0.15 + Math.random() * 0.25,
        alpha: 0.04 + Math.random() * 0.06
      });
    }
  }

  // ── BOUCLE PRINCIPALE ──
  private animate() {
    this.animId = requestAnimationFrame(() => this.animate());
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.W, this.H);

    // Étoiles (nuit)
    if (!this.isDay && this.stars.length) this.drawStars(ctx);

    const c = this.condition;
    if (c === 'rain' || c === 'drizzle')        this.drawRain(ctx);
    if (c === 'thunderstorm' || c === 'stormy') { this.drawRain(ctx); this.handleLightning(ctx); }
    if (c === 'snow')  this.drawSnow(ctx);
    if (c === 'mist')  this.drawMist(ctx);

    // Halo atmosphérique du soleil (jour clair uniquement, sur canvas)
    if (this.isDay && this.showSun) this.drawSunAtmosphere(ctx);
    // Halo de lune (nuit claire uniquement)
    if (!this.isDay && (c === 'clear' || c === 'partly-cloudy')) this.drawMoonAtmosphere(ctx);
  }

  // ── ÉTOILES ──
  private drawStars(ctx: CanvasRenderingContext2D) {
    const t = Date.now() / 1000;
    for (const s of this.stars) {
      const twinkle = Math.sin(t * s.twinkleSpeed + s.twinklePhase) * 0.3;
      const a = Math.max(0, Math.min(1, s.alpha + twinkle));
      ctx.fillStyle = `rgba(255,255,255,${a})`;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // ── HALO SOLEIL (canvas) ──
  private drawSunAtmosphere(ctx: CanvasRenderingContext2D) {
    const t = Date.now() / 4000;
    const cx = this.W * 0.85;
    const cy = this.H * 0.1;
    const halo = ctx.createRadialGradient(cx, cy, 0, cx, cy, 280);
    halo.addColorStop(0, 'rgba(255,220,80,0.1)');
    halo.addColorStop(0.4, 'rgba(255,170,40,0.05)');
    halo.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = halo;
    ctx.beginPath();
    ctx.arc(cx, cy, 280, 0, Math.PI * 2);
    ctx.fill();

    for (let i = 0; i < 7; i++) {
      const angle = t + (i * Math.PI * 2) / 7;
      const len   = 200 + Math.sin(t * 1.5 + i) * 50;
      const alpha = 0.03 + Math.sin(t + i * 1.4) * 0.015;
      ctx.save();
      ctx.strokeStyle = `rgba(255,220,100,${Math.max(0, alpha)})`;
      ctx.lineWidth   = 16 + i * 3;
      ctx.lineCap     = 'round';
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(angle) * len, cy + Math.sin(angle) * len);
      ctx.stroke();
      ctx.restore();
    }
  }

  // ── HALO LUNE (canvas) ──
  private drawMoonAtmosphere(ctx: CanvasRenderingContext2D) {
    const cx = this.W * 0.87;
    const cy = this.H * 0.1;
    const halo = ctx.createRadialGradient(cx, cy, 20, cx, cy, 200);
    halo.addColorStop(0,   'rgba(255,245,150,0.06)');
    halo.addColorStop(0.4, 'rgba(200,220,255,0.03)');
    halo.addColorStop(1,   'rgba(0,0,0,0)');
    ctx.fillStyle = halo;
    ctx.beginPath();
    ctx.arc(cx, cy, 200, 0, Math.PI * 2);
    ctx.fill();
  }

  // ── PLUIE ──
  private drawRain(ctx: CanvasRenderingContext2D) {
    // Couleur de la pluie différente jour/nuit
    const rainColor = this.isDay
      ? 'rgba(160,200,240,'
      : 'rgba(100,140,200,';

    for (const d of this.drops) {
      d.y += d.speed; d.x -= d.speed * 0.18;
      if (d.y > this.H) { d.y = -d.len; d.x = Math.random() * this.W; d.splash = false; }
      if (d.x < 0) d.x = this.W;

      ctx.save();
      ctx.strokeStyle = `${rainColor}${d.alpha})`;
      ctx.lineWidth   = d.width;
      ctx.lineCap     = 'round';
      ctx.shadowColor = this.isDay ? 'rgba(160,200,240,0.3)' : 'rgba(80,120,200,0.2)';
      ctx.shadowBlur  = 2;
      ctx.beginPath();
      ctx.moveTo(d.x, d.y);
      ctx.lineTo(d.x + d.len * 0.18, d.y - d.len);
      ctx.stroke();
      ctx.restore();

      if (d.y > this.H - 4 && !d.splash) {
        d.splash = true; d.splashX = d.x; d.splashY = this.H - 2; d.splashR = 0;
      }
      if (d.splash) {
        d.splashR += 1.3;
        ctx.save();
        ctx.strokeStyle = `${rainColor}${Math.max(0, 0.4 - d.splashR * 0.05)})`;
        ctx.lineWidth   = 0.6;
        ctx.beginPath();
        ctx.ellipse(d.splashX, d.splashY, d.splashR * 1.8, d.splashR * 0.45, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
        if (d.splashR > 9) d.splash = false;
      }
    }
  }

  // ── ECLAIR ──
  private handleLightning(ctx: CanvasRenderingContext2D) {
    this.lightningTimer++;
    if (this.lightningTimer > 90 + Math.random() * 150) {
      this.lightningTimer = 0;
      this.drawBolt(ctx);
      this.zone.run(() => {
        this.lightningFlash = true;
        setTimeout(() => this.lightningFlash = false, 100);
      });
    }
  }

  private drawBolt(ctx: CanvasRenderingContext2D) {
    const startX = this.W * 0.2 + Math.random() * this.W * 0.6;
    let x = startX; let y = 0;
    const segs: {x: number; y: number}[] = [{x, y}];
    while (y < this.H * 0.68) { x += (Math.random() - 0.5) * 65; y += 40 + Math.random() * 55; segs.push({x, y}); }
    ctx.save();
    ctx.strokeStyle = 'rgba(180,200,255,0.22)'; ctx.lineWidth = 9; ctx.shadowColor = '#a5b4fc'; ctx.shadowBlur = 28;
    ctx.beginPath(); ctx.moveTo(segs[0].x, segs[0].y); segs.slice(1).forEach(s => ctx.lineTo(s.x, s.y)); ctx.stroke();
    ctx.strokeStyle = 'rgba(220,232,255,0.95)'; ctx.lineWidth = 1.5; ctx.shadowBlur = 10;
    ctx.beginPath(); ctx.moveTo(segs[0].x, segs[0].y); segs.slice(1).forEach(s => ctx.lineTo(s.x, s.y)); ctx.stroke();
    ctx.restore();
  }

  // ── NEIGE ──
  private drawSnow(ctx: CanvasRenderingContext2D) {
    const t = Date.now() / 1000;
    const snowColor = this.isDay ? '230,240,255' : '200,215,240';
    for (const f of this.flakes) {
      f.y += f.speed; f.x += f.drift + Math.sin(t * 0.5 + f.phase) * 0.4;
      if (f.y > this.H + f.r) { f.y = -f.r; f.x = Math.random() * this.W; }
      if (f.x > this.W + f.r) f.x = -f.r;
      if (f.x < -f.r)         f.x = this.W + f.r;
      const grd = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.r);
      grd.addColorStop(0, `rgba(${snowColor},${f.alpha})`);
      grd.addColorStop(1, `rgba(${snowColor},0)`);
      ctx.fillStyle = grd;
      ctx.beginPath(); ctx.arc(f.x, f.y, f.r * 1.2, 0, Math.PI * 2); ctx.fill();
    }
  }

  // ── BRUME ──
  private drawMist(ctx: CanvasRenderingContext2D) {
    const mistColor = this.isDay ? '180,200,220' : '80,100,140';
    for (const m of this.mistLayers) {
      m.x += m.speed;
      if (m.x > this.W + m.w) m.x = -m.w;
      const grd = ctx.createRadialGradient(
        m.x + m.w / 2, m.y + m.h / 2, 0,
        m.x + m.w / 2, m.y + m.h / 2, Math.max(m.w, m.h) * 0.6
      );
      grd.addColorStop(0, `rgba(${mistColor},${m.alpha})`);
      grd.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = grd;
      ctx.beginPath();
      ctx.ellipse(m.x + m.w / 2, m.y + m.h / 2, m.w * 0.6, m.h * 0.5, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

interface Drop  { x: number; y: number; len: number; speed: number; alpha: number; width: number; splash: boolean; splashR: number; splashX: number; splashY: number; }
interface Flake { x: number; y: number; r: number; speed: number; drift: number; alpha: number; phase: number; }
interface Mist  { x: number; y: number; w: number; h: number; speed: number; alpha: number; }
interface Star  { x: number; y: number; r: number; alpha: number; twinkleSpeed: number; twinklePhase: number; }