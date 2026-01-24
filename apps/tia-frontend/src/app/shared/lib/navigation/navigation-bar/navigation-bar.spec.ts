import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavigationBar } from './navigation-bar';
import { RouterModule } from '@angular/router';

describe('NavigationBar', () => {
  let component: NavigationBar;
  let fixture: ComponentFixture<NavigationBar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavigationBar, RouterModule.forRoot([]),],
    }).compileComponents();

    fixture = TestBed.createComponent(NavigationBar);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('items', [
      { label: 'Home', route: '/home' },
      { label: 'About', route: '/about' }
    ]);
    fixture.componentRef.setInput('activeItem', 'Home');

    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should mark the correct item as active', () => {
    const items = component.routeWithActive();
    expect(items[0].isActive).toBeTruthy();
    expect(items[1].isActive).toBeFalsy();
  });

  it('should update active item when input changes', async () => {
    fixture.componentRef.setInput('activeItem', 'About');
    fixture.detectChanges();
    await fixture.whenStable();
    const items = component.routeWithActive();
    expect(items[0].isActive).toBeFalsy();
    expect(items[1].isActive).toBeTruthy();
  });
});