import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Important } from './important';
import { TranslateModule } from '@ngx-translate/core';

describe('Important', () => {
  let component: Important;
  let fixture: ComponentFixture<Important>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        Important,
        TranslateModule.forRoot()
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Important);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
