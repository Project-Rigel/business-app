import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { BusinessPhoneNumberSlideComponent } from './business-phone-number-slide.component';

describe('BusinessPhoneNumberSlideComponent', () => {
  let component: BusinessPhoneNumberSlideComponent;
  let fixture: ComponentFixture<BusinessPhoneNumberSlideComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BusinessPhoneNumberSlideComponent],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(BusinessPhoneNumberSlideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
