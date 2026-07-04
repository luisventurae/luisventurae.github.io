declare interface Window {
  javascriptCallback: (token: string) => void
  onTurnstileExpired: () => void
}
