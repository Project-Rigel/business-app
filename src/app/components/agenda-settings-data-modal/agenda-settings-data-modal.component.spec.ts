import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { AgendaSettingsDataModalComponent } from './agenda-settings-data-modal.component';

describe('AgendaSettingsDataModalComponent', () => {
  let component: AgendaSettingsDataModalComponent;
  let fixture: ComponentFixture<AgendaSettingsDataModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AgendaSettingsDataModalComponent],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(AgendaSettingsDataModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
