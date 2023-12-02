import { TestBed } from '@angular/core/testing';
import{ io } from 'socket.io-client';
import { SocketioService } from './socketio.service';

describe('SocketioService', () => {
  let service: SocketioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SocketioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
