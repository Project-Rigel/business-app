import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddAgendaPage } from './add-agenda.page';

describe('AddAgendaPage', () => {
  let component: AddAgendaPage;
  let fixture: ComponentFixture<AddAgendaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddAgendaPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AddAgendaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
