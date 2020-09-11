import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { BusinessNameSlideComponent } from './business-name-slide.component';

describe('BusinessNameSlideComponent', () => {
  let component: BusinessNameSlideComponent;
  let fixture: ComponentFixture<BusinessNameSlideComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BusinessNameSlideComponent],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(BusinessNameSlideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
