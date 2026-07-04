import { Component, ElementRef, ViewChild, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import lottie from 'lottie-web';

@Component({
  selector: 'app-splash-screen',
  templateUrl: './splash-screen.component.html',
  styleUrls: ['./splash-screen.component.scss'],
  standalone: false
})
export class SplashScreenComponent implements OnInit, OnDestroy {
  @ViewChild('lottieContainer', { static: true }) lottieContainer!: ElementRef;
  @Output() animationCompleted = new EventEmitter<void>();

  isHidden = false;
  loadingText = 'Loading...';
  
  private lottieAnimation: any;
  private minimumLoadingTime = 1800;
  private startTime = Date.now();
  private splashTimeout?: number;

  constructor(private translate: TranslateService) {}

  ngOnInit(): void {
    this.setupTranslations();
    this.initLottieAnimation();
    this.startSplashTimer();
  }

  ngOnDestroy(): void {
    if (this.lottieAnimation) {
      this.lottieAnimation.destroy();
    }
    if (this.splashTimeout) {
      clearTimeout(this.splashTimeout);
    }
  }

  private setupTranslations(): void {
    this.translate.get('Loading').subscribe((text: string) => {
      this.loadingText = text || 'Loading...';
    });
  }

  private initLottieAnimation(): void {
    try {
      this.lottieAnimation = lottie.loadAnimation({
        container: this.lottieContainer.nativeElement,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: 'assets/lotties/loader.json'
      });

      this.lottieAnimation.addEventListener('error', (error: any) => {
        console.warn('Lottie animation error:', error);
      });
    } catch (error) {
      console.warn('Error initializing Lottie animation:', error);
    }
  }

  private startSplashTimer(): void {
    // Wait minimum time then check if splash can be hidden
    this.splashTimeout = window.setTimeout(() => {
      this.checkIfReadyToHide();
    }, this.minimumLoadingTime);
  }

  private checkIfReadyToHide(): void {
    // Check if DOM is fully loaded
    if (document.readyState === 'complete') {
      this.hideSplashScreen();
    } else {
      // If not complete, wait a bit more
      window.addEventListener('load', () => {
        this.hideSplashScreen();
      }, { once: true });
      
      // Fallback after 2 additional seconds
      setTimeout(() => {
        this.hideSplashScreen();
      }, 2000);
    }
  }

  private hideSplashScreen(): void {
    if (this.isHidden) return; // Prevent multiple calls
    
    this.isHidden = true;
    
    // Emit event after exit animation ends
    setTimeout(() => {
      this.animationCompleted.emit();
    }, 800); // Matches CSS transition duration
  }
}