import {Component, HostListener, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Post} from "../shared/interfaces";
import {WindowService} from "../shared/services/window.service";
import {Observable, repeat, startWith, Subject, Subscription, switchMap} from "rxjs";
import {PostService} from "../shared/services/post.service";
import {PaginatorComponent} from "../shared/components/paginator/paginator.component"

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent implements OnInit, OnDestroy{
  public posts$: Observable<Post[]>
  private readonly refreshData$ = new Subject<void>()
  amountSub: Subscription
  innerWidth: number
  amountOfSkeletons: number
  totalAmount: number = 58
  pageSizeOptions: number[] = [5, 10, 25, 100]
  perPage: number = this.pageSizeOptions[0];

  constructor(
    private windowService: WindowService,
    private postService: PostService
  ) {
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerWidth = event.target.innerWidth
    this.calculateSkeletons(this.innerWidth)
  }

  ngOnInit(): void {
    this.innerWidth = this.windowService.windowRef.innerWidth
    this.calculateSkeletons(this.innerWidth)
    // this.posts$ = this.postService.getAll(this.perPage)
    this.posts$ = this.refreshData$.pipe(
      startWith(undefined),
      switchMap(() => this.postService.getAll(this.perPage))
    )
    this.amountSub = this.postService.getAmount().subscribe(amount => {
      this.totalAmount = amount
    })
  }

  ngOnDestroy(): void {
    this.amountSub.unsubscribe()
    this.refreshData$.complete()
  }

  calculateSkeletons(width: number): void {
    if(this.innerWidth < 569){
      this.amountOfSkeletons = 2
    } else if (this.innerWidth < 784){
      this.amountOfSkeletons = 4
    } else if (this.innerWidth < 1056){
      this.amountOfSkeletons = 6
    } else {
      this.amountOfSkeletons = 8
    }
  }

  handlePage(e) {
    this.perPage = e.pageSize
    this.refreshData$.next()
    console.log("event", e.pageSize)
  }


}
