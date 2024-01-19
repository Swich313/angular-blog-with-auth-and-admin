import {Component, EventEmitter, Input, OnChanges, Output, ViewChild} from '@angular/core';
import {MatPaginator, PageEvent} from "@angular/material/paginator";

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss'],
})
export class PaginatorComponent {
  showFirstLastButtons = true;

  @ViewChild(MatPaginator)
  paginator: MatPaginator

  @Input()
  toFirstPage?: boolean

  @Input()
  totalAmount: number

  @Input()
  perPage: number

  @Input()
  pageSizeOptions: number[]

  @Output()
  onPageChange = new EventEmitter()

  handlePageEvent(e: PageEvent) {
    const length = e.length;
    const pageSize = e.pageSize;
    const pageIndex = e.pageIndex;
    console.log({e}, {length}, {pageSize}, {pageIndex})
    const paginator = {
      length,
      pageSize,
      pageIndex,
      paginator: this.paginator
    }
    this.onPageChange.emit(paginator)
  }

}
