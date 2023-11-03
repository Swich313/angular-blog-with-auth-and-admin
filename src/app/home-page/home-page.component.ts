import {Component, HostListener, OnInit} from '@angular/core';
import {Post} from "../shared/interfaces";
import {WindowService} from "../shared/services/window.service";
import {Observable} from "rxjs";
import {PostService} from "../shared/services/post.service";

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit{
  public posts$: Observable<Post[]>
  innerWidth: number
  amountOfSkeletons: number

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
    this.posts$ = this.postService.getAll()
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
}
