/* Lexoral — V66 : le peu de JavaScript du site (réplique d'OCI). Sans lui, tout reste lisible : les panneaux de
   l'accordéon restent ouverts, le premier témoignage s'affiche, et le formulaire s'envoie quand même. */
(function(){
var d=document,h=d.documentElement,fr=h.lang==='fr';h.classList.add('js');

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

/* l'accordéon des services : un seul ouvert ; la page-type de gauche suit */
var acc=d.querySelector('.xa');
if(acc){var items=[].slice.call(acc.querySelectorAll('.xa-i')),cards=[].slice.call(d.querySelectorAll('.xs-card'));
 var show=function(i){cards.forEach(function(c){c.classList.toggle('is-active',+c.dataset.i===i)})};
 var open=function(it){var will=!it.classList.contains('is-open');
  items.forEach(function(x){var on=x===it&&will;x.classList.toggle('is-open',on);x.querySelector('.xa-b').setAttribute('aria-expanded',String(on))});
  if(will)show(+it.dataset.i)};
 items.forEach(function(it){var b=it.querySelector('.xa-b');b.addEventListener('click',function(){open(it)});
  it.addEventListener('mouseenter',function(){show(+it.dataset.i)});b.addEventListener('focus',function(){show(+it.dataset.i)})});
 acc.addEventListener('mouseleave',function(){var o=acc.querySelector('.xa-i.is-open');if(o)show(+o.dataset.i)});}

/* les témoignages : précédent, suivant ; la citation, le nom et le compteur se relaient */
var xt=d.querySelector('.xt');
if(xt){var qs=[].slice.call(xt.querySelectorAll('.xt-q')),inf=[].slice.call(xt.querySelectorAll('.xt-info')),tr=[].slice.call(xt.querySelectorAll('.xt-tr-in [data-i]')),
  ci=xt.querySelector('.xt-i'),k=0,n=qs.length;
 var go=function(j){k=(j+n)%n;[qs,inf,tr].forEach(function(l){l.forEach(function(e){e.classList.toggle('is-active',+e.dataset.i===k)})});
  qs.forEach(function(q){q.setAttribute('aria-hidden',String(+q.dataset.i!==k))});if(ci)ci.textContent=(k<9?'0':'')+(k+1)};
 go(0);[].forEach.call(xt.querySelectorAll('.xt-btn'),function(b){b.addEventListener('click',function(){go(k+(+b.dataset.d))})});}

/* les nouvelles : l'image carrée suit le billet survolé */
var xn=d.querySelector('.xn');
if(xn){var im=[].slice.call(xn.querySelectorAll('.xn-img'));
 [].forEach.call(xn.querySelectorAll('.xn-post'),function(p){var f=function(){im.forEach(function(e){e.classList.toggle('is-active',e.dataset.i===p.dataset.i)})};
  p.addEventListener('mouseenter',f);p.addEventListener('focusin',f)});}

/* les questions (l'ancienne FAQ) */
window.toggleFaq=function(el){var o=el.parentElement.classList.toggle('open');el.setAttribute('aria-expanded',String(o))};

/* au dossier / hors dossier : les heures de bureau, à l'heure de l'Est */
var r=d.querySelectorAll('[data-rec]');
if(r.length&&window.Intl){try{var p=new Intl.DateTimeFormat('en-US',{timeZone:'America/Toronto',weekday:'short',hour:'numeric',minute:'numeric',hour12:false}).formatToParts(new Date()),o={};
 p.forEach(function(x){o[x.type]=x.value});var hh=(+o.hour%24)+(+o.minute)/60,on=/Mon|Tue|Wed|Thu|Fri/.test(o.weekday)&&hh>=9&&hh<17;
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
/* l'ouverture : la loupe — au passage de la souris, la photo se bombe et ondule sous le curseur (WebGL, la réplique
   sobre des distorsions d'OCI). Rien sur écran tactile, rien si l'on a demandé moins de mouvement : la photo reste. */
(function(){var box=document.querySelector('[data-gl]');if(!box)return;
var mq=window.matchMedia;if(!mq||!mq('(hover:hover) and (pointer:fine)').matches||mq('(prefers-reduced-motion: reduce)').matches)return;
var img=box.querySelector('img');if(!img)return;
var cv=document.createElement('canvas'),gl=cv.getContext('webgl',{alpha:false,antialias:false,premultipliedAlpha:false});if(!gl)return;
var VS='attribute vec2 p;varying vec2 v;void main(){v=vec2(p.x*.5+.5,.5-p.y*.5);gl_Position=vec4(p,0.,1.);}';
var FS='precision mediump float;uniform sampler2D t;uniform vec2 res,im,m,pos;uniform float s,tm;varying vec2 v;'+
 'void main(){float ra=res.x/res.y,ia=im.x/im.y;vec2 sc=ra>ia?vec2(1.,ia/ra):vec2(ra/ia,1.);vec2 off=(pos-.5)*(1.-sc);'+
 'vec2 uv=(v-.5)*sc+.5+off;vec2 mt=(m-.5)*sc+.5+off;vec2 dd=uv-mt;vec2 da=dd/sc;da.x*=ra;float r=length(da);'+
 'float f=smoothstep(.34,0.,r);uv=mt+dd*(1.-s*.16*f);uv+=dd*s*.018*sin(r*42.-tm*3.2)*f;gl_FragColor=texture2D(t,clamp(uv,0.,1.));}';
function sh(t,src){var o=gl.createShader(t);gl.shaderSource(o,src);gl.compileShader(o);return gl.getShaderParameter(o,gl.COMPILE_STATUS)?o:null}
var vs=sh(gl.VERTEX_SHADER,VS),fs=sh(gl.FRAGMENT_SHADER,FS);if(!vs||!fs)return;
var pr=gl.createProgram();gl.attachShader(pr,vs);gl.attachShader(pr,fs);gl.linkProgram(pr);if(!gl.getProgramParameter(pr,gl.LINK_STATUS))return;gl.useProgram(pr);
var b=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),gl.STATIC_DRAW);
var ap=gl.getAttribLocation(pr,'p');gl.enableVertexAttribArray(ap);gl.vertexAttribPointer(ap,2,gl.FLOAT,false,0,0);
var U={};['res','im','m','pos','s','tm'].forEach(function(k){U[k]=gl.getUniformLocation(pr,k)});
var tx=gl.createTexture(),ok=false,mx=.5,my=.5,tx_=.5,ty_=.5,S=0,T=0,on=false,raf=0,t0=0,area=box.parentElement||box;
function size(){var r=box.getBoundingClientRect(),dpr=Math.min(window.devicePixelRatio||1,2);cv.width=Math.round(r.width*dpr);cv.height=Math.round(r.height*dpr);gl.viewport(0,0,cv.width,cv.height);
 var cs=getComputedStyle(img).objectPosition.split(' ');gl.uniform2f(U.pos,(parseFloat(cs[0])||50)/100,(parseFloat(cs[1])||50)/100);draw()}
function draw(){if(!ok)return;gl.uniform2f(U.res,cv.width,cv.height);gl.uniform2f(U.m,mx,my);gl.uniform1f(U.s,S);gl.uniform1f(U.tm,T);gl.drawArrays(gl.TRIANGLE_STRIP,0,4)}
function loop(t){raf=0;if(!t0)t0=t;T=(t-t0)/1000;mx+=(tx_-mx)*.12;my+=(ty_-my)*.12;S+=((on?1:0)-S)*.08;draw();
 if(on||S>.002||Math.abs(tx_-mx)>.0005||Math.abs(ty_-my)>.0005)raf=requestAnimationFrame(loop);else{S=0;draw()}}
function go(){if(!raf)raf=requestAnimationFrame(loop)}
function load(){var src=new Image();src.decoding='async';src.onload=function(){gl.bindTexture(gl.TEXTURE_2D,tx);
  gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
  gl.texImage2D(gl.TEXTURE_2D,0,gl.RGB,gl.RGB,gl.UNSIGNED_BYTE,src);gl.uniform2f(U.im,src.naturalWidth,src.naturalHeight);ok=true;
  cv.setAttribute('aria-hidden','true');box.appendChild(cv);size();box.classList.add('gl-on')};src.src=img.currentSrc||img.src}
if(img.complete&&img.naturalWidth)load();else img.addEventListener('load',load,{once:true});
area.addEventListener('pointerenter',function(){on=true;go()});
area.addEventListener('pointerleave',function(){on=false;go()});
area.addEventListener('pointermove',function(e){var r=box.getBoundingClientRect();tx_=(e.clientX-r.left)/r.width;ty_=(e.clientY-r.top)/r.height;if(!on){on=true}go()});
var rt;window.addEventListener('resize',function(){clearTimeout(rt);rt=setTimeout(size,120)});
})();
