var state={},listeners={},almy={create:function(){state={},listeners={}},state:function(t){return t?state[t]:state},dispatch:function(t,s,e,a){if(t&&"string"==typeof t&&(state[t]!==s||e)){if(state[t]=s,listeners[t])for(var i=0;i<listeners[t].length;++i)listeners[t][i](s);if("object"==typeof s&&!a)for(var r in s)s.hasOwnProperty(r)&&this.dispatch(t+"->"+r,s[r],e,!0);if(/->/.test(t)&&!a){var n=t.split("->"),l=n[0],f=n[1];state[l]||(state[l]={}),state[l][f]=s,this.dispatch(l,state[l],!0,!0)}}},subscribe:function(t,s){listeners[t]||(listeners[t]=[]),listeners[t].push(s),state[t]&&s(state[t])}};exports.almy=almy;