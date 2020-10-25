import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { AgendaListPage } from './agenda-list.page';

describe('AgendaPage', () => {
  let component: AgendaListPage;
  let fixture: ComponentFixture<AgendaListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AgendaListPage],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(AgendaListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
