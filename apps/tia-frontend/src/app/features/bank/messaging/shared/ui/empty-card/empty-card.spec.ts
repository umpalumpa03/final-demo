import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmptyCard } from './empty-card';
import { TranslateModule } from '@ngx-translate/core';

describe('EmptyCard', () => {
  let component: EmptyCard;
  let fixture: ComponentFixture<EmptyCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmptyCard, TranslateModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(EmptyCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
