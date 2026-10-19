"use client";

const COUNTRIES = [
  ["co", "Colombia"],
  ["mx", "México"],
  ["ar", "Argentina"],
  ["pe", "Perú"],
  ["br", "Brasil"],
  ["cl", "Chile"],
  ["ec", "Ecuador"],
  ["uy", "Uruguay"],
  ["py", "Paraguay"],
  ["bo", "Bolivia"],
  ["ve", "Venezuela"],
  ["pa", "Panamá"],
  ["cr", "Costa Rica"],
  ["gt", "Guatemala"],
  ["sv", "El Salvador"],
  ["hn", "Honduras"],
  ["ni", "Nicaragua"],
  ["cu", "Cuba"],
  ["do", "Rep. Dominicana"],
  ["ht", "Haití"],
];

const CSS = `
.fstrip{margin:46px 0 0;overflow:hidden;border-block:1px solid var(--line);mask-image:linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent);-webkit-mask-image:linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent)}
.fstrip .fs-tk{display:flex;width:max-content;animation:fsmove 60s linear infinite}
.fstrip:hover .fs-tk{animation-play-state:paused}
@keyframes fsmove{to{transform:translateX(-50%)}}
.fstrip .fs-i{position:relative;flex:none;width:130px;height:60px;margin-right:2px;overflow:hidden;display:block}
.fstrip .fs-f{position:absolute;inset:0;width:100%;height:100%;background-size:cover;background-position:center;filter:saturate(1.05) brightness(.9);transition:transform .6s cubic-bezier(.2,.8,.2,1),filter .3s}
.fstrip .fs-i::after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(5,9,20,.05) 30%,rgba(5,9,20,.78) 100%)}
.fstrip .fs-n{position:absolute;left:4px;right:4px;bottom:6px;z-index:2;text-align:center;font-size:12.5px;font-weight:700;line-height:1.1;color:#fff;text-shadow:0 1px 6px rgba(0,0,0,.6);white-space:nowrap}
.fstrip .fs-i:hover .fs-f{transform:scale(1.12);filter:saturate(1.15) brightness(1.02)}
@media(max-width:640px){
.fstrip{margin-top:34px}
.fstrip .fs-i{width:104px;height:52px}
.fstrip .fs-n{font-size:11px;bottom:5px}
}
`;

export default function FlagStrip() {
  const list = [...COUNTRIES, ...COUNTRIES];
  return (
    <>
      <style>{CSS}</style>
      <div className="fstrip" aria-label="Países de Latinoamérica">
        <div className="fs-tk" aria-hidden="true">
          {list.map(([code, name], idx) => (
            <span key={idx} className="fs-i">
              <span className={`fi fi-${code} fs-f`} />
              <span className="fs-n">{name}</span>
            </span>
          ))}
        </div>
      </div>
    </>
  );
}