import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TimelineAppointmentComponent } from './timeline-appointment.component';

describe('AgendaAppointmentComponent', () => {
  let component: TimelineAppointmentComponent;
  let fixture: ComponentFixture<TimelineAppointmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TimelineAppointmentComponent],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(TimelineAppointmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
