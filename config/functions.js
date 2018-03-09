var schedule = require('node-schedule');
var async = require('async');
var tokens=[];
var revoked=[];
// var index = array.indexOf(item);
// if (index !== -1) array.splice(index, 1);

exports.gettokens= function(callback) {
var obj = new Object();
obj.tokens=tokens;
obj.revoked=revoked;
callback(obj);
};
exports.getrevoked= function(callback) {
callback(revoked);
};

exports.getrevokedcontent= function(callback) {
var body='';
var itemsProcessed = 0;

revoked.forEach(function(item, i) {
body+=item.content;
});
  callback(body);

// revoked.foreach((item, index, array) => {
// console.log("hola");
//   asyncFunction(item, () => {
//     console.log("hola2");
//     itemsProcessed++;
//     body.concat(item.content);
//     if(itemsProcessed === array.length) {
//       console.log("hola2");
//       callback(body);
//     }
//   });
// });

};



function combined(){
  var obj = new Object();
  obj.tokens=tokens;
  obj.revoked=revoked;
return obj;
}

exports.revoketoken=function(origtoken,callback) {

    async.filter(tokens, function(token, callback){
    callback(null, origtoken.access_token!=token.access_token);
    }, function(err, results){
tokens=results;
  origtoken.content='<token type="access">'+origtoken.access_token+'</token>';
  revoked.push(origtoken);
  callback(combined());
    });

};

exports.enabletoken=function(origtoken,callback) {

  async.filter(revoked, function(token, callback){
  callback(null, origtoken.access_token!=token.access_token);
  }, function(err, results){
revoked=results;
tokens.push(origtoken);
callback(combined());
  });

};

exports.revokeall=function(origtoken,path,callback) {
var condition;
 async.filter(tokens, function(token,callback) {

   switch (path) {
     case "/revokeallfromto": condition=(origtoken.client_id===token.client_id && origtoken.resource_owner===token.resource_owner); break;
     case "/revokeallfrom":  condition=(origtoken.resource_owner===token.resource_owner); break;
     case "/revokeallto":    condition=(origtoken.client_id===token.client_id); break;
     default: condition=(origtoken.access_token!=token.access_token);
   }
if (condition) {
  token.content='<token type="access">'+token.access_token+'</token>';
  revoked.push(token);
}
callback(null, !condition);
 }, function(err,results) {
tokens=results;
callback(combined());
 });

};

exports.enableall=function(origtoken,path,callback) {
var condition;
 async.filter(revoked, function(token,callback) {

   switch (path) {
     case "/enableallfromto": condition=(origtoken.client_id===token.client_id && origtoken.resource_owner===token.resource_owner); break;
     case "/enableallfrom":  condition=(origtoken.resource_owner===token.resource_owner); break;
     case "/enableallto":    condition=(origtoken.client_id===token.client_id); break;
     default: condition=(origtoken.access_token!=token.access_token);
   }
if (condition) {
  tokens.push(token);
}
callback(null, !condition);
 }, function(err,results) {
revoked=results;
callback(combined());

 });

};







function remove(array, element) {
    return array.filter(e => e !== element);
}


function clean (array, deleteValue, callback) {
  for (var i = 0; i < array.length; i++) {
    if (array[i] === deleteValue) {
      array.splice(i, 1)
      i--
    }
  }
}


exports.newtoken = function(token,callback) {
token.expires_on=new Date(Math.floor (Date.now() + token.expires_in*1000));
revokedexpired(token);
tokens.push(token);
callback(combined());
};


exports.parseNumbers = function(str) {
  if (!isNaN(str)) {
    str = str % 1 === 0 ? parseInt(str, 10) : parseFloat(str);
  }
  return str;
};


function revokedexpired(token){
  schedule.scheduleJob(token.expires_on, function(){
  var item=revoked.find(x => x.access_token === token);
  var item2=tokens.find(x => x.access_token === token);
clean(revoked,item,null);
clean(tokens,item2,null);
  });
};





  // exports.expire = function(time){
  //   schedule.scheduleJob(new Date(Date.now() + time*100), function(){
  // tokens.pop();
  //   });
  // console.log( "real", new Date( Date(tokens[0].expires_on)-Date.now()),'Cancela:',tokens[0].expires_in-- );
// console.log(new Date(tokens[0].expires_on)-Date.now());
  // schedule.scheduleJob('* * * * * *', function(){
  //  console.log( "real",  new Date(tokens[0].expires_on)-Date.now(),'Cancela:',tokens[0].expires_in-- );
  // });


//For refresh


// exports.revokerefresh=function(token,callback) {
// delete tokens.find(x => x.refresh_token === token.refresh_token).refresh_token;
//
// // var item=tokens.find(x => x.access_token === token);
// // console.log("a borrar".green,item,"el orig".black,token);
// // item.content='<token type="refresh">'+item.refresh_token+'</token>';
//
// // revoked.push(token);
// callback(combined());
// };
