import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { CustomerElementComponent } from './customer-element.component';

describe('CustomerElementComponent', () => {
  let component: CustomerElementComponent;
  let fixture: ComponentFixture<CustomerElementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CustomerElementComponent],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(CustomerElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
