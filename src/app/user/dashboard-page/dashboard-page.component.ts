import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from "rxjs";
import {AlertService} from "../shared/services/alert.service";
import {Post} from "../../shared/interfaces";
import {PostService} from "../../shared/services/post.service";

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss']
})
export class DashboardPageComponent implements OnInit, OnDestroy{
  public posts: Post[] = []
  private postSub: Subscription

  constructor(
    private alertService: AlertService,
    private postService: PostService
  ) {
  }

  ngOnInit(): void {
    this.postSub = this.postService.getAll().subscribe(posts => {
      this.posts = posts
    })
  }

  ngOnDestroy(): void {
    if(this.postSub) this.postSub.unsubscribe()
  }

}
