import { throwError } from 'rxjs';

export abstract class BaseService {

  constructor() { }

  protected handleError(err: any) {

    if (err.headers) {
      const applicationError = err.headers.get('Application-Error');

      // either application-error in header or model error in body
      if (applicationError) {
        return throwError(applicationError);
      }
    }

    let errorMessage: string | null = '';
    if (err.error && err.error.length > 0) {
      const arr = err.error;
      arr.forEach((element: any) => {
        for (const description in element) {
          if (element.hasOwnProperty(description) && element[description] !== null) {
            errorMessage += element[description] + '\n';
          }
        }
      });

      errorMessage = errorMessage === '' ? null : errorMessage;
    }
    // else if (err.error instanceof ErrorEvent) {
      // client-side error
    else if (err.error) {
      errorMessage = `${err.error.message}`;
    } else {
      // server-side error
      errorMessage = `Error Code: ${err.status}\r\nMessage: ${err.message}`;
    }


    let modelStateErrors: string | null = '';
    // for now just concatenate the error descriptions
    for (const key in err.error) {
      if (err.error[key]) { modelStateErrors += err.error[key].description + '\n'; }
    }

    modelStateErrors = modelStateErrors === '' ? null : modelStateErrors;
    return throwError(errorMessage || modelStateErrors || 'Server error');
  }
}
