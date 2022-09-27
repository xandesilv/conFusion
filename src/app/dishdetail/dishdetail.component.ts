//TEMPLATE AQUI ---------------
import { Component, OnInit,  ViewChild, Inject } from '@angular/core';
import { Dish } from '../shared/dish';
import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { DishService } from '../services/dish.service';
import { switchMap } from 'rxjs';
//ATÉ AQUI ---------------
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Comment } from '../shared/comment';
import { trigger, state, style, animate, transition } from '@angular/animations'


@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss'],
  animations: [
    trigger('visibility', [
        state('shown', style({
            transform: 'scale(1.0)',
            opacity: 1
        })),
        state('hidden', style({
            transform: 'scale(0.5)',
            opacity: 0
        })),
        transition('* => *', animate('0.3s ease-in-out'))
    ])
  ]

})
export class DishdetailComponent implements OnInit {
    //TEMPLATE AQUI
    dish: Dish;
    errMess: string;
    dishIds: string[];
    prev: string;
    next: string;
    //ATÉ AQUI --------------------------

    commentForm: FormGroup;
    comment: Comment;
    rating = 0;
    @ViewChild('cform') commentFormDirective;
    dishcopy: Dish;
    visibility = 'shown';

    formErrors = {
      'author': '',
      'comment': '',

    };
    validationMessages = {
      'author': {
      'required':      'Name is required.',
      'minlength':     'Name must be at least 2 characters long.',
    },

      'comment': {
      'required':      'Comment is required.',
      'maxlength':     'Your Comment cannot be more than 144 characters long.'
    },


  };

  constructor(private dishService: DishService,
    private route: ActivatedRoute,
    private location: Location,
    private cmt: FormBuilder,
    @Inject('BaseURL') public BaseURL) { }
// TEMPLATE COMEÇA AQUI ----------
  ngOnInit()  {
    this.createForm();

    this.dishService.getDishIds().subscribe(dishIds => this.dishIds = dishIds);
      this.route.params
      .pipe(switchMap((params: Params) => { this.visibility = 'hidden'; return this.dishService.getDish(params['id']); }))
      .subscribe(dish => { this.dish = dish; this.dishcopy = dish ;this.setPrevNext(dish.id); this.visibility = 'shown'; },
      errmess => this.errMess = <any>errmess );

    }
    setPrevNext(dishId: string) {
      const index = this.dishIds.indexOf(dishId);
      this.prev = this.dishIds[(this.dishIds.length + index - 1) % this.dishIds.length];
      this.next = this.dishIds[(this.dishIds.length + index + 1) % this.dishIds.length];
    }


    createForm(): void {
      this.commentForm = this.cmt.group({
        author: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)] ],
        comment: ['', [Validators.required,  Validators.maxLength(144)] ],
        rating: 3,


      });
      this.commentForm.valueChanges
      .subscribe(data => this.onValueChanged(data));

      this.onValueChanged();
    }
    onValueChanged(data?: any) {
      if (!this.commentForm) { return; }
      const form = this.commentForm;
      for (const field in this.formErrors) {
        if (this.formErrors.hasOwnProperty(field)) {
          // clear previous error message (if any)
          this.formErrors[field] = '';
          const control = form.get(field);
          if (control && control.dirty && !control.valid) {
            const messages = this.validationMessages[field];
            for (const key in control.errors) {
              if (control.errors.hasOwnProperty(key)) {
                this.formErrors[field] += messages[key] + ' ';
              }
            }
          }
        }
      }
    }
  goBack(): void {
    this.location.back();
  }
// VAI ATÉ AQUI. NÂO MEXER DURANTE A TASK 3



onSubmit(){
  this.comment = this.commentForm.value;
  this.comment.date = new Date().toISOString();
  console.log(this.comment);
  this.dishcopy.comments.push(this.comment);
  this.dishService.putDish(this.dishcopy)
  .subscribe(dish => {
    this.dish = dish; this.dishcopy = dish;
  },
  errmess => { this.dish = null!; this.dishcopy = null!; this.errMess = <any>errmess;}
  );
  this.commentForm.reset({
    author: '',
    rating: 3,
    comment: '',
  });
  this.commentFormDirective.resetForm();
}
}
