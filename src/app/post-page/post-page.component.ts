import {Component, OnInit} from '@angular/core';
import {PostService} from "../shared/services/post.service";
import {map, Observable, Subscription, switchMap, take, tap} from "rxjs";
import {Post, UserInfo} from "../shared/interfaces";
import {ActivatedRoute, Params} from "@angular/router";
import {WindowService} from "../shared/services/window.service";
import {environment} from "../environments/environment";
import {UserService} from "../user/profile/shared/services/user.service";

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
    this.post$ = this.route.params
      .pipe(
        switchMap((params: Params) => {
        return this.postService.getById(params['id'])
      })
      )
    this.userInfoSub = this.post$.subscribe(post => {
      this.user$ = this.userService.getUserInfoById(post.userId)
        // .pipe(
        //   tap(x => console.log(x))
        // )

        // .pipe(
        //   map(res => {
        //     this.userInfo = res
        //     console.log({res})
        //     return res
        //   })
        // )
    })

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
