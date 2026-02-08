import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LanguageInfo } from './language-info';
import { TranslateModule } from '@ngx-translate/core';

describe('LanguageInfo', () => {
  let component: LanguageInfo;
  let fixture: ComponentFixture<LanguageInfo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LanguageInfo, TranslateModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(LanguageInfo);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
