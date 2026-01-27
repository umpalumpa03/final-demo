import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LanguageContainer } from './language-container';

describe('LanguageContainer', () => {
  let component: LanguageContainer;
  let fixture: ComponentFixture<LanguageContainer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LanguageContainer],
    }).compileComponents();

    fixture = TestBed.createComponent(LanguageContainer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

