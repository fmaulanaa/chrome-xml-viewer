var etl={extractors:[],transformers:[],loaders:[],executeFirst:function(g,f){f=f||{};var h=this.extractors.executeFirst(g,f);if(h==null||h===false)return h;h=this.transformers.executeFirst(h,g,f);if(h==null||h===false)return h;return this.loaders.executeFirst(h,g,f)}};Array.prototype.executeFirst=function(){for(var g=false,f=0,h=this.length;f<h&&g===false;f++)g=this[f].apply(this,arguments);return g===false?false:g};
NodeList.prototype.filter=function(g){for(var f=[],h=0,i=this.length;h<i;h++)g(this[h])&&f.push(this[h]);return f};var templating={};
(function(){function g(a){if(a.nodeType==Node.DOCUMENT_FRAGMENT_NODE||a.nodeType==Node.DOCUMENT_NODE)return"";for(var b=a,c=".firstChild";(b=b.previousSibling)!=null;)c+=".nextSibling";return g(a.parentNode)+c}function f(a,b,c,d){var e=a.ownerDocument,j=a.nextSibling;a=a.parentNode;for(var k=0;k<b.length;k++)j?a.insertBefore(e.createTextNode(c+b[k]+d),j):a.appendChild(e.createTextNode(c+b[k]+d))}function h(a){var b={};a=document.createNodeIterator(a,NodeFilter.SHOW_TEXT,function(j){return j.nodeValue.search(/{[^}]*}/)>-1?
NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_SKIP},false);for(var c,d;(c=a.nextNode())!=null;){d=c.nodeValue.substr(1,c.nodeValue.length-2);if(d.indexOf("}")>-1){var e=d.split("}{");d=e.shift();c.nodeValue=c.nodeValue.substr(0,d.length+2);f(c,e,"{","}")}c=new Function("node","return node"+g(c)+";");if(b[d])if(b[d]instanceof Function)b[d]=[b[d],c];else b[d]instanceof Array&&b[d].push(c);else b[d]=c}return b}function i(a,b){if(typeof b==="string")a.nodeValue=b;else if(b&&b instanceof Node){if(b.ownerDocument!=
a.ownerDocument)b=a.ownerDocument.importNode(b);a.parentNode.replaceChild(b,a)}else if(b&&b instanceof Array&&b.length>0){for(var c=a.nextSibling,d=c==null,e=0;e<b.length;e++)d?a.parentNode.insertBefore(b[e],c):a.parentNode.appendChild(b[e]);a.parentNode.removeChild(a)}else if(b==null||b.length&&b.length<1)a.parentNode.removeChild(a)}String.prototype.toDomTemplate=function(a){var b=a.createDocumentFragment(),c;if(a instanceof HTMLDocument){c=a.createElement("div");c.innerHTML=this;c=c.firstChild}else{c=
(new DOMParser).parseFromString(this,"text/xml");c=a.importNode(c.firstChild,true)}b.appendChild(c);b.values=h(b);b.stringValue=this;return b};templating.processTemplate=function(a,b){if(typeof a==="string")return this.processStringTemplate(a,b);if(!a.values)return false;var c=a.cloneNode(true),d,e;if(b)for(var j in b)if(a.values[j]){d=b[j];e=a.values[j];if(e instanceof Function)i(e(c),d);else if(e instanceof Array)for(var k=0,l=e.length;k<l;k++)i(e[k](c),d)}return c};templating.processStringTemplate=
function(a,b){var c=a;if(b)for(var d in b)c=c.replace(RegExp("\\{"+d+"\\}","g"),b[d]?b[d]:"");return c}})();(function(){etl.extractors.push(function(g){if(g==null)return false;var f=XRegExp("(^\\s*<\\?xml[^\\n]+)|(^\\s*<(\\S+).+</\\3>\\s*$)","si");g=g.querySelectorAll("body > pre");if(!(g.length==1&&g[0].childElementCount==0&&f.test(g[0].innerText)))return false;return(f=g[0].innerText.toDOM())?f:false});etl.loaders.push(function(g,f,h){var i=f.querySelectorAll("body > pre");if(i.length!=1)return false;var a=h.templateName||"standard",b=h.colorSchemeName||"standard";h.getURL&&f.insertHtmlLinkElement(h.getURL("xml."+
a+"."+b+".css"));i[0].parentNode.replaceChild(g,i[0]);return true});Node.prototype.removeChildren=function(){if(this.hasChildNodes())for(;this.firstChild;)this.removeChild(this.firstChild)};String.prototype.toDOM=function(){var g=this.replace(/^\s+/,"");return(new DOMParser).parseFromString(g,"text/xml")};Document.prototype.insertHtmlHeadElement=function(){head=this.createElement("head");var g=this.querySelector("html");if(g.length<1){g=this.createElement("html");this.appendChild(g)}g.insertBefore(head,
g.firstChild);return head};Document.prototype.insertHtmlLinkElement=function(g){var f=this.createElement("link");f.type="text/css";f.rel="stylesheet";f.href=g;(this.head||this.insertHtmlHeadElement()).appendChild(f);return f}})();(function(){function g(f){var h=["HTML","WML","WML:WML","SVG"];return(f=(f?f.ownerDocument||f:0).documentElement)?h.indexOf(f.nodeName.toUpperCase())<0:false}etl.extractors.push(function(f){if(f==null||!g(f))return false;return f});etl.loaders.push(function(f,h,i){if(!g(h))return false;var a=i.templateName||"standard",b=i.colorSchemeName||"standard";if(i.getURL){i=h.createProcessingInstruction("xml-stylesheet",'type="text/css" href="'+i.getURL("xml."+a+"."+b+".css")+'"');h.insertBefore(i,h.firstChild)}document.documentElement?
h.replaceChild(f,h.documentElement):h.appendChild(f);return true})})();(function(){function g(a){a.cancelBubble=true;for(var b=a.target;!b.getAttribute("class")||b.getAttribute("class").search(/xml-viewer-tag$/i)<0;)b=b.parentNode;var c=b.isCollapsed();c?b.expand():b.collapse();if(a.shiftKey){a=b.querySelectorAll("div[class~='xml-viewer-tag-collapsible']").filter(function(j){return j.parentNode&&j.parentNode!=b});for(var d=0;d<a.length;d++){var e=a[d];c?e.parentNode.expand():e.parentNode.collapse()}}}function f(a,b){for(var c=b.querySelectorAll("div[class~='xml-viewer-tag-collapsible']"),
d=0,e=c.length;d<e;d++){var j=c[d].parentNode;j.firstChild.firstChild.addEventListener("click",g,false);j.isCollapsed=function(){return a.isCollapsed(this)};j.collapse=function(){return a.collapse(this)};j.expand=function(){return a.expand(this)}}}function h(a,b,c){c=c||0;for(var d=[],e=a.firstChild;e;){d.push(h(e,b,c+1));e=e.nextSibling}var j;switch(a.nodeType){case Node.ELEMENT_NODE:j=c;c=d&&d.length>0;b=d&&d.length==1&&d[0]&&d[0].nodeType==Node.TEXT_NODE&&d[0].nodeValue.indexOf("\n")<0;e=i.tag;
if(b)e=i.inlineTag;else if(!c)e=i.singleTag;var k={name:a.nodeName,attributes:null};if(b)k.value=a.firstChild;if(a.hasAttributes()){for(var l=[],m=0,n=a.attributes.length;m<n;m++)l.push(templating.processTemplate(i.attribute,{name:a.attributes[m].nodeName,value:a.attributes[m].nodeValue}));k.attributes=templating.processTemplate(i.attributes,{value:l})}a=templating.processTemplate(e,k);if(c&&e.values.value){c=e.values.value(a);e=c.parentNode;d.reParent(e);e.removeChild(c);if(!b)a.firstChild.depth=
j}j=a;break;case Node.TEXT_NODE:if(!a.nodeValue.isWhitespace())if(k=b!=a.ownerDocument?b.importNode(a,false):a.cloneNode(false)){k.nodeValue=k.nodeValue.replace(/(\r?\n)[\s\t]+/g,"$1");k.nodeValue=k.nodeValue.replace(/(^\r?\n)|(\r?\n$)/g,"")}j=k;break;case Node.CDATA_SECTION_NODE:j=templating.processTemplate(i.cdata,{value:a.nodeValue});break;case Node.PROCESSING_INSTRUCTION_NODE:j=templating.processTemplate(i.processingInstruction,{name:a.nodeName,value:" "+a.nodeValue});break;case Node.COMMENT_NODE:j=
templating.processTemplate(i.comment,{value:a.nodeValue});break;case Node.DOCUMENT_NODE:j=templating.processTemplate(i.document);a=i.document.values.value(j);b=a.parentNode;d.reParent(b);b.removeChild(a);j=j.firstChild;break}return j}var i={standard:{tag:'<div class="xml-viewer-tag"><div class="xml-viewer-tag-start xml-viewer-tag-collapsible"><span><span class="xml-viewer-tag-collapse-indicator">+ </span><span class="xml-viewer-start-bracket">&lt;</span>{name}{attributes}<span class="xml-viewer-start-bracket">&gt;</span></span></div><div class="xml-viewer-tag-content">{value}</div><div class="xml-viewer-tag-end"><span class="xml-viewer-tag-collapse-indicator">+ </span><span class="xml-viewer-end-bracket">&lt;/</span>{name}<span class="xml-viewer-end-bracket">&gt;</span></div></div>',
attribute:'<span class="xml-viewer-attribute"> <span class="xml-viewer-attribute-name">{name}</span>="<span class="xml-viewer-attribute-value">{value}</span>"</span>',attributes:'<span class="xml-viewer-attribute-set">{value}</span>',inlineTag:'<div class="xml-viewer-tag xml-viewer-inline"><div class="xml-viewer-tag-start"><span><span class="xml-viewer-tag-collapse-indicator">+ </span><span class="xml-viewer-start-bracket">&lt;</span>{name}{attributes}<span class="xml-viewer-start-bracket">&gt;</span></span></div><div class="xml-viewer-tag-content">{value}</div><div class="xml-viewer-tag-end"><span class="xml-viewer-end-bracket">&lt;/</span>{name}<span class="xml-viewer-end-bracket">&gt;</span></div></div>',
singleTag:'<div class="xml-viewer-tag"><div class="xml-viewer-tag-start xml-viewer-tag-end"><span><span class="xml-viewer-tag-collapse-indicator">+ </span><span class="xml-viewer-start-bracket">&lt;</span>{name}{attributes}<span class="xml-viewer-start-bracket">/&gt;</span></span></div></div>',processingInstruction:'<div class="xml-viewer-processing-instruction"><span>&lt;?</span>{name}{value}<span>?&gt;</span></div>',comment:'<pre class="xml-viewer-comment"><span class="xml-viewer-tag-start">&lt;!--</span>{value}<span class="xml-viewer-tag-end">--&gt;</span></pre>',
cdata:'<pre class="xml-viewer-cdata"><span class="xml-viewer-tag-start">&lt;![CDATA[</span>{value}<span class="xml-viewer-tag-end">]]&gt;</span></pre>',document:'<div class="xml-viewer-document">{value}</div>',isCollapsed:function(a){return(a=a.firstChild.firstChild.firstChild)&&a.getAttribute("class")!=null&&a.getAttribute("class").indexOf("xml-viewer-visible")>-1},collapse:function(a){var b=a.firstChild.firstChild.firstChild;a=a.firstChild.nextSibling;var c=b.getAttribute("class");b.setAttribute("class",
c.addWordUnique("xml-viewer-visible"));c=a.getAttribute("class");a.setAttribute("class",c.addWordUnique("xml-viewer-hidden"))},expand:function(a){var b=a.firstChild.firstChild.firstChild;a=a.firstChild.nextSibling;var c=b.getAttribute("class");b.setAttribute("class",c.removeWord("xml-viewer-visible"));c=a.getAttribute("class");a.setAttribute("class",c.removeWord("xml-viewer-hidden"))}},reduced:{tag:'<div class="xml-viewer-tag"><div class="xml-viewer-tag-start xml-viewer-tag-collapsible"><span><span class="xml-viewer-tag-collapse-indicator">+ </span>{name}{attributes}<span class="xml-viewer-start-bracket">&gt;</span></span></div><div class="xml-viewer-tag-content">{value}</div><div class="xml-viewer-tag-end"><span class="xml-viewer-tag-collapse-indicator">+ </span><span class="xml-viewer-end-bracket">&lt;</span>{name}</div></div>',
attribute:'<span class="xml-viewer-attribute"> <span class="xml-viewer-attribute-name">{name}</span>="<span class="xml-viewer-attribute-value">{value}</span>"</span>',attributes:'<span class="xml-viewer-attribute-set">{value}</span>',inlineTag:'<div class="xml-viewer-tag xml-viewer-inline"><div class="xml-viewer-tag-start"><span><span class="xml-viewer-tag-collapse-indicator">+ </span>{name}{attributes}<span class="xml-viewer-start-bracket">&gt;</span></span></div><div class="xml-viewer-tag-content">{value}</div><div class="xml-viewer-tag-end"><span class="xml-viewer-end-bracket">&lt;</span></div></div>',
singleTag:'<div class="xml-viewer-tag"><div class="xml-viewer-tag-start xml-viewer-tag-end"><span><span class="xml-viewer-tag-collapse-indicator">+ </span>{name}{attributes}</span></div></div>',processingInstruction:'<div class="xml-viewer-processing-instruction"><span>&lt;?</span>{name}{value}<span>?&gt;</span></div>',comment:'<pre class="xml-viewer-comment"><span class="xml-viewer-tag-start">&lt;!--</span>{value}<span class="xml-viewer-tag-end">--&gt;</span></pre>',cdata:'<pre class="xml-viewer-cdata"><span class="xml-viewer-tag-start">&lt;![CDATA[</span>{value}<span class="xml-viewer-tag-end">]]&gt;</span></pre>',
document:'<div class="xml-viewer-document">{value}</div>',isCollapsed:function(a){return(a=a.firstChild.firstChild.firstChild)&&a.getAttribute("class")!=null&&a.getAttribute("class").indexOf("xml-viewer-visible")>-1},collapse:function(a){var b=a.firstChild.firstChild.firstChild;a=a.firstChild.nextSibling;var c=b.getAttribute("class");b.setAttribute("class",c.addWordUnique("xml-viewer-visible"));c=a.getAttribute("class");a.setAttribute("class",c.addWordUnique("xml-viewer-hidden"))},expand:function(a){var b=
a.firstChild.firstChild.firstChild;a=a.firstChild.nextSibling;var c=b.getAttribute("class");b.setAttribute("class",c.removeWord("xml-viewer-visible"));c=a.getAttribute("class");a.setAttribute("class",c.removeWord("xml-viewer-hidden"))}}};etl.transformers.push(function(a,b){if(a.querySelector("parsererror > div")==null)return false;var c=a.querySelector("parsererror > div").innerText;console.group("XML Document");c=c.split("\n");for(var d=0;d<c.length;d++)if(c[d].length>0)c[d].indexOf("warning")==
0?console.warn(c[d]):console.error(c[d]);console.groupEnd();if(b.querySelector("parsererror > div")==null){c=a.querySelector("parsererror");if(c.ownerDocument!=b)c=b.importNode(c,true);d=b.querySelector("body");d.insertBefore(c,d.firstChild)}return null});etl.transformers.push(function(a,b,c){var d=c.startCollapsed==null?true:c.startCollapsed;i=i[c.templateName||"standard"];for(var e in i)if(typeof i[e]==="string")i[e]=i[e].toDomTemplate(b);h(b.createTextNode("init"),b);b=h(a,b);a=a.ownerDocument?
a.ownerDocument:a;if(a.xmlVersion){c=a.xmlStandalone?"yes":"no";e=(e=a.xmlEncoding?a.xmlEncoding:a.inputEncoding)?' encoding="'+e+'"':"";a='version="'+a.xmlVersion+'"'+e+' standalone="'+c+'" ';a=templating.processTemplate(i.processingInstruction,{name:"xml",value:" "+a});b.insertBefore(a,b.firstChild)}f(i,b);if(d){d=b.querySelectorAll("div[class~='xml-viewer-tag-collapsible']").filter(function(j){return j.parentNode&&j.parentNode.depth&&j.parentNode.depth>1});for(a=0;a<d.length;a++)d[a].parentNode.collapse()}return b});
Array.prototype.reParent=function(a){for(var b=0;b<this.length;b++)if(this[b]){var c=this[b];if(a.ownerDocument!=c.ownerDocument)c=a.ownerDocument.importNode(c,true);a.appendChild(c)}};String.prototype.isWhitespace=function(){return this.replace(/[\u000a\u0009\u000b\u000c\u000d\u0020\u00a0\u0085\u1680\u2007\u2008\u2009\u200a\u2028\u2029\u202f\u205f\u3000]+/g,"").length<1};String.prototype.toNode=function(a,b,c){var d=a.createTextNode(this);if(b){a=a.createElement(b);c&&a.setAttribute("class",c);a.appendChild(d);
d=a}return d};String.prototype.removeWord=function(a,b,c){b=b||" ";c=c||"gi";b||(b=" ");a=RegExp("("+b+")?"+a+"("+b+")?",c);return(c=this.match(a))?this.replace(a,c[1]&&c[2]?b:""):this};String.prototype.addWordUnique=function(a,b){b=b||" ";var c=this;if(c.search(RegExp("\\b"+a+"\\b","i"))<0)c+=(c.length>0?b:"")+a;return c};String.prototype.flip=function(a,b){b||(b=" ");var c=this;if(c.search(RegExp("\\b"+a+"\\b","i"))>-1)c=c.removeWord(a,b,"gi");else c+=(c.length>0?b:"")+a;return c}})();
