import { Component, OnInit, OnDestroy } from '@angular/core';
import Lenis from 'lenis';
import { Title, Meta } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import {LanguageService} from "src/app/services/language/language.service"
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { ParticlesService } from './services/particles/particles.service';
import { LoadingService } from './services/loading/loading.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: false
})
export class AppComponent implements OnInit, OnDestroy{
  title = 'ranimohadikar-portfolio';
  appContentVisible = false;
  private lenis: Lenis;

  constructor(
    private titleService: Title,
    private metaService: Meta,
    private translateService: TranslateService,
    private location: Location,
    private languageService: LanguageService,
    private particlesService: ParticlesService,
    private loadingService: LoadingService
    ){
    }
  ngOnInit(): void{

    this.languageService.initLanguage()

    this.titleService.setTitle( "Rani Mohadikar | Frontend Developer" );

    this.metaService.addTags([
      {name: 'keywords', content: 'Frontend, software, developer, Angular, React, Node.js'},
      {name: 'description', content: 'Sr. Software Engineer with 5+ years of experience in Angular, React.js, and Node.js. Building scalable web and mobile applications across healthcare, fintech, and AI-driven systems.'},
    ]);

    // Initialize global particles after a short delay
    setTimeout(() => {
      this.particlesService.init();
    }, 100);
  }

  private initLenis(): void {
    this.lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      gestureOrientation: 'vertical',
      smoothWheel: true,
      syncTouch: false
    });

    // Animation function
    const raf = (time: number) => {
      this.lenis.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
  }

  ngOnDestroy(): void {
    if (this.lenis) {
      this.lenis.destroy();
    }

    // Destroy particles
    this.particlesService.destroy();
  }

  onSplashAnimationCompleted(): void {
    this.appContentVisible = true;
    
    // Initialize Lenis after content becomes visible
    setTimeout(() => {
      this.initLenis();
    }, 100);
    
    // Iniciar animaciones de los componentes
    this.loadingService.startAnimations();
  }

}
