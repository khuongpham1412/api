export class HttpResponse {
  public message: string;
  public statusCode: number;
  public data: any;

  constructor(props: { message?: string; statusCode?: number; data?: any }) {
    const { data, message, statusCode } = props;
    this.message = message || 'Success!';
    this.statusCode = statusCode || 200;
    this.data = data || null;
  }
}
