import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SecurityContainer } from './security-container';

describe('SecurityContainer', () => {
  let component: SecurityContainer;
  let fixture: ComponentFixture<SecurityContainer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SecurityContainer],
    }).compileComponents();

    fixture = TestBed.createComponent(SecurityContainer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
