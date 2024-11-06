$(function() {
  var calendarEl = document.getElementById('calendar');
  var calendarIl = document.getElementById('inline-calendar');
  var selectClinic = $('#sfclinic');
  var selectSpeciality = $('#sfspeciality');
  var inspeciality=$('#speciality');
  var inclinic=$('#clinic');
  var indate=$('#idate');
  var date = new Date();
  var send_date=date.toLocaleDateString('it-IT');
  indate.val(send_date);
  var calendar = new FullCalendar.Calendar(calendarEl, {
    locale: 'es',
    headerToolbar: {
      left: '',
      center: 'title',
      right: 'timeGridDay',
      // right: 'timeGridDay,listWeek,timeGridWeek',
    },
    views: {
      timeGridDay: { buttonText: 'Agenda del día' },
      // timeGridWeek: { buttonText: 'Agenda semanal' },
      // listWeek: { buttonText: 'Listado semanal' }
    },
    initialView:'timeGridDay',
    initialDate: date.toISOString(),
    eventBackgroundColor: '#001f3f',
    slotDuration: '00:30:00',
    slotMinTime: '08:00:00',
    slotMaxTime: '20:00:00',
    navLinks: true, // can click day/week names to navigate views
    allDaySlot: false,
    selectable: true,
    selectMirror: true,
    select: function(arg) {
      if( selectClinic.val() == ''){
        Swal.fire({
          icon: 'warning',
          title: '¡Advertencia!',
          text: 'Seleccione una clínica',
        });
      }else{
        let start = new Date(arg.start);
        let end = new Date(arg.end)
        $('#hour_start').val(`${addZero(start.getHours())}:${addZero(start.getMinutes())}`);
        $('#hour_end').val(`${addZero(end.getHours())}:${addZero(end.getMinutes())}`);
        $('#modalNewQuote').modal('show');
      }
    },
    eventClick: function(arg) {
      if (confirm('Are you sure you want to delete this event?')) {
        arg.event.remove()
      }
    },
    editable: true,
    dayMaxEvents: true,
    events: [],
    // eventContent: function(arg) { 
    //   console.log(arg.view) 
    // }
  });
  // calendario por mes
  var calendarLine = new FullCalendar.Calendar(calendarIl, {
    locale: 'es',
    headerToolbar: {
      left: 'prev,next',
      center: 'title',
      right: ''
    },
    height: '100%',
    initialView: 'multiMonthYear',
    initialDate: date.toISOString(),
    editable: true,
    selectable: true,
    select: function(arg) {
      let dstart=new Date(arg.start);
      indate.val(dstart.toLocaleDateString('it-IT'));
      send_date = dstart.toLocaleDateString('it-IT');
      calendar.gotoDate(arg.start);
      if( selectClinic.val() == ''){
        Swal.fire({
          icon: 'warning',
          title: '¡Advertencia!',
          text: 'Seleccione una clínica',
        });
      }else{
        getAllEvents(send_date,selectSpeciality.val(),selectClinic.val());
      }
    },
    dayMaxEvents: true,
    // events: function(info, successCallback, failureCallback) {
    //   selectClinic.on('change',function(){
    //     $.ajax({
    //       url: '/diary/events/',
    //       type: 'GET',
    //       data: {
    //         'action':'search_events',
    //         'date': send_date,
    //         'specialityid': selectSpeciality.val(),
    //         'clinicid': selectClinic.val(),
    //       },
    //     }).done(function(events) {
    //       successCallback(Array.prototype.slice.call(events)
    //         .map(function(element){
    //           console.log(element);
    //           return {
    //             title: element.title,
    //             start: element.start,
    //             end: element.end
    //           }
    //         })
    //       );
    //     });
    //   });
    // }
  });
  calendar.render();
  calendarLine.render();

  // cambio de especialidad y clinica
  selectSpeciality.on('change',function(){
    var id = $(this).val();
    $.ajax({
      url:'/clinic/select/',
      type: 'GET',
      data:{
        'action':'search_clinic',
        'id':id
      },
      dataType: 'json',
    }).done(function(data){
      if(!data.hasOwnProperty('error')){
        $.each(data, function(key,value){
          selectClinic.html('').select2({
            data: data
          });
        });
        inspeciality.val(id);
        selectClinic.prop('disabled', false);
        return false;
      }
      Swal.fire({
        icon: 'error',
        title: '¡Error!',
        text: `${data.error}`,
      });
    }).fail(function(jqXHR, textStatus, errorThrown){
      Swal.fire({
        icon: 'error',
        title: '¡Error!',
        text: `${textStatus}:${errorThrown}`,
      });
    });
  });

  selectClinic.on('change',function(){
    let id = $(this).val();
    inclinic.val(id);
    getAllEvents(send_date,selectSpeciality.val(),selectClinic.val());
  });

  function getAllEvents(sdate,speciality,clinic){
    clearDiary();
    calendar.batchRendering(function() {
      $.ajax({
        url: '/diary/events/',
        type: 'GET',
        data: {
          'action':'search_events',
          'date': sdate,
          'specialityid': speciality,
          'clinicid': clinic,
        },
      }).done(function(events) {
        events.forEach(function(element){
          calendar.addEvent({
            title: element.title,
            start: element.start,
            end: element.end,
            description: element.description,
          });
        })
      });
    });
  }
  
  function clearDiary(){
    let eventSources = calendar.getEvents();
    let len = eventSources.length;
    for (let i = 0; i < len; i++) { 
        eventSources[i].remove(); 
    } 
  }
});

function addZero(i) {
  if (i < 10) {i = "0" + i}
  return i;
}