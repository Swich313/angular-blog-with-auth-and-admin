import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from "@angular/router";
import {UserService} from "../user/profile/shared/services/user.service";
import {map, Observable, Subscription, switchMap, take} from "rxjs";
import {Post, UserInfo} from "../shared/interfaces";
import {PostService} from "../shared/services/post.service";

@Component({
  selector: 'app-author-info',
  templateUrl: './author-info.component.html',
  styleUrls: ['./author-info.component.scss']
})
export class AuthorInfoComponent implements OnInit, OnDestroy{
  authorInfo$: Observable<UserInfo>
  post$: Observable<Post>
  authorInfoSub: Subscription
  authorInfo: UserInfo

  constructor(private route: ActivatedRoute,
            private postService: PostService,
            private userService: UserService) { }

  ngOnInit(): void {
    // console.log(this.route.params.subscribe(p => console.log(p)))
    this.route.params.subscribe(params => {
       this.postService.getPostById(params['id'])
         .subscribe(post => {
           console.log({post})
           this.userService.getUserInfoById(post.userId)
               .then(res => {
                 res.forEach(item => {
                   this.authorInfo = item.data() as UserInfo
                   console.log(item.data())
                 })
               })
         })
        // .pipe(map(post => {
        //   console.log({post})
        //   this.userService.getUserInfoById(post.userId)
        //     .then(res => {
        //       res.forEach(item => {
        //         this.authorInfo = item.data() as UserInfo
        //         console.log(item.data())
        //       })
        //     })
        // }))
    })
      // .pipe(
      //   switchMap((params: Params) => {
      //     console.log({params})
      //     return this.postService.getPostById(params['id'])
      //       // .pipe(map((post) => {
      //       //   console.log({post})
      //       //   this.userService.getUserInfoById(post.userId)
      //       //     .then(res => {
      //       //       console.log({res})
      //       //       res.forEach(item => {
      //       //         console.log('userInfo', item.data())
      //       //         this.authorInfo = item.data() as UserInfo
      //       //         console.log("this.userInfo", this.authorInfo)
      //       //       })
      //       //     })
      //       // }))
      //   })
      // )
  }

  ngOnDestroy(): void {
  }

}
