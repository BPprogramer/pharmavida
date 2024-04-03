<?php

namespace Controllers;

use DateTime;
use Model\Producto;
use Model\Venta;
use Model\ProductosVenta;

class ApiProductosVendidos
{
    public static function productosVendidos()
    {

        $fecha_inicial = $_GET['fecha-inicial'];
        $fecha_final = $_GET['fecha-final'];

        $fecha_inicial_dt = new DateTime($fecha_inicial);
        $fecha_final_dt = new DateTime($fecha_final);

        $productos_ventas = ProductosVenta::all();

    
        $productos_vendidos = [];
        foreach ($productos_ventas as $producto) {
            $venta = Venta::find($producto->venta_id);
            $fecha = explode(" ", $venta->fecha);


            $fecha_dt = new DateTime($fecha[0]);

            if ($fecha_dt >= $fecha_inicial_dt && $fecha_dt <= $fecha_final_dt) {
                $producto->fecha  =  $fecha[0];
                $productos_vendidos[] =  $producto;
            }
        }

        // $arreglo_final = [];

        // foreach($productos_vendidos as $key=>$value){
        //     if(!empty($arreglo_final)){

        //         $existe = true;
        //         foreach($arreglo_final as $producto_existe){
        //             if($producto_existe->producto_id == $value->producto_id){
        //                 $arreglo_final[$key]->cantidad = $arreglo_final[$key]->cantidad + $value->cantidad;
        //                 $existe = false;
        //             }
        //         }

        //         if($existe == true){
        //             $arreglo_final[$key] = $value;
        //         }
        //     }else{
        //         $arreglo_final[] = $value;
        //     }
        // }

        // debuguear($arreglo_final);


        $i = 0;
        $datoJson = '{
         "data": [';
        foreach ($productos_vendidos as $producto) {
            $i++;

            $info_producto = Producto::find($producto->producto_id);


            $datoJson .= '[
                        "' . $i . '",
                        "' . $info_producto->id. '",
                        "' . $info_producto->codigo . '",
                        "' . $info_producto->nombre . '",
                      
                      
                        "' . $producto->cantidad . '",
                        "' . $producto->precio . '",
                        "' . $producto->precio*$producto->cantidad  . '"
                
                 ]';
            if ($i != count($productos_vendidos)) {
                $datoJson .= ",";
            }
        }




        $datoJson .=  ']}';
        echo $datoJson;
    }
}
