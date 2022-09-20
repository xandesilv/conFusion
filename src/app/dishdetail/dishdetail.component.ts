import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Dish } from '../shared/dish';
import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { DishService } from '../services/dish.service';
import { switchMap } from 'rxjs/operators';
import { Feedback, ContactType } from '../shared/feedback';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { validateBasis } from '@angular/flex-layout';
import { Comment } from '@angular/compiler';

@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss']
})
export class DishdetailComponent implements OnInit {
    dish: Dish;
    dishIds: string[];
    prev: string;
    next: string;
    feedbackForm: FormGroup;
    feedback: Feedback;
    contactType = ContactType;

    commentForm: FormGroup;
    comment: Comment;

    @ViewChild('fform') commentFormDirective;

    formErrors = {
      'name': '',
      'comment': '',
      
      
    };

    validationMessages = {
        'name': {
        'required':      'Name is required.',
        'minlength':     'Name must be at least 2 characters long.',
        'maxlength':     'Name cannot be more than 25 characters long.'
      },

        'comment': {
        'required':      'Comment is required.',
        'maxlength':     'Your Comment cannot be more than 144 characters long.'
      },
      'rating': {
        'required':     'Rate is required'
      },
      
    };

  constructor(private dishService: DishService,
    private route: ActivatedRoute,
    private location: Location,
    private cmt: FormBuilder) {
      this.createForm();
    }

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

  createForm(): void {
    this.commentForm = this.cmt.group({
        name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)] ],
        comment: ['', [Validators.required,  Validators.maxLength(144)] ],
        
        

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

  onSubmit() {
    this.comment = this.commentForm.value;
    this.commentForm.reset({
      name: '',
      comment: '',
      
      

    });
    this.commentFormDirective.resetForm();

  }
}
