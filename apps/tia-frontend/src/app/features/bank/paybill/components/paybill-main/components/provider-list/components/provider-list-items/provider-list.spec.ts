import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProviderList } from './provider-list';
import { PaybillProvider } from '../../../../shared/models/paybill.model';

describe('ProviderList', () => {
  let component: ProviderList;
  let fixture: ComponentFixture<ProviderList>;

  const mockProviders: PaybillProvider[] = [
    { id: 'p1', serviceName: 's1', categoryId: 'c1', name: 'Provider 1' },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProviderList],
    }).compileComponents();

    fixture = TestBed.createComponent(ProviderList);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('headerTitle', 'Test Category');
    fixture.componentRef.setInput('providers', mockProviders);
    fixture.componentRef.setInput('isRoot', true);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit selected event when an item is clicked', () => {
    const spy = vi.spyOn(component.selected, 'emit');

    component.selected.emit('p1');
    expect(spy).toHaveBeenCalledWith('p1');
  });
});
