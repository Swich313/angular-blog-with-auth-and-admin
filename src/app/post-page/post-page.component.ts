import {Component, OnInit} from '@angular/core';
import {PostService} from "../shared/services/post.service";
import {Observable, switchMap} from "rxjs";
import {Post} from "../shared/interfaces";
import {ActivatedRoute, Params} from "@angular/router";
import {WindowService} from "../shared/services/window.service";

@Component({
  selector: 'app-post-page',
  templateUrl: './post-page.component.html',
  styleUrls: ['./post-page.component.scss']
})
export class PostPageComponent implements OnInit{
  post$: Observable<Post>
  private window: Window
  private document: Document
  public scrollY: number

  constructor(
    private postService: PostService,
    private route: ActivatedRoute,
    private windowService: WindowService
  ) {

  }

  ngOnInit(): void {
    this.post$ = this.route.params
      .pipe(switchMap((params: Params) => {
        return this.postService.getById(params['id'])
      }))
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
