import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-add-agenda-config',
  templateUrl: './add-agenda-config.page.html',
  styleUrls: ['./add-agenda-config.page.scss'],
})
export class AddAgendaConfigPage implements OnInit {

  segmentValue: string = AddAgendaConfigPage.DAY_OF_WEEK_SEGMENT_VALUE;

  static DAY_OF_WEEK_SEGMENT_VALUE = 'dayOfWeek';
  static SPECIFIC_DATE_SEGMENT_VALUE = 'specificDate';

  constructor() { }

  ngOnInit() {
  }

  addSettingAgendaSetting() {}

  segmentChanged($event: any) {
    this.segmentValue = $event.detail.value;
    console.log($event.detail.value);
  }

}
