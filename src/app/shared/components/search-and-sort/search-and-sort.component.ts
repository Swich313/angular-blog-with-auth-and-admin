import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, WritableSignal} from '@angular/core';
import {faArrowDown19, faArrowDownAZ, faArrowUp91, faArrowUpAZ} from "@fortawesome/free-solid-svg-icons";
import {BehaviorSubject, switchMap} from "rxjs";

type SortingStateType = 'asc' | 'desc' | null;

@Component({
  selector: 'app-search-and-sort',
  templateUrl: './search-and-sort.component.html',
  styleUrls: ['./search-and-sort.component.scss']
})
export class SearchAndSortComponent implements OnInit, OnChanges{
  readonly arrowUpIconAZ = faArrowUpAZ
  readonly arrowDownIconAZ = faArrowDownAZ
  readonly arrowUpIcon19 = faArrowUp91
  readonly arrowDownIcon19 = faArrowDown19

  readonly sortingStates: SortingStateType[] = ['asc', 'desc', null];
  currentSortingStates: {author: SortingStateType, title: SortingStateType, createdAt: SortingStateType} = {author: null, title: null, createdAt: null}
  search: string

  @Input()
  disabled: false

  @Output()
  sortingState = new EventEmitter()

  @Output()
  searchString = new EventEmitter()
  // @Input({transform: signalInput<string | undefined>()})
  // searchString: WritableSignal<string | undefined>

  ngOnInit(): void {
    this.currentSortingStates = {author: this.sortingStates[2], title: this.sortingStates[2], createdAt: this.sortingStates[2]}
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.disabled = changes['disabled'].currentValue
  }

  onSortChange(sortingField: string) {
    // if authorSortingState/createdAtSortingState/titleSortingState = null (sortingStates[2])
    // then it should be switched to 'asc' (sortingStates[0])

    // if (!this[`${sortingField}SortingState`]) {
    if(!this.currentSortingStates[sortingField]){
      this.currentSortingStates[sortingField] = this.sortingStates[0]
    }
    // if authorSortingState/createdAtSortingState/titleSortingState = 'asc' (sortingStates[0])
    // then it should be switched to 'desc' (sortingStates[1])
    else if (this.currentSortingStates[sortingField] === 'asc') {
      this.currentSortingStates[sortingField] = this.sortingStates[1]

    }
      // if authorSortingState/createdAtSortingState/titleSortingState = 'desc' (sortingStates[1])
    // then it should be switched to 'null' (sortingStates[2])
    else {
      this.currentSortingStates[sortingField] = this.sortingStates[2]
    }
    // this.currentSortingStates = {author: this.authorSortingState, title: this.titleSortingState, createdAt: this.createdAtSortingState}

    //resetting other fields of currentSortingStates object except one we are working with (sortingField)
    const otherSortingFields = Object.keys(this.currentSortingStates).filter(item => item !== sortingField)
    otherSortingFields.forEach(item => this.currentSortingStates[item] = null)

    this.sortingState.emit(this.currentSortingStates)
  }

  searchHandler($event: any) {
    this.searchString.emit($event)
  }
}
