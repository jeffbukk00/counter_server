/*
  이 어플리케이션 내에서 사용하는 에러 객체의 형식.
*/

export class HttpError extends Error {
  constructor(public status: number, public errorResponse: any) {
    super();
  }
}
