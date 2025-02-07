import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCalendar, MatDatepickerModule } from '@angular/material/datepicker';
// import { MatDialog } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
// import { DetailConsultationModalComponent } from '@app/components/modals/consultations/detail-consultation-modal/detail-consultation-modal.component';
// import { CalendarService } from '@app/services/calendar.service';
import {
  FullCalendarComponent,
  FullCalendarModule
} from '@fullcalendar/angular';
import { CalendarOptions, EventClickArg } from '@fullcalendar/core';
import ptBrLocale from '@fullcalendar/core/locales/pt-br';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import timeGridPlugin from '@fullcalendar/timegrid';
import moment from 'moment';
import { IconDirective } from '../../shared/directives/icon.directive';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FullCalendarModule,
    MatDatepickerModule,
    MatSelectModule,
    MatButtonModule,
    IconDirective,
  ],
  templateUrl: './calendar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarComponent implements OnInit {
  @ViewChild('calendar') $calendar: FullCalendarComponent | undefined;
  @ViewChild('calendarRef') mat_calendar!: MatCalendar<Date>;
  private fb = inject(FormBuilder);
  // private calendarService = inject(CalendarService);
  // private dialog = inject(MatDialog);

  public selected = <Date | null>null;
  public mat_selected: Date = new Date();
  public full_selected: Date = new Date();
  public refresh = signal(true);

  public form = this.fb.nonNullable.group({
    viewMode: ['dayGridMonth', Validators.required],
  });

  public calendarOptions: CalendarOptions = {
    plugins: [interactionPlugin, dayGridPlugin, timeGridPlugin, listPlugin],
    initialView: 'dayGridMonth',
    locale: ptBrLocale, // Define o idioma para PT-BR
    selectable: true, // Habilita a seleção de data
    events: [],
    eventClick: (arg) => this.handleEventClick(arg),
  };

  ngOnInit() {
    this.getEvents();
  }

  getEvents() {
    // const month = this.full_selected.getMonth() + 1;
    // const year = this.full_selected.getFullYear();
    this.$calendar?.getApi().removeAllEventSources();

    // this.calendarService
    //   .getCalendarEvents(month.toString(), year.toString())
    //   .subscribe({
    //     next: (response) => {
    //       const events = this.calendarService.calendarEventsSanitazer(response);

    //       this.$calendar?.getApi().addEventSource(events);
    //       setTimeout(() => this.$calendar?.getApi().updateSize(), 500);
    //     },
    //   });
  }

  public onDateSelected(date: Date | null): void {
    const DATE = new Date(moment(date).format('YYYY-MM-DD') + 'T12:00:00'); // Corrige formato para YYYY-MM-DD

    if (!(DATE instanceof Date) || isNaN(DATE.getTime())) return; // Verifica se é uma data válida

    // console.log('Selected ->', DATE);

    this.gotoDateInFullCalendar(DATE); // Move para a data
  }

  public onDateChanged(date: MouseEvent) {
    const DATE = new Date(moment(date).format('YYYY-MM-DD') + 'T12:00:00'); // Corrige formato para YYYY-MM-DD

    if (!(DATE instanceof Date) || isNaN(DATE.getTime())) return; // Verifica se é uma data válida

    // console.log('Changed ->', DATE);

    this.gotoDateInFullCalendar(DATE); // Move para a data
  }

  public gotoDateInFullCalendar(date: Date) {
    if (!this.$calendar) return;

    this.full_selected = new Date(date); // Atualiza a data do cabeçalho, se necessário

    const calendarApi = this.$calendar.getApi();
    calendarApi.gotoDate(date); // Passa um objeto Date válido

    setTimeout(() => this.$calendar?.getApi().updateSize(), 500);
  }

  public handleEventClick(arg: EventClickArg) {
    console.log(arg)
    // this.dialog.open(DetailConsultationModalComponent, {
    //   data: arg.event._def.extendedProps,
    // });
  }

  public viewToday() {
    if (!this.$calendar) return;
    const calendar = this.$calendar.getApi();
    calendar.today();
    this.refresh.set(false);

    this.selected = new Date(); // Redefine para hoje após um pequeno delay
    this.full_selected = new Date(); // Atualiza a data do cabeçalho, se necessário

    if (this.mat_calendar) {
      this.mat_calendar.selected = new Date();
      this.mat_calendar.updateTodaysDate(); // Força a atualização da UI do mat-calendar
    }

    this.setDate();
  }

  public setViewCalendar(newView?: string) {
    if (!newView) return;

    if (!this.$calendar) return;
    const calendar = this.$calendar.getApi();
    calendar.changeView(newView);
  }

  public monthChange(dir: 'previous' | 'next') {
    if (!this.$calendar) return;
    const calendar = this.$calendar.getApi();
    dir === 'next' ? calendar.next() : calendar.prev();
    const button: HTMLElement | null = document.querySelector(
      `.mat-calendar-${dir}-button`
    );

    button?.click();
    this.setDate();
  }

  public setDate() {
    const date = this.$calendar?.getApi().getDate();
    if (!date) return;
    this.mat_selected = date;
    this.full_selected = date;

    setTimeout(() => {
      this.refresh.set(true);
    }, 10);

    this.getEvents();
  }
}
