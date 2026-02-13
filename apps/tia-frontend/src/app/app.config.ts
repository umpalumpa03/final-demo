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
import { profilePhotoFeature } from './features/bank/settings/components/profile-photo/store/profile-photo/profile-photo.reducer';
import { ProfilePhotoEffects } from './features/bank/settings/components/profile-photo/store/profile-photo/profile-photo.effects';
import { securityFeature } from './features/bank/settings/components/security/store/security.reducer';
import { SecurityEffects } from './features/bank/settings/components/security/store/security.effects';
import { userInfoFeature } from './store/user-info/user-info.reducer';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './core/auth/interceptors/auth-interceptor';

import { HttpClient } from '@angular/common/http';
import { TranslateLoader, provideTranslateService } from '@ngx-translate/core';
import { createLazyTranslateLoader } from './core/i18n';
import { UserInfoEffects } from './store/user-info/user-info.effect';
import { userInfoReducer } from './store/user-info/user-info.reducer';
import { personalInfoReducer } from './store/personal-info/personal-info.reducer';
import { PersonalInfoEffects } from './store/personal-info/personal-info.effects';
import { clearStateMetaReducer } from './store/meta-reducers';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(appRoutes),
    provideStore({}, {}),
    provideState(themeFeature),
    provideState(profilePhotoFeature),
    provideState(securityFeature),
    provideState(userInfoFeature),
    provideState('user-info', userInfoReducer),
    provideState('personalInfo', personalInfoReducer),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideEffects([
      ThemeEffects,
      ProfilePhotoEffects,
      SecurityEffects,
      UserInfoEffects,
      PersonalInfoEffects,
    ]),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: environment.production,
    }),
    provideStore(
      {},
      {
        metaReducers: [clearStateMetaReducer],
      },
    ),
    provideTranslateService({
      loader: {
        provide: TranslateLoader,
        useFactory: createLazyTranslateLoader,
        deps: [HttpClient],
      },
      fallbackLang: 'en',
    }),
  ],
};
