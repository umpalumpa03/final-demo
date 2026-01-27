import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProviderList } from './provider-list';

describe('ProviderList', () => {
  let component: ProviderList;
  let fixture: ComponentFixture<ProviderList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProviderList],
    }).compileComponents();

    fixture = TestBed.createComponent(ProviderList);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('categoryName', 'Test Category');
    fixture.componentRef.setInput('providers', []);

    fixture.componentRef.setInput('iconBgColor', '#ffffff');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
