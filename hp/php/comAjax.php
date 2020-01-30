<?php

date_default_timezone_set('Asia/Tokyo');


foreach (['fncName','JsonData'] as $v) {
    $$v = (string)filter_input(INPUT_POST, $v);
}

if ($fncName <> ''){
    if(function_exists($fncName)) {
       $fncName();
    }
}


function contactSendMain(){

    require_once('qdmail.php');
    require_once('qdsmtp.php');
    


    $JsonData = $GLOBALS['JsonData'];

    $data = json_decode($JsonData);

    $curDate = date('Y/m/d H:i:s');


    try{


        $mail = new Qdmail();

        $mail -> errorDisplay(false);
        $mail -> smtp(true);

        $param = array(
            'host' => 'smtp10.gmoserver.jp',    // メールサーバのIPなど
            'port' => 587,                  // SMTPポート（25,　587 ...）
            'from' => 'info@white-net.co.jp',  // Return-path: に設定されるメルアド
            'protocol' => 'SMTP_AUTH',      // 認証が必要なければ 'SMTP' でよし
            'user' => 'info@white-net.co.jp',           // SMTP認証ユーザ
            'pass' => 'admin911'            // SMTP認証パスワード
        );

 
        $mail -> smtpServer($param);

        $to[] = array( 'info@dcvisor.com' , '' );
        $to[] = array( 'kim@white-net.co.jp' , '' );

        foreach( $to as $addr_and_name ){
          $mail -> to( $addr_and_name  , null , true );
        }

        //$mail->bcc('kim@white-net.co.jp');    // 宛先        
        $mail->from('info@white-net.co.jp');              // 送信元
        $mail->subject('DC VISOR問い合わせ【'.$data->{'company'}.'】');           // 件名

        $content = "";
        $content = $content."    区 分：{$data->{'kbn'}}\n";
        $content = $content."    貴社名：{$data->{'company'}}\n";
        $content = $content."    お名前：{$data->{'userName'}}\n";
        $content = $content."    メールアドレス：{$data->{'userMail'}}\n";
        $content = $content."    お電話番号：{$data->{'userTel'}}\n";
        $content = $content."    題 名：{$data->{'subject'}}\n";
        $content = $content."    内 容：{$data->{'content'}}\n";

        $mail->text($content);                  // メッセージ

        $mail->send();

        // SqlDBに保存
        createTable();

        $pdo = new PDO('sqlite:contact.db');

        // SQL実行時にもエラーの代わりに例外を投げるように設定
        // (毎回if文を書く必要がなくなる)
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);    
        // デフォルトのフェッチモードを連想配列形式に設定 
        // (毎回PDO::FETCH_ASSOCを指定する必要が無くなる)
        $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);


        $stmt = $pdo->prepare("INSERT INTO T_CONTECT(contectData,insDate) VALUES (?, ?)");
        $stmt->execute([$JsonData,$curDate]);
        
        
        $pdo = null;
        
        echo "OK";

    }catch (Exception $e) {
        echo "NG".$e->getMessage();
    }  
}

function createTable(){
    try {
        $pdo = new PDO('sqlite:contact.db');

        // SQL実行時にもエラーの代わりに例外を投げるように設定
        // (毎回if文を書く必要がなくなる)
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);    
        // デフォルトのフェッチモードを連想配列形式に設定 
        // (毎回PDO::FETCH_ASSOCを指定する必要が無くなる)
        $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);

        // テーブル作成
        $query = "CREATE TABLE IF NOT EXISTS T_CONTECT(
                    seqNo INTEGER PRIMARY KEY AUTOINCREMENT,
                    contectData text,
                    insDate VARCHAR(25)
                )";

        $pdo->exec($query);

        $pdo = null;

    } catch (Exception $e) {

        echo $e->getMessage() . PHP_EOL;

    }
}

?>