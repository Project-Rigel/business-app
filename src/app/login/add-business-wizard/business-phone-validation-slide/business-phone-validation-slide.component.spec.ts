import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { BusinessPhoneValidationSlideComponent } from './business-phone-validation-slide.component';

describe('BusinessPhoneValidationSlideComponent', () => {
  let component: BusinessPhoneValidationSlideComponent;
  let fixture: ComponentFixture<BusinessPhoneValidationSlideComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BusinessPhoneValidationSlideComponent],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(BusinessPhoneValidationSlideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
