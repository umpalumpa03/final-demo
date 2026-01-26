import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoansContainer } from './loans-container';

describe('LoansContainer', () => {
  let component: LoansContainer;
  let fixture: ComponentFixture<LoansContainer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoansContainer],
    }).compileComponents();

    fixture = TestBed.createComponent(LoansContainer);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
