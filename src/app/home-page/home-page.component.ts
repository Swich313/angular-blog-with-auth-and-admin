import {Component, HostListener, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Post, PostQueryParams} from "../shared/interfaces";
import {WindowService} from "../shared/services/window.service";
import {filter, map, Observable, repeat, startWith, Subject, Subscription, switchMap, tap} from "rxjs";
import {PostService} from "../shared/services/post.service";
import {PaginatorComponent} from "../shared/components/paginator/paginator.component"
import {Timestamp} from "@angular/fire/firestore";

interface PaginationMetadata {
  perPage: number;
  startAt: number;
  totalAmount: number;
}

interface FilteredPostsResponse {
  metadata: PaginationMetadata;
  data: Post[];
}

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent implements OnInit, OnDestroy{
  public posts$: Observable<Post[]>
  public filteredPosts$: Observable<Post[]>
  searchString: string
  posts: Post[] = []
  amountSub: Subscription
  innerWidth: number
  amountOfSkeletons: number
  totalAmount: number
  totalAmountOfFiltered: number
  pageSizeOptions: number[] = [8, 16, 25, 100]
  sortingParams = {
    orderByField: undefined,
    ascOrDesc: undefined,
    perPage: this.pageSizeOptions[0],
    startAt: 0,
    currentPage: 1
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
    this.posts$ = this.postService.getAllPosts()
    // this.posts$.subscribe(console.log)

    this.postService.getAmount().then(amount => {
      this.totalAmount = amount
    })
    const {orderByField, ascOrDesc, perPage, startAt} = this.sortingParams
    this.getPosts(orderByField, ascOrDesc, perPage, startAt)
  }

  ngOnDestroy(): void {
    if(this.amountSub) this.amountSub.unsubscribe()
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

    this.paginator = e.paginator
    this.sortingParams.currentPage = e.pageIndex + 1
    this.sortingParams.startAt = e.pageIndex * this.sortingParams.perPage

    const {orderByField, ascOrDesc, perPage, startAt} = this.sortingParams

    this.getPosts(orderByField, ascOrDesc, perPage, startAt)

    if(!!this.searchString) this.filteredPosts$ = this.paginatePosts(this.posts$, this.searchString, perPage, startAt)

  }


  handleSorting($event: any) {
    console.log('Sorting event:::', $event)
    const field = Object.keys($event).filter(item => $event[item])[0]
    this.sortingParams.orderByField = field
    this.sortingParams.ascOrDesc = $event[field]
    if(this.sortingParams.currentPage > 1) this.paginator.firstPage()
    const {orderByField, ascOrDesc, perPage, startAt} = this.sortingParams
    this.getPosts(orderByField, ascOrDesc, perPage, startAt)
  }

  handleSearch($event: any) {
    //go to 1st page after starting searching
    this.sortingParams.startAt = 0
    if(this.sortingParams.currentPage > 1) this.paginator.firstPage()

    const {perPage, startAt} = this.sortingParams
    this.searchString = $event.toLowerCase()
    this.filteredPosts$ = this.paginatePosts(this.posts$, this.searchString, perPage, startAt)
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

  paginatePosts(posts: Observable<Post[]>, searchString: string, perPage: number, startAt: number): any{
    return posts.pipe(
      map((posts) => {
        const filterResult = posts.filter(post => post.title.toLowerCase().includes(searchString) ||
          post.text.toLowerCase().includes(searchString) ||
          post.author.toLowerCase().includes(searchString) ||
          post.tags.toLowerCase().includes(searchString))
        return {
          metadata: {
            perPage: perPage,
            startAt: startAt,
            totalAmount: filterResult.length,
          },
          // data: filterResult.slice(startAt, (startAt + 1) * perPage)
          data: filterResult.slice(startAt, startAt + perPage)
        }
      })
    )
  }

  identifyPost(index, item){
    return item.id
  };

}

