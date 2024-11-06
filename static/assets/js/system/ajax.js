const modal=$('#modal');
const modalsecond=$('#modalsecond');
function openModal(url){
  modal.load(url, function() {
    $('.selectm2').select2({
      placeholder: 'Seleccione una opción',
      language: 'es'
    });
    //Bootstrap customfile
    bsCustomFileInput.init();
    $(this).modal({backdrop: 'static', keyboard: false});
    $(this).modal('show');
  });
}

function openModalSecond(url){
  modalsecond.load(url, function() {
    $('.selects2').select2({
      placeholder: 'Seleccione una opción',
      language: 'es'
    });
    $(this).modal({backdrop: 'static', keyboard: false});
    $(this).modal('show');
  });
}

function formErrors(obj, action){
  $.each(obj, function(key, value){
    $(`#${key}`).addClass('is-invalid').attr('aria-invalid','true').attr('aria-describedby',`${key}-error`)
    let span=`<span id="${key}-error" class="error invalid-feedback">${value}</span>`
    $(`#${key}`).parent().append(span)
  })
}