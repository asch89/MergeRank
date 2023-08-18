import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'mergerank';
  items: Array<string> = [];
  item1: string = '';
  item2: string = '';
  rankingStarted: boolean = false;
  rankingFinished: boolean = false;

  ngOnInit(){
  }

  addItem(item: string) {
    this.items.push(item);
    this.items = this.items.slice();
    console.log(this.items);
    (document.getElementById('itemInput') as HTMLInputElement).value = '';
  }

  async startRank() {
    this.rankingStarted = true;
    this.items = await this.mergeRank(this.items);
    console.log(this.items);
    this.rankingFinished = true;
  }

  restart() {
    this.rankingStarted = false;
    this.items = [];
    this.rankingFinished = false;
  }

  async mergeRank(items: Array<string>): Promise<any> {
    if(items.length <= 1)
      return items;

    let mid = Math.floor(items.length / 2);
    console.log('mid of ' + items.length + '/2 is' + mid);
    let left = items.slice(0, mid);
    let right = items.slice(mid);
    console.log('left is ' + left);
    console.log('right is ' + right)

    let leftSorted = await this.mergeRank(left);
    let rightSorted = await this.mergeRank(right);

    return await this.merge(leftSorted, rightSorted);
  }

  async merge(left: Array<string>, right: Array<string>)
  {
    console.log('made it to merge');
    let merged = [];
    while(left.length > 0 && right.length > 0)
    {
      if(await this.compare(left[0], right[0]))
      {
        merged.push(left[0]);
        left.shift();
      }
      else {
        merged.push(right[0]);
        right.shift();
      }
    }
    merged = merged.concat(left);
    merged = merged.concat(right);

    return merged;
  }

  async compare(item1: string, item2: string): Promise<boolean> {
    (document.activeElement as HTMLElement).blur();
    console.log('made it to compare. comparing ' + item1 + ' and ' + item2);
    return new Promise<boolean>(resolve => {
      const item1Button = document.getElementById('item1');
      const item2Button = document.getElementById('item2');
      
      if (item1Button && item2Button) {
        item1Button.addEventListener('click', () => resolve(true));
        item2Button.addEventListener('click', () => resolve(false));
        
        this.item1 = item1;
        this.item2 = item2;
      }
    });
  }
}
