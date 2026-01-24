import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FlexLayout } from './flex-layout';

describe('FlexLayout', () => {
  let component: FlexLayout;
  let fixture: ComponentFixture<FlexLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FlexLayout],
    }).compileComponents();

    fixture = TestBed.createComponent(FlexLayout);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should apply space-between modifier when variant is set', () => {
    fixture.componentRef.setInput('variant', 'space-between');
    fixture.detectChanges();

    const element = fixture.nativeElement.querySelector('.ta-flex-layout');
    expect(element.classList).toContain('flex-layout--space-between');
  });

  it('should apply center modifier when variant is set', () => {
    fixture.componentRef.setInput('variant', 'center');
    fixture.detectChanges();

    const element = fixture.nativeElement.querySelector('.ta-flex-layout');
    expect(element.classList).toContain('flex-layout--center');
  });

  it('should apply wrap modifier when variant is flex-wrap', () => {
    fixture.componentRef.setInput('variant', 'flex-wrap');
    fixture.detectChanges();

    const element = fixture.nativeElement.querySelector('.ta-flex-layout');
    expect(element.classList).toContain('flex-layout--wrap');
  });
});
