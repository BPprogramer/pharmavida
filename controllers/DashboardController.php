<?php

namespace Controllers;

use MVC\Router;

class DashboardController
{
    public static function index(Router $router)
    {
 
         session_start();
        if (!is_auth()) {
            header('Location:/login');
        } 
       
        if ($_SESSION['roll'] == 1) {
          
            $router->render('inicio/index', [
                'titulo' => 'Inicio',
                'nombre' => $_SESSION['nombre']
            ]);
        } else {

            $router->render('ventas/index', [
                'titulo' => 'Administrar Ventas',
                'nombre' => $_SESSION['nombre']
            ]);
        }
    }
}
