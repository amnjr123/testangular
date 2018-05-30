import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SidenavFiltersComponent } from './sidenav-filters.component';

describe('SidenavFiltersComponent', () => {
  let component: SidenavFiltersComponent;
  let fixture: ComponentFixture<SidenavFiltersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SidenavFiltersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SidenavFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
