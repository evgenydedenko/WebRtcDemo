export interface IDevicesModelShort {
  videoInput: string | undefined,
  audioInput: string | undefined,
  audioOutput: string | undefined
}

export interface IDevicesModel extends IDevicesModelShort {
  videoInputs: MediaDeviceInfo[],
  audioInputs: MediaDeviceInfo[],
  audioOutputs: MediaDeviceInfo[]
}
