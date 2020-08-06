import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { AddAppointmentWizardComponent } from './add-appointment-wizard.component';

describe('AddAppointmentWizardComponent', () => {
  let component: AddAppointmentWizardComponent;
  let fixture: ComponentFixture<AddAppointmentWizardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddAppointmentWizardComponent],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(AddAppointmentWizardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
