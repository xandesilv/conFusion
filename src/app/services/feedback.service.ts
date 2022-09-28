import { Injectable } from '@angular/core';
import { Feedback } from '../shared/feedback';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { baseURL } from '../shared/baseurl';
import { map, catchError } from 'rxjs/operators';
import { ProcessHTTPMsgService } from './process-httpmsg.service';


@Injectable({
  providedIn: 'root'
})
export class FeedbackService {

   constructor(private http: HttpClient,
    private processHTTPMsgService: ProcessHTTPMsgService) { }

  getFeedbacks(): Observable<Feedback[]> {
    return this.http.get<Feedback[]>(baseURL + 'feedback')
    .pipe(catchError(this.processHTTPMsgService.handleError));
  }

  getFeedback(): Observable<Feedback> {
    return this.http.get<Feedback>(baseURL + 'feedback/' )
    .pipe(catchError(this.processHTTPMsgService.handleError));
  }
  postFeedback(feedback: Feedback): Observable<Feedback> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
      return this.http.post<Feedback>(baseURL + 'feedback/', feedback, httpOptions)
      .pipe(catchError(this.processHTTPMsgService.handleError));
    }

    getFeaturedFeedback(): Observable<Feedback> {
      return this.http.get<Feedback[]>(baseURL + 'feedback?featured=true').pipe(map(feedback => feedback[0]))
      .pipe(catchError(this.processHTTPMsgService.handleError));
  }








}
