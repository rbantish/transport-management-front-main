import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { CookieCustomService } from './services/cookie.service';
import { CookieService } from 'ngx-cookie-service';
import { CoreModule } from './modules/core.modules';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
     provideRouter(routes), 
     provideAnimationsAsync(),
     provideHttpClient(), 
     {provide: LocationStrategy, useClass: HashLocationStrategy},
     MessageService, 
     CookieCustomService, 
     CookieService
    ]

};
