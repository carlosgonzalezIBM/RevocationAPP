$(document).ready(function() {
    console.log( "Welcome to RevocationApp!");
socketConnect();
window.setInterval(function(){
       /// call your function here
      every();
}, 1000);  // Change Interval here to test. For eg: 5000 for 5 sec
new Clipboard('.mycopy');
});


function socketConnect (){
	 socket = io.connect("/");
            /*Initializing the connection with the server via websockets */
            socket.on('message', function (tokens) {
              // tabletoken(tokens);
            });
            socket.on('token', function (tokens) {
              tabletoken(tokens);
            });

}


function every(){

$('.countdown').each(function( index ) {
   if(Number($(this).text())<1) $(this).closest('table').DataTable().row( $(this).closest('tr')).remove().draw();
  else  $(this).html(Number($(this).text())-1);
     });
}


function tabletoken(datos) {
  $("#tokenstable").DataTable().destroy();
  $("#revokedtable").DataTable().destroy();


 $('#tokenstable').DataTable( {
responsive: true,
        aaData: datos.tokens,
     aoColumns: [
        // { "mDataProp": "token_type" },
        { "mDataProp": "access_token",render: function ( data, type, row, meta ) {
          if (data!= null) return data.substring(0,9)+'...<a href="javascript:void(0)" class="mycopy " data-clipboard-text='+data+'>Copy</a>';
                                return "";
                              }  },
    { "mDataProp": "client_id",render: function ( data, type, row, meta ) {
      if (data!= null) return data.substring(0,9)+'...<a href="javascript:void(0)" class="mycopy " data-clipboard-text='+data+'>Copy</a>';
                            return "";
                          }  },
        { "mDataProp": "scope" },
        { "mDataProp": "expires_on",render: function ( data, type, row, meta ) {
                              if (data!= null){
                    return data.replace(/(\d{4})\-(\d{2})\-(\d{2})T(\d{2}):(\d{2}):(\d{2}).*/, '$4:$5:$6@$3-$2-$1 UTC');
// return '<a href="#" data-toggle="tooltip" title='+data+'>Copy Token</a>'
}
                                return "";
                              } },
        { "mDataProp": "expires_in",render: function ( data, type, row, meta ) {
                              if (data!= null){
        return '<strong class="countdown">'+Math.round((new Date(row.expires_on)-Date.now())/1000)+'</strong> Seconds';
        // return '<a href="#" data-toggle="tooltip" title='+data+'>Copy Token</a>'
        }
                                return "";
                              } },
        { "mDataProp": "resource_owner" ,render:function ( data, type, row, meta ) {
                              if (data!= null) if (row.client_id==data) return 'Same as ClientId'; else return data;
                                return "";
                              }
},
        { "mDataProp": "expires_in"
        ,render:function ( data, type, row, meta ) {
                              if (data!= null) return '<button action="revoketoken" class="btn btn-sm btn-warning action">Revoke Token</button> <a href="javascript:void(0)" class="morerevoke">More</a>'
                                return "";
                              }
      },        ]

    } );



    $('#revokedtable').DataTable( {
   responsive: true,
           aaData: datos.revoked,
        aoColumns: [
           // { "mDataProp": "token_type" },
           { "mDataProp": "access_token",render: function ( data, type, row, meta ) {
             if (data!= null) return data.substring(0,9)+'...<a href="javascript:void(0)" class="mycopy " data-clipboard-text='+data+'>Copy</a>';
                                   return "";
                                 }  },
       { "mDataProp": "client_id",render: function ( data, type, row, meta ) {
         if (data!= null) return data.substring(0,9)+'...<a href="javascript:void(0)" class="mycopy " data-clipboard-text='+data+'>Copy</a>';
                               return "";
                             }  },
           { "mDataProp": "scope" },
           { "mDataProp": "expires_on",render: function ( data, type, row, meta ) {
                                 if (data!= null){
                       return data.replace(/(\d{4})\-(\d{2})\-(\d{2})T(\d{2}):(\d{2}):(\d{2}).*/, '$4:$5:$6@$3-$2-$1');
   // return '<a href="#" data-toggle="tooltip" title='+data+'>Copy Token</a>'
   }
                                   return "";
                                 } },
           { "mDataProp": "expires_in",render: function ( data, type, row, meta ) {
                                 if (data!= null){
           return '<strong class="countdown">'+Math.round((new Date(row.expires_on)-Date.now())/1000)+'</strong> Seconds';
           // return '<a href="#" data-toggle="tooltip" title='+data+'>Copy Token</a>'
           }
                                   return "";
                                 } },
           { "mDataProp": "resource_owner" ,render:function ( data, type, row, meta ) {
                                 if (data!= null) if (row.client_id==data) return 'Same as ClientId'; else return data;
                                   return "";
                                 }
   },
           { "mDataProp": "expires_in"
           ,render:function ( data, type, row, meta ) {
                                 if (data!= null) return '<button action="enabletoken" class="btn btn-sm btn-warning action">Enable Token</button> <a href="javascript:void(0)" class="moreenable">More</a>'
                                   return "";
                                 }
         },

       //   { "mDataProp": "expires_in"
       //   ,render:function ( data, type, row, meta ) {
       //                         if (data!= null) return'<a href="javascript:void(0)" class="revokeToken">Revoke Token</a>'
       //                           return "";
       //                         }
       // },

   // <button data="'+row.refresh_token+'" class="btn btn-sm btn-warning revoke">Revoke all from <strong>'+row.resource_owner+'</strong></button>
           ]

       } );
};
