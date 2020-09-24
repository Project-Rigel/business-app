import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { AgendaTimeSelectorComponent } from './agenda-time-selector.component';

describe('AgendaTimeSelectorComponent', () => {
  let component: AgendaTimeSelectorComponent;
  let fixture: ComponentFixture<AgendaTimeSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AgendaTimeSelectorComponent],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(AgendaTimeSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
