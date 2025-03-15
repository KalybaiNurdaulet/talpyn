import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LectureListingComponent } from './lecture-listing.component';

describe('LectureListingComponent', () => {
  let component: LectureListingComponent;
  let fixture: ComponentFixture<LectureListingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LectureListingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LectureListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
