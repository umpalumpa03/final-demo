import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProviderListContainer } from './provider-list-container';

describe('ProviderListContainer', () => {
  let component: ProviderListContainer;
  let fixture: ComponentFixture<ProviderListContainer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProviderListContainer],
    }).compileComponents();

    fixture = TestBed.createComponent(ProviderListContainer);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
