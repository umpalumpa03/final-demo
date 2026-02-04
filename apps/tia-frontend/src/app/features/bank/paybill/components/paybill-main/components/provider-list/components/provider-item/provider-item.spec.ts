import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProviderItem } from './provider-item';

describe('ProviderItem', () => {
  let component: ProviderItem;
  let fixture: ComponentFixture<ProviderItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProviderItem],
    }).compileComponents();

    fixture = TestBed.createComponent(ProviderItem);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
