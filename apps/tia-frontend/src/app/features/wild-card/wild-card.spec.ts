import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { WildCardComponent } from './wild-card';
import { describe, it, expect, beforeEach } from 'vitest';
import { TranslateModule } from '@ngx-translate/core';

describe('WildCardComponent', () => {
  let component: WildCardComponent;
  let fixture: ComponentFixture<WildCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WildCardComponent, TranslateModule.forRoot()],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(WildCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('Should create a component', () => {
    expect(component).toBeTruthy();
  });
});
