(function () {
    const productos_vendidos = document.querySelector('#productos-vendidos');
    if (productos_vendidos) {

        let tablaProductosVendidos;
        const input_fecha_inicial = document.querySelector('#fecha-inicial');
        const input_fecha_final = document.querySelector('#fecha-final');

        const fecha_actual = new Date();


        let fecha_final = fecha_actual.getFullYear() + '-' + ('0' + (fecha_actual.getMonth() + 1)).slice(-2) + '-' + ('0' + fecha_actual.getDate()).slice(-2);
        // Obtener la fecha actual restada un mes
        fecha_actual.setMonth(fecha_actual.getMonth() - 1);
        let fecha_inicial = fecha_actual.getFullYear() + '-' + ('0' + (fecha_actual.getMonth() + 1)).slice(-2) + '-' + ('0' + fecha_actual.getDate()).slice(-2);


        cargarInputs();
        document.addEventListener("DOMContentLoaded", function () {


            input_fecha_inicial.addEventListener('change', function () {
                fecha_final = input_fecha_final.value;
                fecha_inicial = input_fecha_inicial.value;
                consultarProductosVendidos()
            })
            input_fecha_final.addEventListener('change', function () {
                fecha_final = input_fecha_final.value;
                fecha_inicial = input_fecha_inicial.value;
                consultarProductosVendidos()
            })

            // consultarProductosVendidos();

        });

        function cargarInputs() {
            input_fecha_inicial.value = fecha_inicial
            input_fecha_final.value = fecha_final
            consultarProductosVendidos()

        }





        function consultarProductosVendidos() {


            const fechaObjeto_1 = new Date(fecha_inicial);
            const fechaObjeto_2 = new Date(fecha_final);

            if (fechaObjeto_1 >= fechaObjeto_2) {
                Swal.fire({
                    icon: 'error',
                    title: "Error",
                    text: "La fecha inicial debe ser menor que la fecha final",

                });
                return;
            } else {
                const datos = new FormData();
                datos.append("fecha_inicial", fecha_inicial);
                datos.append("fecha_final", fecha_final);

                $("#tabla").dataTable().fnDestroy(); //por si me da error de reinicializar

                tablaProductosVendidos = $('#tabla').DataTable({
                    ajax: {
                        url: `${location.origin}/api/productos-vendidos?fecha-inicial=${fecha_inicial}&fecha-final=${fecha_final}`,
                        dataFilter: function (data) {
                            const jsonData = JSON.parse(data);
                            let newJson = [];
                        
                            const datos = jsonData.data;
                            datos.forEach(function (row, index) {
                              
                                if (newJson.length > 0) {
                                    let existe = false;
                                    newJson.forEach((producto, indexProducto) => {
                                            if(producto[1]==row[1]){
                                                newJson[indexProducto][4] =  parseInt(newJson[indexProducto][4]) + parseInt(row[4]);
                                                newJson[indexProducto][6] = parseInt(newJson[indexProducto][4])*parseInt(newJson[indexProducto][5])
                                                existe = true;
                                            }
                                        }
                                    )
                                    if(existe == false){
                                        newJson.push(row);
                                    }
                                } else {
                                    newJson.push(row);
                                }

                               
                            });
                       

                            return JSON.stringify({ data: newJson });
                        }
                    },
                    "deferRender": true,
                    "retrieve": true,
                    "proccesing": true,
                    responsive: true,
                    initComplete: function () {
                        // Inicializa los botones después de que la tabla se haya creado
                        var buttons = new $.fn.dataTable.Buttons(tablaProductosVendidos, {
                            buttons: ["copy", "csv", "excel", "pdf", "print", "colvis"]
                        }).container().appendTo('#tabla_wrapper .col-md-6:eq(0)');
                    }
                });
                // tablaProductosVendidos = $('#tabla').DataTable({
                //     ajax: `${location.origin}/api/productos-vendidos?fecha-inicial=${fecha_inicial}&fecha-final=${fecha_final}`,
                //     "deferRender":true,
                //     "retrieve":true,
                //     "proccesing":true,
                //     responsive:true,
                //     initComplete: function () {
                //         // Inicializa los botones después de que la tabla se haya creado
                //         var buttons = new $.fn.dataTable.Buttons(tablaProductosVendidos, {
                //             buttons: ["copy", "csv", "excel", "pdf", "print", "colvis"]
                //         }).container().appendTo('#tabla_wrapper .col-md-6:eq(0)');
                //     }
                // });
                $.ajax({

                    url: `${location.origin}/api/productos-vendidos?fecha-inicial=${fecha_inicial}&fecha-final=${fecha_final}`,

                    dataType: 'json',
                    success: function (req) {
                         console.log(req)

                    },
                    error: function (error) {
                        console.log(error.resposeText)
                    }

                })



            }






        }
        function calcularNuevoPrecioCompra() {
            precio_compra_nuevo.value = '';

            const precio_paquete = parseFloat((precio_paquete_nuevo.value).replace(/,/g, ''));
            const unidades = parseFloat(unidades_input_nuevo.value);
            if (isNaN(precio_paquete) || isNaN(unidades)) {
                return;
            }
            const precio_compra = precio_paquete / unidades;
            precio_compra_nuevo.value = (Math.round(precio_compra)).toLocaleString('en')
        }

        function formatearValor(valor) {

            let valor_sin_formato = parseFloat(valor.replace(/,/g, ''));
            if (isNaN(valor_sin_formato)) {
                valor_sin_formato = '';
            }
            const valor_formateado = valor_sin_formato.toLocaleString('en');
            return valor_formateado;
        }
        async function enviarDatosStock() {
            const datos = new FormData();

            datos.append('id', idProductoActualizarStock)
            datos.append('stock', (nuevo_stock.value));
            datos.append('precio_compra', (precio_compra_nuevo.value));

            btnSubmitNewStock.disabled = true;

            const url = `${location.origin}/api/producto/editar-stock`;



            try {
                const respuesta = await fetch(url, {
                    body: datos,
                    method: 'POST'
                })
                const resultado = await respuesta.json();


                eliminarToastAnterior();

                btnSubmitNewStock.disabled = false;

                if (resultado.type == 'error') {
                    $(document).Toasts('create', {
                        class: 'bg-danger',
                        title: 'Error',

                        body: resultado.msg
                    })
                } else {

                    $("#tabla").DataTable().ajax.reload();

                    $(document).Toasts('create', {
                        class: 'bg-azul text-blanco',
                        title: 'Completado',

                        body: resultado.msg
                    })

                    setTimeout(() => {
                        eliminarToastAnterior();
                    }, 4000)

                    formularioStock.reset();

                    $('#modal-stock').modal('hide');

                }

            } catch (error) {
            }
        }

        function inicializarValidadorStock(id) {
            $.validator.setDefaults({
                submitHandler: function () {
                    enviarDatosStock()

                }
            });

            $('#stockForm').validate({
                rules: {


                    nuevo_stock: {
                        required: true
                    },

                    precio_compra_nuevo: {
                        required: true
                    }
                },
                messages: {
                    nuevo_stock: {
                        required: "El nombre es obligatorio"
                    },
                    precio_compra_nuevo: {
                        required: 'la nueva cantidad adquirida es obligatoria'
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
        $('#stockForm').on('valid', function (event) {
            inicializarValidadorStock();
        });
        function eliminarToastAnterior() {
            if (document.querySelector('#toastsContainerTopRight')) {
                document.querySelector('#toastsContainerTopRight').remove()
            }
        }
    }
})();