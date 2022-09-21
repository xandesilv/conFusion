//TEMPLATE AQUI ---------------
import { Component, OnInit, Input } from '@angular/core';
import { Dish } from '../shared/dish';
import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { DishService } from '../services/dish.service';
import { switchMap } from 'rxjs';
//ATÉ AQUI ---------------
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Comment } from '../shared/comment';



@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss']
})
export class DishdetailComponent implements OnInit {
    //TEMPLATE AQUI
    dish: Dish;
    dishIds: string[];
    prev: string;
    next: string;
    //ATÉ AQUI --------------------------
    @Input() btnText!: string;
    commentForm!: FormGroup;
    rating = 0;

  constructor(private dishService: DishService,
    private route: ActivatedRoute,
    private location: Location,
    private cmt: FormBuilder )
    {this.commentForm = this.cmt.group({
      author: ["", Validators.required],
      comment:["", Validators.required],
      rating:["", Validators.required]
    });

     }
// TEMPLATE COMEÇA AQUI ----------
  ngOnInit() {
    this.dishService.getDishIds().subscribe(dishIds => this.dishIds = dishIds);
      this.route.params.pipe(switchMap((params: Params) => this.dishService.getDish(params['id'])))
      .subscribe(dish => { this.dish = dish; this.setPrevNext(dish.id); });
    }
    setPrevNext(dishId: string) {
      const index = this.dishIds.indexOf(dishId);
      this.prev = this.dishIds[(this.dishIds.length + index - 1) % this.dishIds.length];
      this.next = this.dishIds[(this.dishIds.length + index + 1) % this.dishIds.length];
    }

  goBack(): void {
    this.location.back();
  }
// VAI ATÉ AQUI. NÂO MEXER DURANTE A TASK 3

onSubmit(){
  console.log('Enviando dados');
}
}
