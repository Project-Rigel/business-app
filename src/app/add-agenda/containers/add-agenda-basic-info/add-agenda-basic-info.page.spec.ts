import { FormBuilder, Validators } from '@angular/forms';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { PickerController } from '@ionic/angular';
import { render, screen } from '@testing-library/angular';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { of } from 'rxjs';
import { UserState } from '../../../core/user/user.state';
import { AddAgendaBasicInfoPage } from './add-agenda-basic-info.page';

describe('Add Agenda Basic Info Container', () => {
  test('should have the name field working correctly', async () => {
    let form = new FormBuilder().group({
      name: ['', [Validators.required]],
    });

    await render(AddAgendaBasicInfoPage, {
      componentProperties: {
        form: form,
      },
      providers: [
        ImagePicker,
        PickerController,
        { provide: UserState, useValue: { isCordova$: () => of(false) } },
      ],
    });

    const nameControl = screen.getByText(/name/i);
    expect(nameControl).toBeInTheDocument();
    userEvent.type(nameControl, 'Name');
    expect(nameControl.textContent).toEqual('Name');

    const intervalsControl = screen.getByLabelText(/interval selection/i);
    userEvent.click(intervalsControl);
  });
});
