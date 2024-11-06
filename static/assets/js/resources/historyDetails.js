var btnAddPrimary = $('#btn_add_primary');
var btnAddSecondary = $('#btn_add_secondary');
var btnAddPrescription = $('#btn_add_prescription');
var btnAddLaboratory = $('#btn_add_laboratory');
var inPreview = $('#preview_diagnosis');
var prePreview = $('#preview_prescription');
var labPreview = $('#preview_laboratory');
var inComment = $('#comment_diagnosis');
var labComment = $('#comment_medical_orders');
var diagnosisSelect = 0;
var diagnosisTemp = new Array();
var prescriptionTemp = new Array();
var laboratoryTemp = new Array();
var rowSelected = null;
var caseClosed = $('#case_closed');

const dtDiagnosis = $('#lists_diagnosis').DataTable({
  "sort": false,
  "paging": false,
  "responsive": false,
  "lengthChange": false,
  "autoWidth": false,
  "info": false,
  "searching": false,
  rowCallback(row, data, displayNum, displayIndex, dataIndex) {
    $('td:eq(0)', row).attr('style','text-align:center;');
    $('td:eq(1)', row).attr('style','text-align:center;');
    $('td:eq(-1)', row).attr('style','text-align:center;');
  }
});
const dtLaboratory = $('#lists_laboratory').DataTable({
  "sort": false,
  "paging": false,
  "responsive": false,
  "lengthChange": false,
  "autoWidth": false,
  "info": false,
  "searching": false,
  rowCallback(row, data, displayNum, displayIndex, dataIndex) {
    $('td:eq(0)', row).attr('style','text-align:center;');
  }
});
$(function(){
  btnAddPrimary.hide();
  btnAddSecondary.hide();
  btnAddPrescription.hide();
  btnAddLaboratory.hide();
  $('.search-diagnosis').autocomplete({
    classes: {
      "ui-autocomplete": "highlight"
    },
    source: function (request, response){
      $.ajax({
        url:'/diagnosis/select/',
        type:'GET',
        data: {
          q: request.term
        },
        dataType:'json',
      }).done(function(data){
        console.log(data);
        let results = [];
        data.forEach(element => {
          row = {'value':element.id,'label':element.code+' - '+element.name,'sel':element.code,'prev_diag':element.name};
          results.push(row);
        });
        response(results);
      });
    },
    minLength: 1,
    select: function(event, ui){
      event.preventDefault();
      let validate = searchItemToDetail(ui.item.value);
      if(validate){
        Swal.fire({
          icon: 'warning',
          title: '¡Advertencia!',
          text: 'El diagnóstico seleccionado ya se encuentra agregado al detalle...',
        });
        $(this).val('');
        $(this).focus();
        inPreview.val('');
        btnAddPrimary.hide();
        btnAddSecondary.hide();
      }else{
        diagnosisTemp = new Array();
        diagnosisTemp.push({
          'id':ui.item.value,
          'code':ui.item.sel,
          'name':ui.item.prev_diag
        });
        diagnosisSelect = ui.item.value;
        inPreview.val(ui.item.prev_diag);
        $(this).val(ui.item.sel);
        btnAddPrimary.show();
        btnAddSecondary.show();
      }
    }
  });
  dtDiagnosis.on('click', 'td > i.dt-control', function (e) {
    let tr = e.target.closest('tr');
    let row = dtDiagnosis.row(tr);
 
    if (row.child.isShown()) {
      // This row is already open - close it
      row.child.hide();
    }
    else {
      // Open this row
      dtDiagnosis.row(0).child().show();
    }
  });
  btnAddPrimary.on('click',function(){
    addItemToDetail(diagnosisTemp[0].id,diagnosisTemp[0].code,diagnosisTemp[0].name,true,inComment.val());
  });
  btnAddSecondary.on('click',function(){
    addItemToDetail(diagnosisTemp[0].id,diagnosisTemp[0].code,diagnosisTemp[0].name,false,inComment.val());
  });

  // prescription options
  $('.search-medicine').autocomplete({
    classes: {
      "ui-autocomplete": "highlight"
    },
    source: function (request, response){
      $.ajax({
        url:'/medicine/select/',
        type:'GET',
        data: {
          q: request.term
        },
        dataType:'json',
      }).done(function(data){
        let results = [];
        data.forEach(element => {
          row = {'value':element.id,
            'label':element.code+' - '+element.name+' - '+element.route,
            'sel':element.code,
            'prev_medicine':element.name,
            'route':element.route
          };
          results.push(row);
        });
        response(results);
      });
    },
    minLength: 1,
    select: function(event, ui){
      event.preventDefault();
      prescriptionTemp = new Array();
      prescriptionTemp.push({
        'id':ui.item.value,
        'code':ui.item.sel,
        'name':ui.item.prev_medicine,
        'route':ui.item.route
      });
      prePreview.val(`${ui.item.sel} - ${ui.item.prev_medicine}, vía: ${ui.item.route}`);
      $(this).val(ui.item.sel);
      btnAddPrescription.show();
    }
  });

  btnAddPrescription.on('click',function(e){
    e.preventDefault();
    const campos = [
      { id: 'dose', mensaje: 'Por favor, llena el campo', errorId:'error-dose' },
      { id: 'frequency', mensaje: 'Por favor, llena el campo', errorId:'error-frequency' },
      { id: 'duration', mensaje: 'Por favor, llena el campo', errorId:'error-duration' },
      { id: 'ammount', mensaje: 'Por favor, llena el campo', errorId:'error-ammount' },
    ];
    let formularioValido = true;
    campos.forEach((campo) => {
      const valor = document.getElementById(campo.id).value.trim();
      const errorSpan = document.getElementById(campo.errorId);

      if (valor === '') {
        errorSpan.textContent = campo.mensaje;
        errorSpan.style.display = 'block';
        formularioValido = false;
      }else{
        errorSpan.style.display = 'none';
      }
    });

    if (formularioValido) {
      let dose = $('#dose').val();
      let frequency = $('#frequency').val();
      let duration = $('#duration').val();
      let ammount = $('#ammount').val();
      let comment_prescription = $('#comment_prescription').val();
      addPrescriptionToDiagnosis(prescriptionTemp,dose,frequency,duration,ammount,comment_prescription);
    }
  });

  dtDiagnosis.on('click', '.btn-toggle-child-row', function() {
    // Obtiene la fila actual
    var fila = $(this).closest('tr');
    
    // Verifica si la child row está visible
    if (dtDiagnosis.row(fila).child.isShown()) {
      // Oculta la child row
      dtDiagnosis.row(fila).child.hide();
      $(this).find('i').removeClass('fa-circle-down').addClass('fa-circle-right');
    } else {
      // Muestra la child row
      dtDiagnosis.row(fila).child.show();
      $(this).find('i').removeClass('fa-circle-right').addClass('fa-circle-down');
    }
  });

  $('#lists_diagnosis tbody').on('click', 'tr', function() {
    // Cambiar el color de la tabla principal
    var row = $(this).closest('tr');
    diagnosisSelect = row.find('#diagnosis').val();

    // Quitar el color de las demás filas
    $('#lists_diagnosis tbody tr').removeClass('selected-row');

    // Agregar el color a la fila seleccionada
    $(this).addClass('selected-row');

    rowSelected = dtDiagnosis.row(this).index();
  });

  caseClosed.on('change', () => {
    if (caseClosed.prop('checked')) {
      $('#close_option').prop('disabled', false);
      $('#close_option').prop('required', true);
      $('#attention_option').prop('disabled', true);
      $('#attention_option').prop('required', false);
      $('#estimated_date').prop('disabled', true);
      $('#estimated_option').prop('required', false);
    } else {
      $('#attention_option').prop('disabled', false);
      $('#attention_option').prop('required', true);
      $('#estimated_date').prop('disabled', false);
      $('#estimated_date').prop('required', true);
      $('#close_option').prop('disabled', true);
      $('#close_option').prop('required', false)
    }
  });

  // OPTION LABORATORY
  $('.search-laboratory').autocomplete({
    classes: {
      "ui-autocomplete": "highlight"
    },
    source: function (request, response){
      $.ajax({
        url:'/laboratory/select/',
        type:'GET',
        data: {
          q: request.term
        },
        dataType:'json',
      }).done(function(data){
        let results = [];
        data.forEach(element => {
          row = {'value':element.id,
            'label':element.code+' - '+element.name+' - '+element.type_laboratory,
            'sel':element.code,
            'type':element.type_laboratory,
            'prev_laboratory':element.name,
          };
          results.push(row);
        });
        response(results);
      });
    },
    minLength: 1,
    select: function(event, ui){
      event.preventDefault();
      laboratoryTemp = new Array();
      laboratoryTemp.push({
        'id':ui.item.value,
        'code':ui.item.sel,
        'name':ui.item.prev_laboratory,
        'type':ui.item.type
      });
      labPreview.val(`${ui.item.label}`);
      $(this).val(ui.item.sel);
      btnAddLaboratory.show();
    }
  });

  btnAddLaboratory.on('click',function(){
    addItemToLaboratory(laboratoryTemp[0].id,laboratoryTemp[0].code,laboratoryTemp[0].name,laboratoryTemp[0].type,labComment.val());
  });
});

function deleteItemToDetail(id){
  let row = dtDiagnosis.row('#'+id);
  row.remove().draw();
  if(dtDiagnosis.rows().count() == 0){
    rowSelected = null;
  }
}

function deleteItemToLaboratory(id){
  let row = dtLaboratory.row('#'+id);
  row.remove().draw();
}

function searchItemToDetail(id){
  if(dtDiagnosis.data().filter((item,index) => item.DT_RowId == id).any()){
    return true;
  }
  return false;
}

function addItemToDetail(id,code,name,priority,comment){
  dtDiagnosis.row.add({
    'DT_RowId': id,
    '0':'',
    '1':`<button type="button" class="btn btn-danger deleteProduct" title="Eliminar" onclick="deleteItemToDetail(${id});"> <i class="fas fa-times"></i> </button>`,
    '2':`<input type="hidden" class="form-control" name="diagnosis[]" id="diagnosis" value="${id}"><input type="hidden" id="priority" name="priority[]" value="${priority}">${code}`,
    '3':`<input type="hidden" class="form-control" name="comments[]" id="comments" value="${comment}"> ${name} <br> ${comment}`,
  }).draw();
  $('.sel-diagnosis').val('');
  $('.sel-diagnosis').focus();
  inPreview.val('');
  inComment.val('');
  btnAddPrimary.hide();
  btnAddSecondary.hide();
}

function addItemToLaboratory(id,code,name,category,comment){
  dtLaboratory.row.add({
    'DT_RowId': id,
    '0':`<button type="button" class="btn btn-danger deleteProduct" title="Eliminar" onclick="deleteItemToLaboratory(${id});"> <i class="fas fa-times"></i> </button>`,
    '1':`<input type="hidden" class="form-control" name="laboratory[]" id="laboratory" value="${id}">${code}/${name}`,
    '2':`${category}`,
    '3':`<input type="hidden" class="form-control" name="comments_laboratory[]" id="comments_laboratory" value="${comment}">${comment}`,
  }).draw();
  $('.search-laboratory').val('');
  $('.search-laboratory').focus();
  labPreview.val('');
  labComment.val('');
  btnAddLaboratory.hide();
}

function addPrescriptionToDiagnosis(medicine,dose,frequency,duration,ammount,comment_prescription) {
  // Crea la tabla con child row
  let rowsDtDiagnosis = dtDiagnosis.rows().count();
  var tablaConChildRow = `<table id="${medicine[0].code}" class="table table-bordered table-hover" style="width:100%">
    <thead> 
      <tr> 
        <th>Código medicamento</th>
        <th>Descripción de medicamento</th>
        <th>Opciones</th> 
      </tr>
    </thead> 
    <tbody id="tb${medicine[0].code}"> 
      <tr>
        <td>
          <input type="hidden" name="diagnosis_select[]" id="diagnosis_select" value="${diagnosisSelect}">
          <input type="hidden" name="medicine[]" id="medicine" value="${medicine[0].id}"/>
          ${medicine[0].code}
        </td> 
        <td class="text-center">
          <input type="hidden" name="doses[]" id="doses" value="${dose}"/>
          <input type="hidden" name="frequencies[]" id="frequencies" value="${frequency}"/>
          <input type="hidden" name="durations[]" id="durations" value="${duration}"/>
          <input type="hidden" name="ammounts[]" id="ammounts" value="${ammount}"/>
          <input type="hidden" name="comments_prescription[]" id="comments_prescription" value="${comment_prescription}"/>
          ${medicine[0].name}, vía: ${medicine[0].route} <br/> dosis: ${dose}, cada: ${frequency} día(s), por ${duration} día(s), cantidad: ${ammount}, Observaciones: ${comment_prescription}
        </td>
        <td><button type="button" class="btn btn-danger btn-eliminar-fila"><i class="fas fa-trash-alt"></i></button></td>
      </tr>
    </tbody> 
  </table>`;
  if (rowsDtDiagnosis == 0){
    Swal.fire({
      icon: 'warning',
      title: '¡Advertencia!',
      text: 'Debe agregar un diagnóstico para poder agregar una prescripción...',
    });
    return false;
  }else if(rowsDtDiagnosis == 1){
    rowSelected = 0;
    dtDiagnosis.row(rowSelected).child(tablaConChildRow).show();
  }else if(rowsDtDiagnosis > 0){
    if(rowSelected == null){
      Swal.fire({
        icon: 'warning',
        title: '¡Advertencia!',
        text: 'Debe seleccionar un diagnóstico para poder agregar una prescripción...',
      });
      return false;
    }
    dtDiagnosis.row(rowSelected).child(tablaConChildRow).show();
  }
  $('.search-medicine').val('');
  $('.search-medicine').focus();
  prePreview.val('');
  $('#dose').val('');
  $('#frequency').val('');
  $('#duration').val('');
  $('#ammount').val('');
  $('#comment_prescription').val('');
  var filaActual = dtDiagnosis.row(rowSelected);
  filaActual.nodes().to$().find('td:first-child').html('<button type="button" class="btn btn-circle btn-toggle-child-row"><i class="fas fa-circle-down"></i></button>');
  btnAddPrescription.hide();

}

function addSecondaryDiagnosis(fila) {
  // Crea la tabla con child row
  var tablaConChildRow = '<table class="display" style="width:100%">' +
    '<thead>' +
      '<tr>' +
        '<th>CIE-10</th>' +
        '<th>Diagnóstico</th>' +
        '<th>Opciones</th>' +
      '</tr>' +
    '</thead>' +
    '<tbody>' +
      '<tr>' +
        '<td>CODIGO</td>' +
        '<td>DIAGNOSIS</td>' +
        '<td><button class="btn btn-danger btn-eliminar-fila"><i class="fas fa-trash-alt"></i></button></td>' +
      '</tr>' +
    '</tbody>' +
  '</table>';
  dtDiagnosis.row(0).child(tablaConChildRow).show();
  
  var filaActual = dtDiagnosis.row(0);
  filaActual.nodes().to$().find('td:first-child').html('<button type="button" class="btn-toggle-child-row"><i class="fas fa-chevron-down"></i></button>');
}