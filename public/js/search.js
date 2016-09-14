var majusculeFirst=function(str){var temp=str.charAt(0).toUpperCase();for(var i=1;i<str.length;i++){temp+=str.charAt(i).toLowerCase();}
    return temp;}
var getParam=function(param){var queryString=window.location.search.substring(1),queries=queryString.split("&");for(var i in queries){var pair=queries[i].split("=");if(pair[0]==param){return pair[1];}}
    return null;};var filterPostsByPropertyValue=function(posts,property,value){value = decodeURI(value); var filteredPosts=[];posts.pop();for(var i in posts){var post=posts[i],prop=post[property];post.tags.pop();if(prop.constructor==String){if(prop.toLowerCase()==value.toLowerCase()){filteredPosts.push(post);}}else if(prop.constructor==Array){for(var j in prop){if(prop[j].toLowerCase()==value.toLowerCase()){filteredPosts.push(post);}}}}
    return filteredPosts;};var layoutResultsPage=function(property,value,posts){value = decodeURI(value); var $container=$('#results');if($container.length==0)return;var str=majusculeFirst(property)+" Listing for ‘"+ majusculeFirst(value)+'’';$container.find('h1').text(str);for(var i in posts){var tagsList='<span class="post-date">',post=posts[i],tags=post.tags;for(var j in tags){tagsList+='<a href="/search/?tags='+ tags[j]+'" class="tag">#'+ tags[j].toLowerCase()+'</a> ';}
    tagsList+='</span>';$container.find('ul.results').append('<li style="line-height: 2.2;margin: 20px 0;">'
        +'<a href="'+ post.href+'" style="margin-bottom: 8px;">'
        + posts[i].title
        +'</a>'
        +' <span class="date">- '
        + posts[i].date.day+' '+ posts[i].date.month+' '+ posts[i].date.year
        +'</span>'
        + tagsList
        +'</li><div class="seperator"></div>');}}
var noResultsPage=function(property,value){ value = decodeURI(value);var $container=$('#results');if($container.length==0)return;$container.find('h1').text('No Results Found.').after('<p class="nadda"></p>');var txt="We couldn't find anything associated with '"+ value+"' here.";$container.find('p.nadda').text(txt);};var replaceERBTags=function(elements){elements.each(function(){var $this=$(this),txt=$this.html();txt=txt.replace(new RegExp("&lt;%=(.+?)%&gt;","g"),"{{$1}}");txt=txt.replace(new RegExp("&lt;%(.+?)%&gt;","g"),"{%$1%}");$this.html(txt);});};$(function(){var map={'category':getParam('category'),'tags':getParam('tags'),'search':getParam('search')};$.each(map,function(type,value){if(value!==null){$.getJSON('/search.json',function(data){posts=filterPostsByPropertyValue(data,type,value);if(posts.length===0){noResultsPage(type,value);}else{layoutResultsPage(type,value,posts);}});}});replaceERBTags($('div.highlight').find('code.text'));replaceERBTags($('p code'));});