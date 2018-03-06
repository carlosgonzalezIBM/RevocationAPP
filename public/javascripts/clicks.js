$('body').on( 'click', '.mycopy', function( ) {
$(this).closest('tr').effect("highlight", {}, 1500);
});


$('body').on( 'click', '.action', function( ) {
var msg=$(this).closest('table');
var action=$(this).attr('action');
  var table=msg.DataTable();
  var data=table.row($(this).closest('tr')).data();
  $.post("/"+$(this).attr('action'), data, function(datos) {
  msg.before('<div class="alert alert-success alert-dismissible fade show" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"> <span aria-hidden="true">&times;</span></button> Success: '+action+'</div>');
    $(".alert-success").delay(2000).fadeOut(3000, function () { $(this).alert('close'); });
  });
});


$('body').on( 'click', '.morerevoke', function( ) {
var table=$("#tokenstable").DataTable();
var data=$("#tokenstable").DataTable().row($(this).closest('tr')).data();
var same='';
// if(data.refresh_token) refresh='<button action="revokerefresh" class="btn btn-sm btn-warning action">Revoke refresh Token</button>';
if(data.resource_owner!=data.client_id) same='<button action="revokeallfromto" class="btn btn-sm btn-warning action">Revoke all from <strong>'+ data.resource_owner+'</strong> to this App</button>'+
          '<button action="revokeallfrom" class="btn btn-sm btn-warning action">Revoke all from <strong>'+ data.resource_owner+'</strong></button>';
  $(this).popover({
          // trigger:"manual",
        trigger:"focus" ,
          placement: 'right',
          container: $(this).parent(),
          html: true,
          title : '<span class="text-info"><strong>More Actions</strong></span>',
          content :   same+'<button action="revokeallto" class="btn btn-sm btn-warning action">Revoke all from this App</button>'
      });
   $(this).popover('toggle');
});


$('body').on( 'click', '.moreenable', function( ) {
var table=$("#revokedtable").DataTable();
var data=$("#revokedtable").DataTable().row($(this).closest('tr')).data();
var same='';
if(data.resource_owner!=data.client_id) same='<button action="enableallfromto" class="btn btn-sm btn-warning action">Enable all from <strong>'+ data.resource_owner+'</strong> to this App</button>'+
          '<button action="enableallfrom" class="btn btn-sm btn-warning action">Enable all from <strong>'+ data.resource_owner+'</strong></button>';
  $(this).popover({
          // trigger:"manual",
        trigger:"focus" ,
          placement: 'right',
          container: $(this).parent(),
          html: true,
          title : '<span class="text-info"><strong>More Actions</strong></span>',
          content :   same+'<button action="enableallto" class="btn btn-sm btn-warning action">Enable all from this App</button>'
      });
   $(this).popover('toggle');
});



// $('#tokenstable').on( 'click', 'p', function( ) {
// $(this).popover({
//         trigger:"manual",
//         placement: 'bottom',
//         container: $(this),
//         html: true,
//         // title : '<span class="text-info"><strong>Token</strong></span>',
//         content : $(this).attr('token')
//     });
//  $(this).popover('toggle');
//
// //
// //
//
// console.log("click");
// });
