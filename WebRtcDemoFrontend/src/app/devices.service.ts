import { Injectable } from '@angular/core';
import {IDevicesModel, IDevicesModelShort} from "./models/i-devices-model";

@Injectable({
  providedIn: 'root'
})
export class DevicesService {
  devices = {} as IDevicesModel;

  constructor() {
    this.resolveFromStorage();
    this.resolveFromActualList();
  }

  private resolveFromStorage(): void {
    const devicesStr = localStorage.getItem('devices');
    if (devicesStr) {
      const devices = JSON.parse(devicesStr) as IDevicesModel;
      this.devices = devices;
      console.log(devices);
    }
  }

  resolveFromActualList(): void {
    try {
      navigator.mediaDevices.enumerateDevices().then(devices => {
        this.devices = this.getDevicesFullData(devices);
      });
    } catch (ex) {
      console.log(ex);
    }
  }

  getDevicesFullData(devices: MediaDeviceInfo[]): IDevicesModel {
    const data = {
      videoInputs: devices.filter(x => x.kind === 'videoinput'),
      audioInputs: devices.filter(x => x.kind === 'audioinput'),
      audioOutputs: devices.filter(x => x.kind === 'audiooutput'),
      videoInput: '',
      audioOutput: '',
      audioInput: ''
    } as IDevicesModel;

    console.log(this.devices.audioInput);

    data.audioInput = data.audioInputs.find(x => x.deviceId == this.devices.audioInput)?.deviceId ||
      data.audioInputs.find(x => x.deviceId === 'default')?.deviceId ||
      data.audioInputs[0]?.deviceId;
    data.videoInput = data.videoInputs.find(x => x.deviceId == this.devices.videoInput)?.deviceId ||
      data.videoInputs.find(x => x.deviceId === 'default')?.deviceId ||
      data.videoInputs[0]?.deviceId;
    data.audioOutput = data.audioOutputs.find(x => x.deviceId === this.devices.audioOutput)?.deviceId ||
      data.audioOutputs.find(x => x.deviceId === 'default')?.deviceId ||
      data.audioOutputs[0]?.deviceId;

    return data;
  }
}
