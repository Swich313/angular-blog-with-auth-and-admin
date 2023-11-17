import {Component, EventEmitter, Input, Output} from '@angular/core';
import {PageEvent} from "@angular/material/paginator";

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss'],
})
export class PaginatorComponent {
  pageEvent: PageEvent;
  showFirstLastButtons = true;

  @Input()
  totalAmount: number

  @Input()
  perPage: number

  @Input()
  pageSizeOptions: number[]

  @Output()
  onPageChange = new EventEmitter()

  handlePageEvent(e: PageEvent) {
    this.pageEvent = e;
    const length = e.length;
    const pageSize = e.pageSize;
    const pageIndex = e.pageIndex;
    console.log({e}, {length}, {pageSize}, {pageIndex})

    this.onPageChange.emit(e)


  }
}
