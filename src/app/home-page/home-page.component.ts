import {Component, HostListener, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Post} from "../shared/interfaces";
import {WindowService} from "../shared/services/window.service";
import {Observable, repeat, startWith, Subject, Subscription, switchMap, tap} from "rxjs";
import {PostService} from "../shared/services/post.service";
import {PaginatorComponent} from "../shared/components/paginator/paginator.component"
import {Timestamp} from "@angular/fire/firestore";

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent implements OnInit, OnDestroy{
  public posts$: Observable<Post[]>
  posts: Post[]
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
    this.posts$ = this.postService.getAllPosts().pipe(
      tap(res => console.log({res}))
    )

    this.postService.getAmount().then(amount => {
      this.totalAmount = amount
      console.log('total amount', this.totalAmount)
    })
    // this.amountSub = this.postService.getAmount().subscribe(amount => {
    //   this.totalAmount = amount
    // })
  }

  ngOnDestroy(): void {
    if(this.amountSub) this.amountSub.unsubscribe()
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
    if(e) this.perPage = e.pageSize
    this.refreshData$.next()
    console.log("event", e)
    const perPage = this.perPage;
    const startAt = e.pageIndex
    const orderByField = 'title'
    const ascOrDesc = 'desc'
    const queryParams = {
      orderByField: orderByField,
      ascOrDesc: ascOrDesc,
      limitPosts: perPage,
      start: startAt * perPage
    }
    console.log('queryParams', ...Object.values(queryParams))
    // console.log('queryParams', ...queryParams)
    this.postService.getAllPostsWithQuery(orderByField, ascOrDesc, perPage, 0).then(res => {
      const posts = []
      res.forEach(item => {
        posts.push(item.data())
      })
      const shortenPosts = posts.map(item => {
        return {
          title: item.title,
          createdAt: this.postService.convertFirestoreTimestampToDate(item.createdAt as Timestamp)
        }
      })
      console.log({shortenPosts})
    })
  }


}
