import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { AgendaNotificationsComponent } from './agenda-notifications.component';

describe('AgendaNotificationsComponent', () => {
  let component: AgendaNotificationsComponent;
  let fixture: ComponentFixture<AgendaNotificationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AgendaNotificationsComponent],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(AgendaNotificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
