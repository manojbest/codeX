import { Server } from 'http';
import { Server as SocketServer, Socket as SocketIO } from 'socket.io';
import { Logger } from './logger';
import { ReportResponse } from '../dto/response/report-response';

class Socket {
  private socket: SocketServer;
  // keep the connection register
  private registry: Map<string, SocketIO> = new Map<string, SocketIO>();

  constructor() {
    // create socket server
    this.socket = new SocketServer({
      path: '/socket',
      cors: {
        origin: true,
      },
    });

    // add listener for new connections
    this.socket.on('connection', (socket: SocketIO) => {
      Logger.info('New Socket Connection : ', socket.id);

      // register socket connection
      this.registry.set(socket.id, socket);

      // listen for disconnection
      socket.on('disconnect', () => {
        Logger.info('Socket Disconnected : ', socket.id);

        // remove socket from registry
        this.registry.delete(socket.id);
      });
    });
  }

  /**
   * Attach socket to server
   *
   * @param server - the server instance
   */
  public attach(server: Server) {
    this.socket.attach(server);
    Logger.info('Socket server attached');
  }

  /**
   * Emit socket event for given socket recipient
   *
   * @param socketId - the socket ID
   * @param payload - the event payload (ReportResponse)
   */
  public emit(socketId: string, payload: ReportResponse) {
    // check given socket ID is available on current registry
    const socketConnection = this.registry.get(socketId);
    if (socketConnection) {
      // emit the event for relevant user
      socketConnection.emit('report', payload);
    } else {
      Logger.warn('No Connection found for : ', socketId);
    }
  }
}

export const socket = new Socket();
