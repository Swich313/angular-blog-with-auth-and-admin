import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild} from '@angular/core';
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {Subject} from "rxjs";

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss'],
})
export class PaginatorComponent implements OnChanges{
  showFirstLastButtons = true;
  private toFirstPage$: Subject<boolean> = new Subject<boolean>()

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

  ngOnChanges(changes: SimpleChanges): void {
    console.log("this.toFirstPage before next", this.toFirstPage)
    this.toFirstPage$.next(this.toFirstPage)
    console.log("this.toFirstPage after next", this.toFirstPage)


  }

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
    // this.onPageChange.emit(e)
    this.onPageChange.emit(paginator)
  }


  toFirst() {
    this.paginator.firstPage()
  }
}
