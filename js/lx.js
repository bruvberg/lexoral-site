/* Lexoral — V50 : le peu de JavaScript du site. Sans lui, tout reste lisible et le formulaire s'envoie quand même. */
(function(){
var d=document,fr=d.documentElement.lang==='fr';

/* le menu (sous 1220 px) */
var mb=d.querySelector('.lx-mbtn'),dp=d.getElementById('lx-menu');
if(mb&&dp){var set=function(o){mb.setAttribute('aria-expanded',String(o));dp.hidden=!o};
 mb.addEventListener('click',function(){set(mb.getAttribute('aria-expanded')!=='true')});
 dp.addEventListener('click',function(e){if(e.target.closest('a'))set(false)});
 d.addEventListener('keydown',function(e){if(e.key==='Escape')set(false)});}

/* les questions : une réponse s'ouvre, la touche s'enfonce */
window.toggleFaq=function(el){var o=el.parentElement.classList.toggle('open');el.setAttribute('aria-expanded',String(o))};

/* au dossier / hors dossier : les heures de bureau, à l'heure de l'Est */
var r=d.querySelectorAll('[data-rec]');
if(r.length&&window.Intl){try{var p=new Intl.DateTimeFormat('en-US',{timeZone:'America/Toronto',weekday:'short',hour:'numeric',minute:'numeric',hour12:false}).formatToParts(new Date()),o={};
 p.forEach(function(x){o[x.type]=x.value});var h=(+o.hour%24)+(+o.minute)/60,on=/Mon|Tue|Wed|Thu|Fri/.test(o.weekday)&&h>=9&&h<17;
 [].forEach.call(r,function(e){e.classList.toggle('on',on);var t=e.querySelector('.lx-rec-t');if(t)t.textContent=on?(fr?'Au dossier — nous répondons maintenant':'On the record — we answer now'):(fr?'Hors dossier — réponse le jour ouvrable suivant':'Off the record — reply the next business day')})}catch(e){}}

/* le formulaire LX-1 : FormSubmit en AJAX ; en cas d'échec, le courriel tout prêt */
var f=d.getElementById('v47-f');
if(f&&window.fetch&&window.FormData){
 var st=f.querySelector('.v47-st'),btn=f.querySelector('button[type=submit]'),bt=btn.querySelector('.v48-t')||btn,lbl=bt.textContent;
 var L=fr?{s:'Envoi…',ok:'Demande reçue. Accusé de réception le jour ouvrable même.',ko:'Le formulaire n’a pas pu être envoyé. Votre demande est prête dans votre logiciel de courriel :',m:'ouvrir le courriel'}
 :{s:'Sending…',ok:'Request received. Acknowledgement the same business day.',ko:'The form could not be sent. Your request is ready in your email app:',m:'open the email'};
 var mail=function(x){var b='';Object.keys(x).forEach(function(k){if(k.charAt(0)!=='_'&&x[k])b+=k+': '+x[k]+'\n'});
  return 'mailto:secure@lexoral.org?subject='+encodeURIComponent(x._subject||'Lexoral')+'&body='+encodeURIComponent(b)};
 var done=function(){f.classList.add('sent');st.textContent=L.ok;try{f.reset()}catch(e){}st.setAttribute('tabindex','-1');st.focus()};
 f.addEventListener('submit',function(e){e.preventDefault();var x={};new FormData(f).forEach(function(v,k){x[k]=v});
  if(x._honey){done();return}delete x._honey;delete x._next;x._captcha='false';if(x.email)x._replyto=x.email;
  btn.disabled=true;bt.textContent=L.s;st.textContent='';
  fetch('https://formsubmit.co/ajax/secure@lexoral.org',{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify(x)})
  .then(function(r){return r.json()}).then(function(j){if(j&&String(j.success)==='true')done();else throw new Error('no')})
  .catch(function(){btn.disabled=false;bt.textContent=lbl;st.textContent=L.ko+' ';var a=d.createElement('a');a.href=mail(x);a.textContent=L.m;st.appendChild(a)})});}
})();
/* V52 : ce qui s'anime à l'arrivée dans l'écran (.io → .in) — le filet du déroulement, par exemple */
(function(){var els=document.querySelectorAll('.io');if(!els.length)return;
if(!('IntersectionObserver' in window)||(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches)){[].forEach.call(els,function(e){e.classList.add('in')});return}
var o=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');o.unobserve(e.target)}})},{threshold:.35});
[].forEach.call(els,function(e){o.observe(e)})})();
/* V63 : la colonne vertébrale — l'onde de l'enregistrement, tracée entre le premier tiers et le reste, d'une section à
   l'autre (comme la marge d'une page de transcription). Elle parle au titre de chaque section, se tait ailleurs. */
(function(){
var d=document;if(!d.querySelector('.sx'))return;
var secs=[].slice.call(d.querySelectorAll('.sx, .lx-fg'));
var NS='http://www.w3.org/2000/svg',svg=d.createElementNS(NS,'svg');svg.setAttribute('class','spine');svg.setAttribute('aria-hidden','true');
d.body.appendChild(svg);
function rng(s){return function(){s=(s*16807)%2147483647;return(s-1)/2147483646}}
function draw(){
 if(innerWidth<1100){svg.style.display='none';return}svg.style.display='';
 var sy=window.scrollY||0,out='',bot=0;
 secs.forEach(function(sec,i){
  var g=sec.classList.contains('lx-fg')?sec:sec.querySelector('.sx-g'),b=sec.querySelector('.sx-b, .lx-sheet'),h=sec.querySelector('.sx-h, .lx-fh2'),rh=sec.querySelector('.sx-rh');
  if(!g||!b||!h)return;
  var gap=parseFloat(getComputedStyle(g).columnGap)||28,x=Math.round(b.getBoundingClientRect().left-gap/2)+.5;
  var r=sec.getBoundingClientRect(),y0=r.top+sy,y1=r.bottom+sy;
  var s0=(rh?rh.getBoundingClientRect().bottom:r.top)+sy+18,s1=h.getBoundingClientRect().bottom+sy;
  var R=rng(97+i*31),p='';
  for(var y=Math.ceil(y0)+2;y<y1-1;y+=3){
   var a;
   if(y>s0&&y<s1){var t=(y-s0)/(s1-s0);a=1+(1.6+6.4*Math.pow(Math.sin(Math.PI*t),.6))*(.3+.7*Math.abs(Math.sin(y/19+i*1.7)))*(.55+.45*R())}
   else a=.5+1.2*R()*R();
   p+='M'+(x-a).toFixed(1)+' '+y+'H'+(x+a).toFixed(1);
  }
  out+='<path class="'+(sec.classList.contains('sx--navy')?'sp-wh':'sp-ink')+'" d="'+p+'"/>';
  bot=Math.max(bot,y1);
 });
 svg.setAttribute('height',Math.ceil(bot));svg.style.height=Math.ceil(bot)+'px';svg.innerHTML=out;
}
var tm;addEventListener('resize',function(){clearTimeout(tm);tm=setTimeout(draw,150)});
addEventListener('load',draw);if(d.fonts&&d.fonts.ready)d.fonts.ready.then(draw);draw();
})();
