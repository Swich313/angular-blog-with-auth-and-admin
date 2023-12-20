import {Component, OnInit} from '@angular/core';
import {PostService} from "../shared/services/post.service";
import {map, Observable, Subscription, switchMap, take, tap} from "rxjs";
import {Post, UserInfo} from "../shared/interfaces";
import {ActivatedRoute, Params} from "@angular/router";
import {WindowService} from "../shared/services/window.service";
import {environment} from "../environments/environment";
import {UserService} from "../user/profile/shared/services/user.service";
import {Timestamp} from "@angular/fire/firestore";
import {DocumentData, QuerySnapshot} from "@angular/fire/compat/firestore";

@Component({
  selector: 'app-post-page',
  templateUrl: './post-page.component.html',
  styleUrls: ['./post-page.component.scss']
})
export class PostPageComponent implements OnInit{
  post$: Observable<Post>
  userInfo: UserInfo
  user$: Observable<UserInfo>
  userInfoSub: Subscription
  isLoading = false

  private window: Window
  private document: Document
  public scrollY: number
  public defaultAvatar = environment.defaultAvatarUrl

  constructor(
    private postService: PostService,
    private route: ActivatedRoute,
    private windowService: WindowService,
    private userService: UserService
  ) {

  }

  ngOnInit(): void {
    this.isLoading = true
    this.post$ = this.route.params
      .pipe(
        switchMap((params: Params) => {
        return this.postService.getPostById(params['id'])
          .pipe(map((post) => {
            this.userService.getUserInfoById(post.userId)
              .then(res => {
                res.forEach(item => {
                  this.userInfo = item.data() as UserInfo
                })
              })
            return {
              ...post,
              createdAt: this.postService.convertFirestoreTimestampToDate(post.createdAt as Timestamp),
              updatedAt: this.postService.convertFirestoreTimestampToDate(post.updatedAt as Timestamp)
            }
          }))
      })
      )

    this.document = this.windowService.documentRef
    this.window = this.windowService.windowRef
  }

  scrollToTop (){
    this.scrollY = this.document?.body?.scrollTop || this.document?.documentElement?.scrollTop
    if(this.scrollY > 0) {
      // this.window.requestAnimationFrame(this.scrollToTop)
      this.window.scrollTo({top: 0, behavior: 'smooth'})
    }
  }


}
