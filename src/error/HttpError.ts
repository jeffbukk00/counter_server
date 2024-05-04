// 이 어플리케이션 내에서 throw할 error의 형식을 사용자 지정.

export class HttpError extends Error {
  constructor(public status: number, public errorResponse: any) {
    super();
  }
}
