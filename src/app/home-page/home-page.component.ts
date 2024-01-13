import {Component, HostListener, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Post, PostQueryParams} from "../shared/interfaces";
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
  posts: Post[] = []
  private readonly refreshData$ = new Subject<void>()
  amountSub: Subscription
  innerWidth: number
  amountOfSkeletons: number
  totalAmount: number
  pageSizeOptions: number[] = [8, 16, 25, 100]
  sortingParams = {
    orderByField: undefined,
    ascOrDesc: undefined,
    perPage: this.pageSizeOptions[0],
    startAt: 0,
    currentPage: 1,
    toFirstPage: false
  }
  paginator: any

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
    // this.posts$ = this.postService.getAllPosts().pipe(
    //   tap(res => console.log({res}))
    // )

    this.postService.getAmount().then(amount => {
      this.totalAmount = amount
      console.log('total amount', this.totalAmount)
    })
    // this.amountSub = this.postService.getAmount().subscribe(amount => {
    //   this.totalAmount = amount
    // })

    // this.postService.getAllPostsWithQuery(undefined, undefined, this.perPage, 0).then(res => {
    //   res.forEach(item => {
    //     this.posts.push({
    //       ...item.data() as Post,
    //       createdAt: this.postService.convertFirestoreTimestampToDate((item.data() as Post).createdAt as Timestamp),
    //       updatedAt: this.postService.convertFirestoreTimestampToDate((item.data() as Post).updatedAt as Timestamp)
    //     })
    //   })
    //   console.log('this.posts', this.posts)
    // })
    const {orderByField, ascOrDesc, perPage, startAt} = this.sortingParams
    this.getPosts(orderByField, ascOrDesc, perPage, startAt)
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
    if(e) this.sortingParams.perPage = e.pageSize
    this.refreshData$.next()
    console.log("event", e)
    this.paginator = e.paginator
    this.sortingParams.startAt = e.pageIndex * this.sortingParams.perPage

    const {orderByField, ascOrDesc, perPage, startAt} = this.sortingParams

    console.log(this.sortingParams)
    this.getPosts(orderByField, ascOrDesc, perPage, startAt)

    // this.postService.getAllPostsWithQuery(queryParams.orderByField, queryParams.ascOrDesc, queryParams.limitPosts, queryParams.start).then(res => {
    //   const posts = []
    //   res.forEach(item => {
    //     posts.push(item.data())
    //   })
    //   const shortenPosts = posts.map(item => {
    //     return {
    //       title: item.title,
    //       createdAt: this.postService.convertFirestoreTimestampToDate(item.createdAt as Timestamp)
    //     }
    //   })
    //   console.log({shortenPosts})
    // })
  }


  handleSorting($event: any) {
    console.log('Sorting event:::', $event)
    const field = Object.keys($event).filter(item => $event[item])[0]
    this.sortingParams.orderByField = field
    this.sortingParams.ascOrDesc = $event[field]
    // this.sortingParams.startAt = 0
    this.paginator.firstPage()
    this.sortingParams.toFirstPage = true
    const {orderByField, ascOrDesc, perPage, startAt} = this.sortingParams
    this.getPosts(orderByField, ascOrDesc, perPage, startAt)
    this.sortingParams.toFirstPage = false

    // this.postService.getAllPostsWithQuery(orderByField, ascOrDesc, perPage, startAt).then(res => {
    //   const posts = []
    //   res.forEach(item => {
    //     posts.push(item.data())
    //   })
    //   const shortenPosts = posts.map(item => {
    //     return {
    //       title: item.title,
    //       createdAt: this.postService.convertFirestoreTimestampToDate(item.createdAt as Timestamp)
    //     }
    //   })
    //   console.log({shortenPosts})
    // })
  }

  handleSearch($event: any) {
    console.log('Search event:::', $event)

  }

  getPosts(orderByField, ascOrDesc, perPage, start) {
    this.postService.getAllPostsWithQuery(orderByField, ascOrDesc, perPage, start).then(res => {
      this.posts = []
      res.forEach(item => {
        this.posts.push({
          ...item.data() as Post,
          createdAt: this.postService.convertFirestoreTimestampToDate((item.data() as Post).createdAt as Timestamp),
          updatedAt: this.postService.convertFirestoreTimestampToDate((item.data() as Post).updatedAt as Timestamp)
        })
      })
      console.log('this.posts', this.posts)
    })
  }

  identifyPost(index, item){
    return item.id
  };

}

