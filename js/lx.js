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
