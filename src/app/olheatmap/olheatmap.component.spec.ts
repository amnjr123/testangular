import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OlheatmapComponent } from './olheatmap.component';

describe('OlheatmapComponent', () => {
  let component: OlheatmapComponent;
  let fixture: ComponentFixture<OlheatmapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OlheatmapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OlheatmapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
