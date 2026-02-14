import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LanguageContainer } from './language-container';
import { provideTranslateService } from '@ngx-translate/core';
import { Store } from '@ngrx/store';
import { LanguageService } from '../services/language-api.service';
import { of } from 'rxjs';
import { signal } from '@angular/core';

describe('LanguageContainer', () => {
  let component: LanguageContainer;
  let fixture: ComponentFixture<LanguageContainer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LanguageContainer],
      providers: [
        provideTranslateService(),
        {
          provide: Store,
          useValue: { selectSignal: () => signal(null), dispatch: () => {} },
        },
        {
          provide: LanguageService,
          useValue: {
            getAvailableLanguages: () => of([]),
            updateUserLanguage: () => of({ successs: true }),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LanguageContainer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
