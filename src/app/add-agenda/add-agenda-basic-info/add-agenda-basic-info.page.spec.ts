import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddAgendaBasicInfoPage } from './add-agenda-basic-info.page';

describe('AddAgendaBasicInfoPage', () => {
  let component: AddAgendaBasicInfoPage;
  let fixture: ComponentFixture<AddAgendaBasicInfoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddAgendaBasicInfoPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AddAgendaBasicInfoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
