import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TreeContainer } from './tree-container';

describe('TreeContainer', () => {
  let component: TreeContainer;
  let fixture: ComponentFixture<TreeContainer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TreeContainer],
    }).compileComponents();

    fixture = TestBed.createComponent(TreeContainer);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
