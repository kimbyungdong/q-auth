<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the controller to call when that URI is requested.
|
*/

Route::get('/', function () {
    return view('welcome');
});

Route::get('about/{name}', "UsersController@index");


Route::get('test/', function () {
    return "<h1><center>Test</center></h1>";
});

# 入力画面
Route::get('request/', [
    'uses' => 'RequDemoController@getIndex',
    'as' => 'request.index'
]);


# 確認画面
Route::post('request/confirm', [
    'uses' => 'RequDemoController@confirm',
    'as' => 'request.confirm'
]);


// Route::post('request/confirm', 'RequDemoController@confirm');

# 入力画面
Route::get('validation/', [
    'uses' => 'ValiDemoController@getIndex',
    'as' => 'validation.index'
  ]);
   
  # 確認画面
  Route::post('validation/confirm', [
    'uses' => 'ValiDemoController@confirm',
    'as' => 'validation.confirm'
  ]);