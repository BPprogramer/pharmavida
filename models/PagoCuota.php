<?php

namespace Model;

class  PagoCuota extends ActiveRecord {
    protected static $tabla = 'pago_cuotas';
    protected static $columnasDB = ['id', 'venta_id','cuota_id', 'cliente_id'];


    public $id;
    public $venta_id;
    public $cuota_id;
    public $cliente_id;
 

 
    public function __construct($args = [])
    {
        $this->id = $args['id'] ?? null;
        $this->venta_id = $args['venta_id'] ?? '';
        $this->cuota_id = $args['cuota_id'] ?? '';
        $this->cliente_id = $args['cliente_id'] ?? '';
       

      
    }


}