import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
  ViewChild,
  WritableSignal
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCalendar, MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import {
  FullCalendarComponent,
  FullCalendarModule,
} from '@fullcalendar/angular';
import { CalendarOptions, EventClickArg, EventSourceInput } from '@fullcalendar/core';
import ptBrLocale from '@fullcalendar/core/locales/pt-br';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import timeGridPlugin from '@fullcalendar/timegrid';
import moment from 'moment';
import { DetailFinanceComponent } from '../../core/components/detail-finance/detail-finance.component';
import { CONFIG_MODAL_TRANSACTION } from '../../core/constants/utils';
import { ITransaction } from '../../core/models/finance';
import { IconDirective } from '../../shared/directives/icon.directive';
import { FinanceService } from '../../shared/services/finance.service';

// Register all Community features
@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FullCalendarModule,
    MatDatepickerModule, // 🔹 Certifique-se de que está importado
    MatNativeDateModule,  // 🔹 Importação necessária para o funcionamento do calendário,
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
  private financeService = inject(FinanceService)
  readonly dialog = inject(MatDialog);

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

  public transactions: WritableSignal<ITransaction[]> = signal([])

  public ngOnInit() {
    this.getEvents();
  }

  public getEvents() {
    const month = this.full_selected.getMonth() + 1;
    const year = this.full_selected.getFullYear();
    this.$calendar?.getApi().removeAllEventSources();

    // this.loading.set(true);

    const params = {
      year: year,
      month: month,
    };

    this.financeService.getAllFinance(params).subscribe({
      next: (data) => {
        this.transactions.set(data)
        // this.loading.set(false);
      },
    });

  }

  public detailFinance(finance?: ITransaction, all = false){
      const dialogRef = this.dialog.open(DetailFinanceComponent,{
        ...CONFIG_MODAL_TRANSACTION,
        data: {
          finance,
          edit_all: all
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        if(result){
          this.getEvents();
        }
      });
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
  }

  public viewToday() {
    if (!this.$calendar) return;
    const calendar = this.$calendar.getApi();

    if(!calendar) return;

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

  public get listEvent(): EventSourceInput {
    const today = new Date(); // Data atual

    const arrayEvent = this.transactions().map((el) => {
      const expiryDate = new Date(el.expiry_date);

      let className = 'isDefault'; // Valor padrão

      if (!el.is_paid && expiryDate < today) {
        className = 'notPaid';
      } else if (el.is_paid) {
        className = 'isPaid';
      }

      return {
        title: el.description,
        start: el.expiry_date,
        end: el.expiry_date,
        classNames: className
      };
    });

    return arrayEvent;
  }

}
