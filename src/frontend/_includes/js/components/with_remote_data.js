const { initComponent, setContent } = Components
const { html, css } = Utils
const { identity } = R

const WithRemoteData = (resultAsyncOrPromise, component) => initComponent({
  content: ({ id, include }) => html`
    <div id="${id}">${include(Loader())}</div>
  `,
  initializer: ({ id }) => {
    const remoteData =
      resultAsyncOrPromise instanceof NT.ResultAsync
        ? resultAsyncOrPromise.match(identity, identity)
        : resultAsyncOrPromise
    
    remoteData
      .then((data) => setContent(`#${id}`, component(data)))
      .catch((err) => setContent(`#${id}`, `${err}`))
  }
})

Components.WithRemoteData = WithRemoteData

///////////////////////////////////////////////////////////////////////////////

const Loader = () => initComponent({
  content: () => html`
    <div class="lds-facebook"><div></div><div></div><div></div></div>
  `,
  style: () => css`
    .lds-facebook {
      display: inline-block;
      position: relative;
      width: 80px;
      height: 80px;
    }
    .lds-facebook div {
      display: inline-block;
      position: absolute;
      left: 8px;
      width: 16px;
      background: #ddd;
      animation: lds-facebook 1.2s cubic-bezier(0, 0.5, 0.5, 1) infinite;
    }
    .lds-facebook div:nth-child(1) {
      left: 8px;
      animation-delay: -0.24s;
    }
    .lds-facebook div:nth-child(2) {
      left: 32px;
      animation-delay: -0.12s;
    }
    .lds-facebook div:nth-child(3) {
      left: 56px;
      animation-delay: 0;
    }
    @keyframes lds-facebook {
      0% {
        top: 8px;
        height: 64px;
      }
      50%, 100% {
        top: 24px;
        height: 32px;
      }
    }
  `
})