import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from "rxjs";
import {AlertService} from "../shared/services/alert.service";
import {Post} from "../../shared/interfaces";
import {PostService} from "../../shared/services/post.service";
import {AuthService} from "../shared/services/auth.service";
import {faCancel, faCheck} from "@fortawesome/free-solid-svg-icons";

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
  isAboutToDelete = false

  constructor(
    private alertService: AlertService,
    private postService: PostService,
    private authService: AuthService
 ) {
  }

  ngOnInit(): void {
    // this.postSub = this.postService.getAll().subscribe(posts => {
    //   this.posts = posts
    // })
    this.postSub = this.postService.getAllByAuthorID(this.authService.userId).subscribe(posts => {
      this.posts = posts
    })
  }

  ngOnDestroy(): void {
    if(this.postSub) this.postSub.unsubscribe()
    if(this.deleteSub) this.deleteSub.unsubscribe()
  }

  onDeleteBtn() {
    this.alertService.danger('Are you sure?!')
    this.isAboutToDelete = true
    const timer = setTimeout(() => {
      clearTimeout(timer)
      this.isAboutToDelete = false
    }, 5000)
  }

  remove(id: string) {
    if(this.isAboutToDelete){
      this.deleteSub = this.postService.remove(id).subscribe(() => {
        this.posts = this.posts.filter(post => post.id !== id)
        this.alertService.success('Post was deleted!')
      })
    }

  }
}
