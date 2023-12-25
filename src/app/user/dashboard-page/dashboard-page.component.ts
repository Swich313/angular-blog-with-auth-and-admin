import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {of, Subscription} from "rxjs";
import {AlertService} from "../shared/services/alert.service";
import {Post} from "../../shared/interfaces";
import {PostService} from "../../shared/services/post.service";
import {AuthService} from "../shared/services/auth.service";
import {faCancel, faCheck} from "@fortawesome/free-solid-svg-icons";
import {DocumentData, QuerySnapshot} from "@angular/fire/compat/firestore";
import {Timestamp} from "@angular/fire/firestore";
import {MatSort, MatSortModule, Sort} from "@angular/material/sort";
import {MatTableDataSource, MatTableModule} from "@angular/material/table";
import {LiveAnnouncer} from "@angular/cdk/a11y";
import {CommonModule} from "@angular/common";
// import {DocumentData, QuerySnapshot} from "@angular/fire/compat/firestore";

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss'],
})
  export class DashboardPageComponent implements OnInit, AfterViewInit, OnDestroy{
  public posts: Post[]
  public sortedPosts: Post[]
  // public columnHeaders = ['#', 'Author', 'Title', 'When created', 'Last Updated', 'Actions']
  public displaysColumns = ['position', 'author', 'title', 'createdAt', 'updatedAt', 'actions']
  public dataSource
  // public clickedRow = new Set<Post>()

  private postSub: Subscription
  private deleteSub: Subscription
  checkIcon = faCheck
  cancelIcon = faCancel
  isAboutToDelete: {id: string, deleting: boolean}[] = []
  isLoading = false
  private userId: string


  constructor(
    private alertService: AlertService,
    private postService: PostService,
    private authService: AuthService,
    private _liveAnnouncer: LiveAnnouncer
 ) {
  }

  @ViewChild(MatSort) sort: MatSort

  ngOnInit(): void {
    this.userId = this.authService.userId
    this.loadPosts(this.userId)
    // this.postService.getAllPosts().subscribe(res => {
    //   this.posts = res
    // })
  }

  ngAfterViewInit(): void {
    console.log('dataSource', this.dataSource)
    console.log('sort', this.sort)
    // this.dataSource.sort = this.sort
  }

  ngOnDestroy(): void {
    if(this.postSub) this.postSub.unsubscribe()
    if(this.deleteSub) this.deleteSub.unsubscribe()
  }

  onDeleteBtn(id: string) {
    this.alertService.danger('Are you sure?!')
    const postToDelete = this.isAboutToDelete.find(item => item.id === id)
    postToDelete.deleting = true

    const timer = setTimeout(() => {
      clearTimeout(timer)
      postToDelete.deleting = false
    }, 5000)
  }

  remove(id: string) {
    const postToDelete = this.isAboutToDelete.find(item => item.id === id)
    if(postToDelete){
      this.postService.removePost(id).then(() => {
        // this.posts = this.posts.filter(post => post.id !== id)
        this.alertService.success('Post was deleted!')
        this.loadPosts(this.userId)
      })
    }

  }

  loadPosts(userId: string){
    this.posts = []
    this.sortedPosts = []
    this.isAboutToDelete = []

    this.isLoading = true
    this.postService.getAllPostsByAuthorId(userId).then(res => {
      if(res.empty){
        this.isLoading = false
        this.posts = []
      } else {
        this.isLoading = false
        res.forEach(item => {
          const post = item.data() as Post
          this.posts.push({
            ...post,
            createdAt: this.postService.convertFirestoreTimestampToDate(post.createdAt as Timestamp),
            updatedAt: this.postService.convertFirestoreTimestampToDate(post.updatedAt as Timestamp),
          })
          this.isAboutToDelete.push({id: post.id, deleting: false})
        })
        this.sortedPosts = this.posts.slice()
        this.dataSource = new MatTableDataSource(this.posts)
      }
    })
      .catch(err => {
        console.log({err})
      })
  }

  // sortData(sort: Sort) {
  //   console.log({sort})
  //   const data = this.posts.slice()
  //   if(!sort.active || sort.direction === ''){
  //     this.sortedPosts = data
  //     return
  //   }
  //   console.log("from sortData method", this.sortedPosts)
  // }


  announceSortChange(sortState: Sort) {
    this.dataSource.sort = this.sort
    if(sortState.direction){
      this._liveAnnouncer.announce(`Sorted ${sortState.direction} ending`)
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }

  }
}
