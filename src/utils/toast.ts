// toast style
const style = document.createElement('style')
style.innerHTML = `
  #fn-toast-overlay {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: 9998;
    display: none;
  }
  #fn-loading-toast {
    display: none;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 9999;
  }

  .fn-loading-spinner {
    border-radius: 8px;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
  }

  #fn-spinner {
    border: 4px solid rgba(0, 0, 0, 0.1);
    border-left-color: #fff;
    border-radius: 50%;
    margin: 30px;
    width: 20px;
    height: 20px;
    animation: fn-spin 1s linear infinite;
  }

  #fn-toast-text {
    padding: 10px 16px;
  }

  @keyframes fn-spin {
    to {
      transform: rotate(360deg);
    }
  }`
// toast el
const container = document.createElement('div')
container.setAttribute('id', 'fn-loading-toast')
container.innerHTML = `
  <div class="fn-loading-spinner">
    <div id="fn-spinner"></div>
    <div id="fn-toast-text"></div>
  </div>`
const overlay = document.createElement('div')
overlay.style.setProperty('id', 'fn-toast-overlay')
// items
let toast: HTMLElement
let spinner: HTMLElement
let textEl: HTMLElement
// init
export function initToast() {
  console.warn('initToast ------------')
  const head = document.getElementsByTagName('head').item(0)
  console.log(head, 'head')
  if (head) {
    head.appendChild(style)
  }
  console.log('initToast')
  document.body.appendChild(container)
  document.body.appendChild(overlay)
  toast = container
  spinner = document.getElementById('fn-spinner') as HTMLElement
  textEl = document.getElementById('fn-toast-text') as HTMLElement
}

export const Toast = {
  loading() {
    if (toast && overlay && spinner && textEl) {
      toast.style.display = 'block'
      overlay.style.display = 'block'
      spinner.style.display = 'block'
      textEl.style.display = 'none'
    }
  },
  info(text: string, duration: number = 2000) {
    console.log(text, 'text', toast && overlay && spinner)
    if (toast && overlay && spinner) {
      toast.style.display = 'block'
      // overlay.style.display = 'block'
      spinner.style.display = 'none'
    }
    if (text && textEl) {
      textEl.style.display = 'block'
      textEl.textContent = text
    }
    setTimeout(() => {
      Toast.close()
    }, duration)
  },
  close() {
    if (toast && overlay && textEl) {
      toast.style.display = 'none'
      overlay.style.display = 'none'
      textEl.style.display = 'none'
    }
  },
}
