/*
 * Gogole Plus Javascript API
 * Source: https://github.com/AdminSpot/Google-Plus-javascript-API/
 * Created by Robert Pitt <https://plus.google.com/110106586947414476573/posts>
*/
(function(){var e={base_path:"https://www.googleapis.com/plus/v1/",api_key:null},d=function(a){if(!a)throw"you must set the api_key when instantiating the object";var a={api_key:a},b={},c;for(c in e)b[c]=e[c];for(c in a)b[c]=a[c];this.config=b};d.prototype.getPerson=function(a,b,c){return this.request("people/"+a,b,c)};d.prototype.listByActivity=function(a,b,c,d){return this.request("activities/"+a+"/people/"+b,c,d)};d.prototype.listActivities=function(a,b,c){return this.request("people/"+a+"/activities/public",
b,c)};d.prototype.getActivity=function(a,b,c){return this.request("activities/"+a,b,c)};d.prototype.searchActivities=function(a,b,c){b.query=a;return this.request("activities",b,c)};d.prototype.listComments=function(a,b,c){return this.request("activities/"+a+"/comments",b,c)};d.prototype.getComment=function(a,b,c){return this.request("comments/"+a,b,c)};d.prototype.searchPeople=function(a,b,c){b.query=a;return this.request("people",b,c)};d.prototype.request=function(a,b,c){var d="__GooglePlusApiCallback_"+
Math.floor(Math.random()*1000001),e=this.buildRequestURL(a,b,d);window[d]=function(a){a.error?(a.error.request=e,c(a.error,null)):c(null,a)};a=document.createElement("script");a.type="text/javascript";a.async=true;a.src=e;b=document.getElementsByTagName("script")[0];b.parentNode.insertBefore(a,b)};d.prototype.buildRequestURL=function(a,b,c){b.key=this.config.api_key;b.callback=c;var a=this.config.base_path+a,c=[],d;for(d in b)b.hasOwnProperty(d)&&c.push(encodeURIComponent(d)+"="+encodeURIComponent(b[d]));
return c.length>0?a+"?"+c.join("&"):a};window.GooglePlusAPI=d})();
