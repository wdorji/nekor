export interface Store {
  devel: boolean,
  startAudio?: any,
  completeAudio?: any,
  doesLastRunPass: boolean,
  reset(): void
}

export const store: Store = {
  devel: false,
  doesLastRunPass: false,
  reset() {
    store.completeAudio = undefined,
    store.doesLastRunPass = false,
    store.startAudio = undefined
  }
}
