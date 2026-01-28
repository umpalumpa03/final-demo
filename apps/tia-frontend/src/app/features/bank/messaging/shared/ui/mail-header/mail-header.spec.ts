import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MailHeader } from './mail-header';
import { TranslateModule } from '@ngx-translate/core';

describe('MailHeader', () => {
  let component: MailHeader;
  let fixture: ComponentFixture<MailHeader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MailHeader,
        TranslateModule.forRoot()
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MailHeader);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
