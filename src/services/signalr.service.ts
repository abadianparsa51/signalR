import { Injectable } from '@angular/core';
import * as signalR from "@microsoft/signalr"
import { ChartsModel } from '../app/_interface/chartModel.model';

@Injectable({
  providedIn: 'root'
})
export class SignalrService {
  public data: ChartsModel[] | undefined;
  public bradcastedData: ChartsModel[] | undefined;

  private hubConnection: signalR.HubConnection | undefined
  public startConnection = () => {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('https://localhost:5001/chart')
      .build();
    this.hubConnection
      .start()
      .then(() => console.log('Connection started'))
      .catch(err => console.log('Error while starting connection: ' + err))
  }

  public addTransferChartDataListener = () => {
    this.hubConnection!.on('transferchartdata', (data) => {
      this.data = data;
      console.log('data', data);
    });
  }

  public broadcastChartData = () => {
    const data = this.data!.map(m => {
      const temp = {
        data: m.data,
        label: m.label
      }
      return temp;
    });

    this.hubConnection!.invoke('broadcastchartdata', data)
      .catch(err => console.error(err));
  }

  public addBroadcastChartDataListener = () => {
    this.hubConnection!.on('broadcastchartdata', (data) => {
      this.bradcastedData = data;
    })
  }
}