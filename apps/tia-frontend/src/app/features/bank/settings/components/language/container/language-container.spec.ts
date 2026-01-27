import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LanguageContainer } from './language-container';
import { provideTranslateService } from '@ngx-translate/core';

describe('LanguageContainer', () => {
  let component: LanguageContainer;
  let fixture: ComponentFixture<LanguageContainer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LanguageContainer],
      providers: [provideTranslateService()]
    }).compileComponents();

    fixture = TestBed.createComponent(LanguageContainer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

