/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


if(localStorage.getItem("mail") !== null){
    console.log(localStorage.getItem("mail"))
    window.location.href = "home.html";
}

var jpdbBaseUrl = "http://api.login2explore.com:5577";
var jpdbIML = "/api/iml";
var jpdbIRL = "/api/irl";
var connToken = "90939375|-31949287667723142|90941209";
var empDbName = "HR-DB";
var empRelName = "hrRel0";

function authorise(){
    var mail = $("#inputEmail").val();
    var pass = $("#inputPassword").val();
    if(mail === ""){
        alert("Mail field is empty");
        $("#inputEmail").focus();
        return "";
    }
    if(pass === ""){
        alert("Password field is empty");
        $("#inputPassword").focus();
        return "";
    }
    
    var jsonStr = {
        mail: mail
    };
    
    
    var getReq = createGET_BY_KEYRequest(connToken, empDbName, empRelName, JSON.stringify(jsonStr));

    jQuery.ajaxSetup({async: false});
    var respStr = executeCommandAtGivenBaseUrl(getReq, jpdbBaseUrl, jpdbIRL);
    jQuery.ajaxSetup({async: true});
    console.log(respStr);
    
    var password = JSON.parse(respStr.data).record.password;
    
    if(password === pass){
        localStorage.setItem("mail", mail);
        return respStr;
    }
    
    alert("Wrong Credentials");
    return "";
}

function loginInto(){
    var data = authorise();
    if(data === ""){
        return;
    }
    
    window.location.href = "home.html";
}