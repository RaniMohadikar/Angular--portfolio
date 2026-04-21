import { Component, OnInit, AfterViewInit, ElementRef, HostListener } from '@angular/core';
import { AnalyticsService } from 'src/app/services/analytics/analytics.service';
import { AnimationsService } from 'src/app/services/animations/animations.service';

@Component({
    selector: 'app-contact',
    templateUrl: './contact.component.html',
    styleUrls: ['./contact.component.scss'],
    standalone: false
})
export class ContactComponent implements OnInit, AfterViewInit {

  showContactModal = false;

  readonly whatsappUrl = 'https://wa.me/917387547387?text=Hi%20Rani!%20I%20found%20your%20portfolio%20and%20would%20like%20to%20connect.';
  readonly emailUrl   = 'mailto:ranimohadikar22@gmail.com?subject=Hello%20from%20your%20Portfolio&body=Hi%20Rani%2C%0A%0AI%20visited%20your%20portfolio%20and%20would%20like%20to%20get%20in%20touch.';

  constructor(
    public analyticsService: AnalyticsService,
    private animationsService: AnimationsService,
    private elementRef: ElementRef
  ) { }

  ngOnInit(): void {
  }

  openContactModal(): void {
    this.showContactModal = true;
    this.analyticsService.sendAnalyticEvent('click_say_hello', 'contact', 'open_modal');
  }

  closeContactModal(): void {
    this.showContactModal = false;
  }

  openWhatsApp(): void {
    this.analyticsService.sendAnalyticEvent('click_whatsapp', 'contact', 'whatsapp');
    window.open(this.whatsappUrl, '_blank');
  }

@HostListener('document:keydown.escape')
  onEscapeKey(): void {
    this.closeContactModal();
  }

  ngAfterViewInit(): void {
    this.initAnimations();
  }

  private initAnimations(): void {
    const contactSection = this.elementRef.nativeElement;

    // Animar contenedor del título
    const titleContainer = contactSection.querySelector('.mb-4');
    if (titleContainer) {
      this.animationsService.observeElement(titleContainer, {
        type: 'fadeInDown',
        duration: 1000
      });
    }

    // Animar título principal con typewriter
    const mainTitle = contactSection.querySelector('.contact-title');
    if (mainTitle) {
      this.animationsService.observeElement(mainTitle, {
        type: 'typewriter',
        delay: 500
      });
    }

    // Animar párrafo de descripción
    const description = contactSection.querySelector('p');
    if (description) {
      this.animationsService.observeElement(description, {
        type: 'morphIn',
        duration: 1200,
        delay: 2500
      });
    }

    // Animar botón de contacto
    const contactButton = contactSection.querySelector('.contact-btn');
    if (contactButton) {
      this.animationsService.observeElement(contactButton.parentElement as HTMLElement, {
        type: 'scaleIn',
        duration: 800,
        delay: 3500
      });

      // Añadir efectos hover especiales al botón
      this.animationsService.addHoverEffects(contactButton as HTMLElement, ['lift', 'glow']);
    }
  }
}
