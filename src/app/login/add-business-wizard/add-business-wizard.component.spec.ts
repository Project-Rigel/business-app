import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { AddBusinessWizardComponent } from './add-business-wizard.component';

describe('AddBusinessWizardComponent', () => {
  let component: AddBusinessWizardComponent;
  let fixture: ComponentFixture<AddBusinessWizardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddBusinessWizardComponent],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(AddBusinessWizardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
