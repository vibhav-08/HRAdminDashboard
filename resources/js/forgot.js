/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var jpdbBaseUrl = "http://api.login2explore.com:5577";
var jpdbIML = "/api/iml";
var jpdbIRL = "/api/irl";
var jpdbmail = "/serverless/send_email";
var connToken = "90939375|-31949287667723142|90941209";
var empDbName = "HR-DB";
var empRelName = "hrRel0";


if (localStorage.getItem("mail") !== null) {
    console.log(localStorage.getItem("mail"))
    window.location.href = "home.html";
}

function authorise() {
    var forgotmail = $("#forgotMail").val();
    if (forgotmail === "") {
        alert("Mail field is empty");
        $("#forgotMail").focus();
        return "";
    }

    var jsonStr = {
        mail: forgotmail
    };


    var getReq = createGET_BY_KEYRequest(connToken, empDbName, empRelName, JSON.stringify(jsonStr));

    jQuery.ajaxSetup({async: false});
    var respStr = executeCommandAtGivenBaseUrl(getReq, jpdbBaseUrl, jpdbIRL);
    jQuery.ajaxSetup({async: true});
    console.log(respStr);

    return respStr;
}

function generateP() {
    var pass = '';
    var str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' +
            'abcdefghijklmnopqrstuvwxyz0123456789@#$';

    for (let i = 1; i <= 8; i++) {
        var char = Math.floor(Math.random()
                * str.length + 1);

        pass += str.charAt(char)
    }

    return pass;
}



function sendMail() {
    var jsonStr = authorise();

    if (jsonStr === "") {
        return;
    }

    var password = generateP();
    var mail = $("#forgotMail").val();
    var body = "The new Password is : " + password;
    var subject = "Password Reset";

    var reqStr = {
        "token": connToken,
        "jsonStr": {
            "emailTo": mail,
            "emailSubject": subject,
            "emailContent": body
        }

    };

    jQuery.ajaxSetup({async: false});
    var respStr = executeCommand(JSON.stringify(reqStr), jpdbmail);
    jQuery.ajaxSetup({async: true});
    console.log(respStr);
}