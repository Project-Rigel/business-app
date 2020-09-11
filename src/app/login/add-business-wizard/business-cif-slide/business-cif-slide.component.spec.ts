import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { BusinessCifSlideComponent } from './business-cif-slide.component';

describe('BusinessCifSlideComponent', () => {
  let component: BusinessCifSlideComponent;
  let fixture: ComponentFixture<BusinessCifSlideComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BusinessCifSlideComponent],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(BusinessCifSlideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
