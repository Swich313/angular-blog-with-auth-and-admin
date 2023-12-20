import {Component, OnDestroy, OnInit} from '@angular/core';
import {of, Subscription} from "rxjs";
import {AlertService} from "../shared/services/alert.service";
import {Post} from "../../shared/interfaces";
import {PostService} from "../../shared/services/post.service";
import {AuthService} from "../shared/services/auth.service";
import {faCancel, faCheck} from "@fortawesome/free-solid-svg-icons";
import {DocumentData, QuerySnapshot} from "@angular/fire/compat/firestore";
import {Timestamp} from "@angular/fire/firestore";
// import {DocumentData, QuerySnapshot} from "@angular/fire/compat/firestore";

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss']
})
  export class DashboardPageComponent implements OnInit, OnDestroy{
  public posts: Post[] = []
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
    private authService: AuthService
 ) {
  }

  ngOnInit(): void {
    this.userId = this.authService.userId
    this.loadPosts(this.userId)
    // this.postService.getAllPosts().subscribe(res => {
    //   this.posts = res
    // })
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
      }
    })
      .catch(err => {
        console.log({err})
      })
  }
}
