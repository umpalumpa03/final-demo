import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideState, provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';
import { themeFeature } from './store/theme/theme.reducer';
import { ThemeEffects } from './store/theme/theme.effects';
import { profilePhotoFeature } from './store/profile-photo/profile-photo.reducer';
import { ProfilePhotoEffects } from './store/profile-photo/profile-photo.effects';
import { securityFeature } from './features/bank/settings/components/security/store/security.reducer';
import { SecurityEffects } from './features/bank/settings/components/security/store/security.effects';
import { userInfoFeature } from './store/user-info/user-info.reducer';
import {
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import { authInterceptor } from './core/auth/interceptors/auth-interceptor';

import { HttpClient } from '@angular/common/http';
import { TranslateLoader, provideTranslateService } from '@ngx-translate/core';
import { createMultiFileTranslateLoader } from './core/i18n';
import { UserInfoEffects } from './store/user-info/user-info.effect';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(appRoutes),
    provideStore({}, {}),
    provideState(themeFeature),
    provideState(profilePhotoFeature),
    provideState(securityFeature),
    provideState(userInfoFeature),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideEffects([ThemeEffects, ProfilePhotoEffects, SecurityEffects, UserInfoEffects]),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: environment.production,
    }),
    provideTranslateService({
      loader: {
        provide: TranslateLoader,
        useFactory: createMultiFileTranslateLoader,
        deps: [HttpClient],
      },
      fallbackLang: 'en'
    }),
  ],
};
