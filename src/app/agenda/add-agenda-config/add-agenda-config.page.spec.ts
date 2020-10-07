import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddAgendaConfigPage } from './add-agenda-config.page';

describe('AddAgendaConfigPage', () => {
  let component: AddAgendaConfigPage;
  let fixture: ComponentFixture<AddAgendaConfigPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddAgendaConfigPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AddAgendaConfigPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
