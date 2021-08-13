export const setStream = (videoEl: HTMLVideoElement, stream: any, isSelf = false) => {
  if ('srcObject' in videoEl) {
    videoEl.srcObject = stream;
  } else {
    videoEl.src = window.URL.createObjectURL(stream); // for older browsers
  }
  if (isSelf) videoEl.muted = true;
}
