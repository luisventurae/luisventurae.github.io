/** Starts a file download. The API answers with `Content-Disposition: attachment`. */
export function startDownload(url: string): void {
  window.location.assign(url)
}
