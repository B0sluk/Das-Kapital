import { RED } from "../constants";

export default function GlobalStyle() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=JetBrains+Mono:wght@400;700&family=Overpass:wght@300;400;600&display=swap');
      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
      html, body, #root { height: 100%; background: #080808; }
      ::-webkit-scrollbar { width: 2px; }
      ::-webkit-scrollbar-thumb { background: ${RED}; border-radius: 2px; }
      button { cursor: pointer; transition: opacity .12s, transform .1s; }
      button:active { transform: scale(.95); opacity: .85; }
      input { outline: none; }
    `}</style>
  );
}
