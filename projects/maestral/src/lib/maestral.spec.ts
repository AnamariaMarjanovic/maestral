import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Maestral } from './maestral';

describe('Maestral', () => {
  let component: Maestral;
  let fixture: ComponentFixture<Maestral>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Maestral],
    }).compileComponents();

    fixture = TestBed.createComponent(Maestral);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
