import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShareWithSocialComponent } from './share-with-social.component';

describe('ShareWithSocialComponent', () => {
  let component: ShareWithSocialComponent;
  let fixture: ComponentFixture<ShareWithSocialComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ShareWithSocialComponent]
    });
    fixture = TestBed.createComponent(ShareWithSocialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
