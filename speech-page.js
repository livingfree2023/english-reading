(function(){
  var sec=document.getElementById('media');
  if(sec){var shown=0;Array.prototype.forEach.call(sec.querySelectorAll('[data-media]'),function(row){var kind=row.getAttribute('data-media'),token=/\{\{[A-Z_]+\}\}/.test(row.innerHTML),audio=!!row.querySelector('audio[src]'),ok=kind==='audio'?(!token&&audio):!token;row.hidden=!ok;if(ok){row.classList.toggle('sep',shown>0);shown++;}});sec.hidden=shown===0;}
  var body=document.getElementById('body'), rows=document.querySelectorAll('.voc');
  rows.forEach(function(v){var w=v.querySelector('.w'),g=v.querySelector('.g');if(w&&g){v.title=g.textContent.replace(/\s+/g,' ').trim();}});
  var btn=document.getElementById('vidbtn'),wrap=document.getElementById('vidwrap');
  if(btn&&wrap&&!btn.closest('[data-media]').hidden){btn.onclick=function(){var f=document.createElement('iframe');f.src=btn.dataset.embed;f.title=btn.dataset.title||'Speech video';f.allowFullscreen=true;f.loading='lazy';wrap.appendChild(f);wrap.hidden=false;btn.hidden=true;};}
})();
