import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchAndSortComponent } from './search-and-sort.component';

describe('SearchAndSortComponent', () => {
  let component: SearchAndSortComponent;
  let fixture: ComponentFixture<SearchAndSortComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SearchAndSortComponent]
    });
    fixture = TestBed.createComponent(SearchAndSortComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
