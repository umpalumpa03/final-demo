import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoansGrid } from './loans-grid';
import { TranslateModule } from '@ngx-translate/core';

describe('LoansGrid', () => {
  let component: LoansGrid;
  let fixture: ComponentFixture<LoansGrid>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoansGrid, TranslateModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(LoansGrid);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('loans', []);
    fixture.componentRef.setInput('emptyConfig', {
      title: 'Test',
      message: 'Test',
      button: 'Test',
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
