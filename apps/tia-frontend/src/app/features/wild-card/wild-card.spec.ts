import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { WildCardComponent } from './wild-card';
import { vi, describe, it, expect, beforeEach } from 'vitest';

describe('WildCardComponent', () => {
  let component: WildCardComponent;
  let fixture: ComponentFixture<WildCardComponent>;
  let router: Router;

  beforeEach(async () => {
    const routerMock = {
      navigate: vi.fn().mockResolvedValue(true),
    };

    await TestBed.configureTestingModule({
      imports: [WildCardComponent],
      providers: [{ provide: Router, useValue: routerMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(WildCardComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create a component', () => {
    expect(component).toBeTruthy();
  });

  it('must redirect to the library page', async () => {
    await component.navigateToLibrary();
    expect(router.navigate).toHaveBeenCalledWith(['/admin/library']);
  });
});
