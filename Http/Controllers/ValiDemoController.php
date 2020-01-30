<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;

class ValiDemoController extends Controller
{
    //

    public function getIndex()
    {
        return view('validation.index');
    }

    public function confirm(Request $request)
    {
        $validateRules = [
            'username' => 'required',
            'mail' => 'required|email',
            'age' => 'required|numeric',
            'opinion' => 'required|max:500'
        ];

        $validateMessages = [
            "required" => "必須項目です。",
            "email" => "メールアドレスの形式で入力してください。",
            "numeric" => "数値で入力してください。",
            "opinion.max" => "500文字以内で入力してください。"
        ];
        
        $this->validate($request, $validateRules, $validateMessages);
        $data = $request->all();
        return view('validation.confirm')->with($data);
    }
}
