import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SocialMediaPageComponent } from './social-media-page.component';

describe('SocialMediaPageComponent', () => {
  let component: SocialMediaPageComponent;
  let fixture: ComponentFixture<SocialMediaPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SocialMediaPageComponent]
    });
    fixture = TestBed.createComponent(SocialMediaPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
