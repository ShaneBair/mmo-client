export interface SocketRequest {
  data: any;
}

export interface SocketResponse {
  data: any;
}

export default interface SocketSupport {
  SocketRequest: SocketRequest;
  SocketResponse: SocketResponse;
}
