import{Zc as m,_c as l,i as a,r as e,u as c,v as f,xb as s}from"./chunk-EV7ISEJV.js";var p=(()=>{let t=class t{constructor(i){this.dialog=i}confirmDialog(i){let r=new l("Confirm Action",i);return this.dialog.open(m,{maxWidth:"400px",data:r}).afterClosed()}};t.\u0275fac=function(r){return new(r||t)(c(s))},t.\u0275prov=e({token:t,factory:t.\u0275fac,providedIn:"root"});let o=t;return o})();var x=(()=>{let t=class t{constructor(){this.confirmService=f(p)}call(i){return new Promise(r=>{this.confirmService.confirmDialog(i).pipe(a(1)).subscribe({next:n=>{r(n)}})})}};t.\u0275fac=function(r){return new(r||t)},t.\u0275prov=e({token:t,factory:t.\u0275fac,providedIn:"root"});let o=t;return o})();export{x as a};