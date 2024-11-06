var imageReport = "";
$(function () {
  checkNewSession();
  $(document).on("keypress", "form", function (e) {
    var code = e.keyCode || e.which;
    if (code == 13) {
        e.preventDefault();
        return false;
    }
  });
  $('.select2').select2({
    placeholder:'Seleccione una opción',
    language: 'es'
  });
  $(document).on('select2:open', () => {
    document.querySelector('.select2-search__field').focus();
  });
  $("input[data-bootstrap-switch]").each(function(){
    $(this).bootstrapSwitch('state');
  });
  $("#lists").DataTable({
    "responsive": false,
    "lengthChange": false,
    "autoWidth": false,
    "search": true,
    "ordering": false,
    "buttons": ["excel",
    {
      extend: "pdfHtml5",
      filename: function() {
        return "MyPDF"      
      },
      title: `SELL POINT \n Reporte de ${$('#titleview').text()}`,
      download: 'open',
      orientation: 'portrait',
      pageSize: 'LETTER',
      customize: function(doc){
        doc.content.splice(1, 0, {
          margin: [10,-60,10,20],
          image: imageReport,
          width: 40
        });
        doc.content[2].table.widths = ['10%%','40%','20%','15%','15%']
      },
      exportOptions: {
        columns: ':visible:not(:eq(-1))'
      }
    },
    "colvis"]
  }).buttons().container().appendTo('#lists_wrapper .col-md-6:eq(0)');
});

function checkNewSession(){
  $.ajax({
    url:'/system/checks/',
    type:'GET',
    data:{
      action:'newsession'
    },
    dataType:'json',
  }).done(function(data){
    if(!data.response){
      openModal('/system/config/session/');
    }
  });
}