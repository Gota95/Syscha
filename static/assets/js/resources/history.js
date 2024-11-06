var stepperForm;
$(function(){
  // BS-Stepper Init
  $(document).ready(function () {
    window.stepper = new Stepper(document.querySelector('.bs-stepper'))
  });
  
  var stepperFormEl = document.querySelector('#stepperForm');
  stepperForm = new Stepper(stepperFormEl, {
    animation: true
  });

  var btnNextList = [].slice.call(document.querySelectorAll('.btn-next-form'));
  var btnPreviousList = [].slice.call(document.querySelectorAll('.btn-previous-form'));
  var stepperPanList = [].slice.call(stepperFormEl.querySelectorAll('.bs-stepper-pane'));
  var inputReason = document.getElementById('reason');
  var inputEvolution = document.getElementById('evolution');
  
  var checkClose = $('#case_closed');
  var selectCloseOption = document.getElementById('close_option');
  var selectAttentionOption = document.getElementById('attention_option');
  var inputEstimatedDate = document.getElementById('estimated_date');
  var form = stepperFormEl.querySelector('.bs-stepper-content form');

  btnNextList.forEach(function (btn) {
    btn.addEventListener('click', function () {
      stepperForm.next();
    });
  });

  btnPreviousList.forEach(function (btn) {
    btn.addEventListener('click', function () {
      stepperForm.previous();
    });
  });

  stepperFormEl.addEventListener('show.bs-stepper', function (event) {
    form.classList.remove('was-validated');
    var nextStep = event.detail.indexStep;
    var currentStep = nextStep;

    if (currentStep > 0) {
      currentStep--
    }

    var stepperPan = stepperPanList[currentStep];
    if ((stepperPan.getAttribute('id') === 'evolution-part' && !inputReason.value.length)
    || (stepperPan.getAttribute('id') === 'evolution-part' && !inputEvolution.value.length)) {
      event.preventDefault();
      form.classList.add('was-validated');
    }
    if(checkClose.prop('checked')){
      if((stepperPan.getAttribute('id') === 'consult-part' && !selectCloseOption.value.length)){
        event.preventDefault();
        form.classList.add('was-validated');
      }
    }else{
      if((stepperPan.getAttribute('id') === 'consult-part' && !selectAttentionOption.value.length)
        || (stepperPan.getAttribute('id') === 'consult-part' && !inputEstimatedDate.value.length)){
        event.preventDefault();
        form.classList.add('was-validated');
      }
    }
  });
});