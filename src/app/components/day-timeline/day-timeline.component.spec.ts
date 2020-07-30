import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DayTimelineComponent } from './day-timeline.component';

describe('DayTimelineComponent', () => {
  let component: DayTimelineComponent;
  let fixture: ComponentFixture<DayTimelineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DayTimelineComponent],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(DayTimelineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
