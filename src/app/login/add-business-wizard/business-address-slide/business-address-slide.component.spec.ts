import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { BusinessAddressSlideComponent } from './business-address-slide.component';

describe('BusinessAddressSlideComponent', () => {
  let component: BusinessAddressSlideComponent;
  let fixture: ComponentFixture<BusinessAddressSlideComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BusinessAddressSlideComponent],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(BusinessAddressSlideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
