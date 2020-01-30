<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
// use Illuminate\Support\Facades\Log;

class Customer extends Model
{
    protected $table = 'Customers';

    public function isDevidDB($devid){
        $customer = DB::table($this->table)->where('devid', $devid)->get();

        return count($customer) > 0 ? true : false;
    }

    public function isMailDevidDB($mailAddr,$devid){
        $customer = DB::table($this->table)->where('email', $mailAddr)->where('devid', $devid)->get();

        return count($customer) > 0 ? true : false;
    }

    public function isDevidTokenDB($devid, $token){
        $customer = DB::table($this->table)->where('devid', $devid)->where('remember_token', $token)->get();

        // Log::debug(DB::table($this->table)->where('devid', $devid)->where('remember_token', $token)->toSql());
        return count($customer) > 0 ? true : false;
    }

    public function isMailDB($mailAddr){
        $customer = DB::table($this->table)->where('email', $mailAddr)->get();

        return count($customer) > 0 ? true : false;
    }

    public function getDevidToUsrNameDB($devid)
    {
        $custRow = DB::table($this->table)->where('devid', $devid)->first();
        return $custRow->name;
    }

    public function getDevidToRow($devid)
    {
        $custRow = DB::table($this->table)->where('devid', $devid)->first();
        return $custRow;
    }

    public function getMailToUsrNameDB($mailAddr)
    {
        $custRow = DB::table($this->table)->where('email', $mailAddr)->first();
        return $custRow->name;
    }

    public function getDevidDB($mailAddr)
    {
        $custRow = DB::table($this->table)->where('email', $mailAddr)->first();
        return $custRow->devid;
    }

    public function getTokenToDevid($token)
    {
        $custRow = DB::table($this->table)->where('remember_token', $token)->first();
        return $custRow->devid;
    }

    public function getTokenToMail($token)
    {
        $custRow = DB::table($this->table)->where('remember_token', $token)->first();
        return $custRow->email;
    }

    public function updTokenCustomer($mailAddr,$updData)
    {
        DB::table($this->table)->where('email', $mailAddr)->update($updData);
    }

    public function updDevidCustomer($mailAddr,$updData)
    {
        DB::table($this->table)->where('email', $mailAddr)->update($updData);
    }

    public function updChgDevidCustomer($devid,$updData)
    {
        DB::table($this->table)->where('devid', $devid)->update($updData);
    }

    public function isTokenCustomer($token)
    {
        $customer = DB::table($this->table)->where('remember_token', $token)->get();

        return count($customer) > 0 ? true : false;
    }

    public function insCustomer($insData)
    {
        DB::table($this->table)->insert(
            $insData
        );
    }


}
