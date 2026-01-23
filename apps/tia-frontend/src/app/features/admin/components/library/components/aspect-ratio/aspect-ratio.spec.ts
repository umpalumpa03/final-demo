import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AspectRatioComponent } from './aspect-ratio';
import { AspectRatioItem } from '../../../../../../shared/lib/data-display/aspect-ratio/models/aspect-ratio.models';

describe('AspectRatioComponent', () => {
  let component: AspectRatioComponent;
  let fixture: ComponentFixture<AspectRatioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AspectRatioComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AspectRatioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should expose ratios data', () => {
    expect(component.title).toBe('Aspect Ratio');
    expect(component.ratios().length).toBeGreaterThan(0);
  });

  it('should set selectedRatio when item is selected', () => {
    const selected = component.ratios()[0] as AspectRatioItem;

    component.onRatioSelected(selected);

    expect(component.selectedRatio()?.id).toEqual(selected.id);
  });

  it('should return true when ratios exist and false when empty', () => {
    expect(component.hasRatios()).toBe(true);

    component.ratios.set([]);

    expect(component.hasRatios()).toBe(false);
  });
});
