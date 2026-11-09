/* Lexoral — V67 : le peu de JavaScript du site (réplique d'OCI). Sans lui, tout reste lisible : les panneaux de
   l'accordéon restent ouverts, le premier témoignage s'affiche, le titre du déroulement est là, et le formulaire s'envoie
   quand même. V67 : plus de loupe sur l'ouverture. */
(function(){
var d=document,h=d.documentElement,fr=h.lang==='fr';h.classList.add('js');
var calm=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
var seen=function(el,fn,opt){if(!el)return;if(!('IntersectionObserver' in window)){fn();return}
 var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){io.disconnect();fn()}})},opt||{threshold:.35});io.observe(el)};

/* l'en-tête : les colonnes de liens s'effacent dès qu'on descend */
var oh=d.querySelector('[data-oh]');
if(oh){var sc=function(){oh.classList.toggle('is-scrolled',window.scrollY>40)};sc();window.addEventListener('scroll',sc,{passive:true});}

/* le menu : le panneau blanc */
var mb=d.querySelector('.oh-menu'),dp=d.getElementById('lx-menu');
if(mb&&dp){var set=function(o,back){mb.setAttribute('aria-expanded',String(o));dp.hidden=!o;h.classList.toggle('oh-open',o);
  if(o){var f=dp.querySelector('a');if(f)f.focus({preventScroll:true})}else if(back)mb.focus()};
 mb.addEventListener('click',function(){set(mb.getAttribute('aria-expanded')!=='true',true)});
 dp.addEventListener('click',function(e){if(e.target.closest('a'))set(false)});
 d.addEventListener('keydown',function(e){if(e.key==='Escape'&&!dp.hidden)set(false,true)});
 d.addEventListener('click',function(e){if(!dp.hidden&&!e.target.closest('.oh-panel,.oh-menu'))set(false)});}

/* l'accordéon des services : un seul ouvert ; la page de transcription de gauche suit */
var acc=d.querySelector('.xa');
if(acc){var items=[].slice.call(acc.querySelectorAll('.xa-i')),cards=[].slice.call(d.querySelectorAll('.xs-card'));
 var show=function(i){cards.forEach(function(c){c.classList.toggle('is-active',+c.dataset.i===i)})};
 var open=function(it){var will=!it.classList.contains('is-open');
  items.forEach(function(x){var on=x===it&&will;x.classList.toggle('is-open',on);x.querySelector('.xa-b').setAttribute('aria-expanded',String(on))});
  if(will)show(+it.dataset.i)};
 items.forEach(function(it){var b=it.querySelector('.xa-b');b.addEventListener('click',function(){open(it)});
  it.addEventListener('mouseenter',function(){show(+it.dataset.i)});b.addEventListener('focus',function(){show(+it.dataset.i)})});
 acc.addEventListener('mouseleave',function(){var o=acc.querySelector('.xa-i.is-open');if(o)show(+o.dataset.i)});}


/* le déroulement : le titre tapé à la machine, puis les fiches qui s'allument au fil du défilement */
var xh=d.querySelector('.xp-h');
if(xh&&!calm){var ks=[].slice.call(xh.querySelectorAll('.xp-k')),car=xh.querySelector('.xp-caret');
 if(ks.length&&car){xh.classList.add('xp-armed');
  seen(xh,function(){xh.classList.add('is-typing');var i=0;
   var step=function(){if(i<ks.length){ks[i].classList.add('on');ks[i].after(car);i++;setTimeout(step,ks[i-1].textContent===' '?40:62)}
    else setTimeout(function(){xh.classList.remove('is-typing');xh.classList.remove('xp-armed')},1400)};step()},{threshold:.3});}}
var xp=d.querySelector('.xp');
if(xp){var pc=[].slice.call(xp.querySelectorAll('.xp-c')),dots=[].slice.call(xp.querySelectorAll('.xp-dots li')),sv=xp.querySelector('.xp-sv'),bar=xp.querySelector('.xp-bar'),
  names=pc.map(function(c){return c.querySelector('h3').textContent}),tk=0;
 var upd=function(){tk=0;var vh=window.innerHeight,line=vh*.62,n=0;
  pc.forEach(function(c){var on=c.getBoundingClientRect().top<line;c.classList.toggle('is-on',on);if(on)n++});
  dots.forEach(function(x,i){x.classList.toggle('is-on',i<n)});
  if(sv)sv.textContent=n?names[n-1]:'—';
  if(bar){var a=pc[0].getBoundingClientRect().top,b=pc[pc.length-1].getBoundingClientRect().top,N=pc.length,
    p=n?1/N+(1-1/N)*Math.max(0,Math.min(1,(line-a)/Math.max(1,b-a))):0;bar.style.setProperty('--p',p.toFixed(3))}};
 var req=function(){if(!tk)tk=requestAnimationFrame(upd)};upd();window.addEventListener('scroll',req,{passive:true});window.addEventListener('resize',req);}

/* les témoignages : précédent, suivant ; la citation, le nom (sur le filet) et le compteur se relaient */
var xt=d.querySelector('.xt');
if(xt){var qs=[].slice.call(xt.querySelectorAll('.xt-q')),nm=[].slice.call(xt.querySelectorAll('.xt-name')),tr=[].slice.call(xt.querySelectorAll('.xt-tr-in [data-i]')),
  ci=xt.querySelector('.xt-i'),k=0,n=qs.length;
 var go=function(j){k=(j+n)%n;[qs,nm,tr].forEach(function(l){l.forEach(function(e){e.classList.toggle('is-active',+e.dataset.i===k)})});
  qs.forEach(function(q){q.setAttribute('aria-hidden',String(+q.dataset.i!==k))});
  nm.forEach(function(e){e.setAttribute('aria-hidden',String(+e.dataset.i!==k));[].forEach.call(e.querySelectorAll('a'),function(a){a.tabIndex=+e.dataset.i===k?0:-1})});
  if(ci)ci.textContent=(k<9?'0':'')+(k+1)};
 go(0);[].forEach.call(xt.querySelectorAll('.xt-btn'),function(b){b.addEventListener('click',function(){go(k+(+b.dataset.d))})});}

/* les nouvelles : l'image carrée suit le billet survolé */
var xn=d.querySelector('.xn');
if(xn){var im=[].slice.call(xn.querySelectorAll('.xn-img'));
 [].forEach.call(xn.querySelectorAll('.xn-post'),function(p){var f=function(){im.forEach(function(e){e.classList.toggle('is-active',e.dataset.i===p.dataset.i)})};
  p.addEventListener('mouseenter',f);p.addEventListener('focusin',f)});}

/* les questions (l'ancienne FAQ) */
window.toggleFaq=function(el){var o=el.parentElement.classList.toggle('open');el.setAttribute('aria-expanded',String(o))};

/* le formulaire LX-1 : deux onglets (devis, question) ; FormSubmit en AJAX ; en cas d'échec, le courriel tout prêt */
var f=d.getElementById('v47-f');
if(f){var tabs=[].slice.call(d.querySelectorAll('.xc-tab')),qo=[].slice.call(f.querySelectorAll('[data-q]')),sub=f.querySelector('input[name=_subject]'),ty=f.querySelector('input[name=Type]'),
  bt0=f.querySelector('.v48-t'),msg=f.querySelector('label[for=v47-msg]'),S0=sub?sub.value:'',B0=bt0?bt0.textContent:'',M0=msg?msg.textContent:'';
 var Q=fr?{s:'Lexoral — question (FR)',b:'Envoyer la question',m:'Votre question',t:'Question'}:{s:'Lexoral — question (EN)',b:'Send the question',m:'Your question',t:'Question'};
 var mode=function(q){f.classList.toggle('is-q',q);
  qo.forEach(function(e){e.hidden=q;[].forEach.call(e.querySelectorAll('input,select,textarea'),function(x){x.disabled=q})});
  if(sub)sub.value=q?Q.s:S0;if(ty)ty.value=q?Q.t:(fr?'Devis':'Quote');if(bt0)bt0.textContent=q?Q.b:B0;if(msg)msg.textContent=q?Q.m:M0;
  tabs.forEach(function(t){t.setAttribute('aria-pressed',String((t.dataset.m==='q')===q))})};
 tabs.forEach(function(t){t.addEventListener('click',function(){mode(t.dataset.m==='q');var x=f.querySelector('input:not([type=hidden]):not([disabled])');if(x)x.focus({preventScroll:true})})});
 /* les liens « #request » choisis depuis le haut de la page (le bouton d'appel) remettent l'onglet du devis */
 [].forEach.call(d.querySelectorAll('a[href="#request"]'),function(a){a.addEventListener('click',function(){if(f.classList.contains('is-q'))mode(false)})});
}
if(f&&window.fetch&&window.FormData){
 var st=f.querySelector('.v47-st'),btn=f.querySelector('button[type=submit]'),bt=btn.querySelector('.v48-t')||btn;
 var L=fr?{s:'Envoi…',ok:'Demande reçue. Accusé de réception le jour ouvrable même.',ko:'Le formulaire n’a pas pu être envoyé. Votre demande est prête dans votre logiciel de courriel :',m:'ouvrir le courriel'}
 :{s:'Sending…',ok:'Request received. Acknowledgement the same business day.',ko:'The form could not be sent. Your request is ready in your email app:',m:'open the email'};
 var mail=function(x){var b='';Object.keys(x).forEach(function(k){if(k.charAt(0)!=='_'&&x[k])b+=k+': '+x[k]+'\n'});
  return 'mailto:secure@lexoral.org?subject='+encodeURIComponent(x._subject||'Lexoral')+'&body='+encodeURIComponent(b)};
 var done=function(){f.classList.add('sent');st.textContent=L.ok;try{f.reset()}catch(e){}st.setAttribute('tabindex','-1');st.focus()};
 f.addEventListener('submit',function(e){e.preventDefault();var x={},lbl=bt.textContent;new FormData(f).forEach(function(v,k){x[k]=v});
  if(x._honey){done();return}delete x._honey;delete x._next;x._captcha='false';if(x.email)x._replyto=x.email;
  btn.disabled=true;bt.textContent=L.s;st.textContent='';
  fetch('https://formsubmit.co/ajax/secure@lexoral.org',{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify(x)})
  .then(function(r){return r.json()}).then(function(j){if(j&&String(j.success)==='true'){btn.disabled=false;bt.textContent=lbl;done()}else throw new Error('no')})
  .catch(function(){btn.disabled=false;bt.textContent=lbl;st.textContent=L.ko+' ';var a=d.createElement('a');a.href=mail(x);a.textContent=L.m;st.appendChild(a)})});}
})();
