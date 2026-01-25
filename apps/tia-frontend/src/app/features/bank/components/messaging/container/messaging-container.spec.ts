import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MessagingContainer } from './messaging-container';

describe('MessagingContainer', () => {
  let component: MessagingContainer;
  let fixture: ComponentFixture<MessagingContainer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MessagingContainer],
    }).compileComponents();

    fixture = TestBed.createComponent(MessagingContainer);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
