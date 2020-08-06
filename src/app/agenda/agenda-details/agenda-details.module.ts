import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ComponentsModule } from '../../components/components.module';
import { AgendaDetailsPageRoutingModule } from './agenda-details-routing.module';
import { AgendaDetailsPage } from './agenda-details.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AgendaDetailsPageRoutingModule,
    ComponentsModule,
  ],
  declarations: [AgendaDetailsPage],
})
export class AgendaDetailsPageModule {}
