import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { AppointmentSelectionTypeModalComponent } from './appointment-selection-type-modal.component';

describe('AppointmentSelectionTypeModalComponent', () => {
  let component: AppointmentSelectionTypeModalComponent;
  let fixture: ComponentFixture<AppointmentSelectionTypeModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AppointmentSelectionTypeModalComponent],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(AppointmentSelectionTypeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
