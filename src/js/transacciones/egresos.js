(function(){
    const egresos = document.querySelector('#egresos');
    if(egresos){
    
        const btnRegistrarEgreso = document.querySelector('#registrar');
        const formulario = document.querySelector('#egresoForm');
        const btnSubmit = document.querySelector('#btnSubmit')

        let tablaEgresos;
    
        let id;
        const egreso = document.querySelector('#egreso');
        const descripcion = document.querySelector('#descripcion');

        egreso.addEventListener('input', function(e){
            egreso.value = formatearValor(e.target.value);
        })

        mostrarEgresos();
      

        btnRegistrarEgreso.addEventListener('click',function(){
            id = null;
       
            accionesModal();
        })

      $('#tabla').on('click', '#editar', function(e){
 
            id=e.currentTarget.dataset.egresoId;
         
       
            accionesModal();
        })

   
        $('#tabla').on('click', '#eliminar', function(e){
            const id = e.currentTarget.dataset.egresoId;
            alertaEliminarEgreso(id,e);
        }) 
      

        function alertaEliminarEgreso(id,e){
            
            const egreso = e.currentTarget.parentElement.parentElement.parentElement.childNodes[3].textContent;
           
            
            Swal.fire({
                icon:'warning',
                html: `<h2 class="">esta seguro de eliminar el egreso por un valor de <span class="font-weight-bold"> ${egreso} </span>?</h2><br><p>Esta acción no se puede deshacer</p>`,
          
                showCancelButton: true,
                confirmButtonText: 'Eliminar',
                cancelButtonText: `Cancelar`,
                

            }).then(result=>{
                if(result.isConfirmed){
                    eliminarEgreso(id)
                }
            })
        }
    
   
        async function eliminarEgreso(id){
            const datos = new FormData();
            datos.append('id', id);
         
    
            url = `${location.origin}/api/egreso/eliminar`;
            try {
                const respuesta = await fetch(url,{
                    body:datos,
                    method: 'POST'
                })
                const resultado = await respuesta.json();
              
                eliminarToastAnterior();
            
                if(resultado.type=='error'){
                    $(document).Toasts('create', {
                        class: 'bg-danger',
                        title: 'Error',
                     
                        body: resultado.msg
                      })
                }else{

                    $(document).Toasts('create', {
                        class: 'bg-azul text-blanco',
                        title: 'Completado',
                        
                        body: resultado.msg
                    })

                 

                 
                    tablaEgresos.ajax.reload(); 
                }
                setTimeout(()=>{
                    eliminarToastAnterior();
                },8000)
            } catch (error) { 
                
            }
        }
      

        function mostrarEgresos(){
      
            $("#tabla").dataTable().fnDestroy(); //por si me da error de reinicializar
    
            tablaEgresos = $('#tabla').DataTable({
                language: {
                    "decimal": "",
                    "emptyTable": "No hay información",
                    "info": "Mostrando _START_ a _END_ de _TOTAL_ Entradas",
                    "infoEmpty": "Mostrando 0 to 0 of 0 Entradas",
                    "infoFiltered": "(Filtrado de _MAX_ total entradas)",
                    "infoPostFix": "",
                    "thousands": ",",
                    "lengthMenu": "Mostrar _MENU_ Entradas",
                    "loadingRecords": "Cargando...",
                    "processing": "Procesando...",
                    "search": "Buscar:",
                    "zeroRecords": "Sin resultados encontrados",
                    "paginate": {
                        "first": "Primero",
                        "last": "Ultimo",
                        "next": "Siguiente",
                        "previous": "Anterior"
                    }
                },
                ajax: '/api/egresos',
                "deferRender":true,
                "retrieve":true,
                "proccesing":true,
                responsive:true
            });
            
            $.ajax({
                url:'/api/egresos',
                dataType:'json',
                success:function(req){
                    console.log(req)
                },
                error:function(error){
                    console.log(error.resposeText)
                }
            })
       
        }  



        async function enviarDatos(){

            const datos = new FormData();
            if(id){
                datos.append('id', id)
            }   
          

            datos.append('egreso', egreso.value);
            datos.append('descripcion' , (descripcion.value).trim())

        
            btnSubmit.disabled = true;

            let url = '';
            if(id){
                url = `${location.origin}/api/egreso/editar`;
            }else{
                url = `${location.origin}/api/egreso/crear`;
            }

         

            
            try {
                const respuesta = await fetch(url,{
                    body:datos,
                    method: 'POST'
                })
                const resultado = await respuesta.json();
              
          
          
                eliminarToastAnterior();
            
                btnSubmit.disabled = false;
                if(resultado.type=='error'){
                    $(document).Toasts('create', {
                        class: 'bg-danger',
                        title: 'Error',
                     
                        body: resultado.msg
                      })
                      $('#modal-egreso').modal('hide');
                }else{
                   tablaEgresos.ajax.reload()

                    $(document).Toasts('create', {
                        class: 'bg-azul text-blanco',
                        title: 'Completado',
                        
                        body: resultado.msg
                    })

                  

                    formulario.reset();

                    $('#modal-egreso').modal('hide');
         
                }
                setTimeout(()=>{
                    eliminarToastAnterior();
                },4000)
   
            } catch (error) {  
            }
        }

        function eliminarToastAnterior(){
            if(document.querySelector('#toastsContainerTopRight')){
                document.querySelector('#toastsContainerTopRight').remove()
            }
        }

        async function accionesModal(){
  
            formulario.reset();
            btnSubmit.disabled = false;
            $('#modal-egreso').modal('show');
            $('#egresoForm').validate().resetForm();
            // Elimina todas las reglas de validación
            $('#egresoForm').validate().destroy();
            // Elimina las clases de validación de los elementos
            $('#egresoForm').find('.is-invalid').removeClass('is-invalid');
            if(id){
             
                consultarEgreso();
               
            }
           
         
     
            inicializarValidador();
       
           
        }

        async function consultarEgreso(){
          
          
            try {
                const respuesta = await fetch(`/api/egreso?id=${id}`);
                const resultado = await respuesta.json();
            
               
                llenarFormulario(resultado);
                
            } catch (error) {
                console.log(error)
            }
        }

        function llenarFormulario(resultado){
            

            egreso.value = (parseFloat(resultado.egreso)).toLocaleString('en');
            descripcion.value = resultado.descripcion
          
        }
        function inicializarValidador() {

            $.validator.setDefaults({
              submitHandler: function () {
                        enviarDatos();
                      
                    
              }
            });
      
           
             $('#egresoForm').validate({
              rules: {
                ingreso: {
                    required: true
                      
                },
                descripcion:{
                    required: true
                }
              },
              messages: {
                ingreso: {
                    required: "El monto que sale de la caja es obligatorio"  
                },
                descripcion:{
                    required: "La nota o descripción es obligatoria"
                }
           

              },
              errorElement: 'span',
              errorPlacement: function (error, element) {
                error.addClass('invalid-feedback');
                element.closest('.form-group').append(error);
              },
              highlight: function (element, errorClass, validClass) {
                $(element).addClass('is-invalid');
              },
              unhighlight: function (element, errorClass, validClass) {
                $(element).removeClass('is-invalid');
              }
            });
          };
          $('#egresoForm').on('valid', function(event) {
            inicializarValidador();
        });

        // function llenarPrimerOption(referencia){
        //     const optionDefault =  document.createElement('OPTION');
        //     optionDefault.textContent = 'Seleccione';
     
         
        //     optionDefault.value=0;
        //     referencia.appendChild(optionDefault)
        // }
        function formatearValor(valor){
           
            let valor_sin_formato = parseFloat(valor.replace(/,/g, ''));
            if(isNaN(valor_sin_formato)){
                valor_sin_formato = '';
            }
            const valor_formateado =  valor_sin_formato.toLocaleString('en');
            return valor_formateado ;
        }
        function eliminarToastAnterior(){
            if(document.querySelector('#toastsContainerTopRight')){
                document.querySelector('#toastsContainerTopRight').remove()
            }
        }
        function limpiarHtml(referencia){
            while(referencia.firstChild){
                referencia.removeChild(referencia.firstChild);
            }
        }



    }
})();