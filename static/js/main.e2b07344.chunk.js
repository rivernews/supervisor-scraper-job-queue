(this["webpackJsonpsupervisor-scraper-job-queue"]=this["webpackJsonpsupervisor-scraper-job-queue"]||[]).push([[0],{14:function(e,t,n){e.exports={renewalForm:"renewal-job-form_renewalForm__2a6rn",field:"renewal-job-form_field__V5AVd",input:"renewal-job-form_input__37mDi",submitButton:"renewal-job-form_submitButton__3OXbv"}},35:function(e,t,n){e.exports={App:"App_App__16ZpL"}},39:function(e,t,n){e.exports=n(51)},44:function(e,t,n){},51:function(e,t,n){"use strict";n.r(t);var a,r=n(0),o=n.n(r),s=n(32),l=n.n(s),i=(n(44),n(21)),u=n(9),c=n(19),m=n(38),p=n(13),d=n.n(p),v=n(23),b=n(37),h=n(20),f=n(25),g=n(26);!function(e){e.REGULAR="regular",e.RENEWAL="renewal"}(a||(a={}));var y=function(){function e(t){Object(f.a)(this,e),this.orgId=void 0,this.orgName=void 0,this.lastProgress=void 0,this.lastReviewPage=void 0,this.scrapeMode=void 0,this.orgId=t.orgId,this.orgName=t.orgName,this.lastProgress=t.lastProgress,this.lastReviewPage=t.lastReviewPage,this.scrapeMode=t.scrapeMode}return Object(g.a)(e,null,[{key:"validate",value:function(e){var t=!0,n=!1,a=void 0;try{for(var r,o=["orgId","orgName","lastReviewPage","scrapeMode"][Symbol.iterator]();!(t=(r=o.next()).done);t=!0){var s=r.value;if(!e[s])return Object(h.a)({},s,"required")}}catch(m){n=!0,a=m}finally{try{t||null==o.return||o.return()}finally{if(n)throw a}}var l=w.validate(e.lastProgress);if(l){var i=Object.keys(l),u=Object(c.a)(i,1)[0];return Object(h.a)({},"lastProgress.".concat(u),l[u])}}}]),e}(),w=function(){function e(){Object(f.a)(this,e)}return Object(g.a)(e,null,[{key:"_validate",value:function(e,t,n){if(typeof e[t]!==n)return Object(h.a)({},t,"required")}},{key:"validate",value:function(t){var n=!0,a=!1,r=void 0;try{for(var o,s=[{key:"processed",type:"number"},{key:"wentThrough",type:"number"},{key:"total",type:"number"},{key:"durationInMilli",type:"string"},{key:"page",type:"number"},{key:"processedSession",type:"number"}][Symbol.iterator]();!(n=(o=s.next()).done);n=!0){var l=o.value,i=e._validate(t,l.key,l.type);if(i)return i}}catch(u){a=!0,r=u}finally{try{n||null==s.return||s.return()}finally{if(a)throw r}}}}]),e}(),E=n(14),j=n.n(E),k=[{name:"orgId",type:"text"},{name:"orgName",type:"text"},{name:"lastProgress.processed",type:"number"},{name:"lastProgress.wentThrough",type:"number"},{name:"lastProgress.total",type:"number"},{name:"lastProgress.durationInMilli",type:"text"},{name:"lastProgress.page",type:"number"},{name:"lastProgress.processedSession",type:"number"},{name:"lastReviewPage",type:"url"},{name:"token",type:"text"}],P={orgId:"1138",orgName:"Apple",lastProgress:{processed:4413,wentThrough:4610,total:15407,durationInMilli:"5430000",page:461,processedSession:3},lastReviewPage:"https://www.glassdoor.com/Reviews/Apple-Reviews-E1138_P461.htm",scrapeMode:"renewal",token:""},R=function(){var e=Object(v.a)(d.a.mark((function e(t,n){var a,r,o;return d.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return a=n.setSubmitting,e.next=3,fetch((window.location.href.startsWith("https")?"https://slack.api.shaungc.com/queues/single-org-renewal-job?":"http://localhost:55564/queues/single-org-renewal-job?")+new URLSearchParams({token:t.token}),{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(t)});case 3:if(200!==(r=e.sent).status){e.next=13;break}return e.next=7,r.json();case 7:return o=e.sent,alert("Submit success! Job number "+o.id),a(!1),e.abrupt("return",o);case 13:return e.abrupt("return",r);case 14:case"end":return e.stop()}}),e)})));return function(t,n){return e.apply(this,arguments)}}(),O=function(e,t){var n=t.split("."),a=Object(m.a)(n),r=a[0];return a.slice(1).reduce((function(e,t){return e?e[t]:e}),e[r])},_=function(e){return o.a.createElement("div",{className:j.a.renewalForm},o.a.createElement("h1",null,"Create a Renewal Job"),o.a.createElement(b.a,{initialValues:P,validate:function(e){return y.validate(e)},onSubmit:function(){var t=Object(v.a)(d.a.mark((function t(n,a){var r;return d.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,R(n,a);case 2:r=t.sent,e.onReceiveResponse&&e.onReceiveResponse(r);case 4:case"end":return t.stop()}}),t)})));return function(e,n){return t.apply(this,arguments)}}()},(function(e){var t=e.values,n=e.errors,a=e.touched,r=e.handleChange,s=e.handleBlur,l=e.handleSubmit,i=e.isSubmitting;return o.a.createElement("form",{onSubmit:l},k.map((function(e,l){return o.a.createElement("div",{key:l,className:j.a.field},o.a.createElement("label",null,e.name,": "),o.a.createElement("input",{className:j.a.input,type:e.type,name:e.name,onChange:r,onBlur:s,value:O(t,e.name)}),O(n,e.name)&&O(a,e.name)&&O(n,e.name))})),o.a.createElement("button",{className:j.a.submitButton,type:"submit",disabled:i},"Submit"))})))};function S(){var e=Object(r.useState)({}),t=Object(c.a)(e,2),n=t[0],a=t[1];return o.a.createElement("div",null,0!==Object.keys(n).length&&o.a.createElement("div",null,JSON.stringify(n,null,4)),o.a.createElement(_,{onReceiveResponse:function(e){a(e)}}))}var x=n(35),N=n.n(x);function I(){return o.a.createElement(o.a.Fragment,null,o.a.createElement("h2",null,"Home"),o.a.createElement("p",null,"This is the supervisor scraper frontend"))}Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));l.a.render(o.a.createElement((function(){return o.a.createElement(i.a,null,o.a.createElement("div",{className:N.a.App},o.a.createElement("h2",null,"Navigation"),o.a.createElement("nav",null,o.a.createElement("ul",null,o.a.createElement("li",null,o.a.createElement(i.b,{to:"/"},"Home")),o.a.createElement("li",null,o.a.createElement(i.b,{to:"/resume-job"},"Resume Job")))),o.a.createElement(u.c,null,o.a.createElement(u.a,{path:"/resume-job"},o.a.createElement(S,null)),o.a.createElement(u.a,{path:"/"},o.a.createElement(I,null)))))}),null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))}},[[39,1,2]]]);
//# sourceMappingURL=main.e2b07344.chunk.js.map