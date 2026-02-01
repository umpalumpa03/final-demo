import { TranslateService } from '@ngx-translate/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SidePanel } from './side-panel';

describe('SidePanel', () => {
const createMockObservable = () => ({ subscribe: () => ({ unsubscribe: () => {} }) });
const mockTranslate = {
  instant: () => '',
  get: () => createMockObservable(),
  stream: () => createMockObservable(),
  currentLang: 'en',
  onLangChange: createMockObservable(),
  onTranslationChange: createMockObservable(),
  onDefaultLangChange: createMockObservable(),
};
  let component: SidePanel;
  let fixture: ComponentFixture<SidePanel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidePanel],
      providers: [
        { provide: TranslateService, useValue: mockTranslate },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SidePanel);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
