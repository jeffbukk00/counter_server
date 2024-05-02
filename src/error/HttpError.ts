export class HttpError extends Error {
  constructor(public status: number, public errorResponse: any) {
    super();
  }
}
