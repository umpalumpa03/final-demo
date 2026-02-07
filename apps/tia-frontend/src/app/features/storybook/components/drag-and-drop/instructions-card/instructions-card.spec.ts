import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InstructionsCard } from './instructions-card';
import { TranslateModule } from '@ngx-translate/core';

describe('InstructionsCard', () => {
  let component: InstructionsCard;
  let fixture: ComponentFixture<InstructionsCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InstructionsCard, TranslateModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(InstructionsCard);
    component = fixture.componentInstance;
    fixture.detectChanges(); 
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
