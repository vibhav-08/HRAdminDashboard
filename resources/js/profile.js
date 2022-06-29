/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var jpdbBaseUrl = "http://api.login2explore.com:5577";
var jpdbIML = "/api/iml";
var jpdbIRL = "/api/irl";
var connToken = "90939375|-31949287667723142|90941209";
var empDbName = "HR-DB";
var empRelName = "hrRel0";

function validateData(){
    var mail = $("#profMail").val();
    var name = $("#profName").val();
    var num = $("#profNum").val();
    
    if(mail === ""){
        alert("Mail field is empty");
        $("#profMail").focus();
        return"";
    }
    if(name === ""){
        alert("Name field is empty");
        $("#profName").focus();
        return"";
    }
    if(num === ""){
        alert("Phone Number field is empty");
        $("#profNum").focus();
        return"";
    }
    
    var jsonStr = {
        mail: mail,
        name: name,
        phoneNumber: num
    };
    return JSON.stringify(jsonStr);
}

function fillData(){
    var mail = localStorage.getItem("mail");
    
    var obj = {
        mail: mail
    };
    
    var getReq = createGET_BY_KEYRequest(connToken, empDbName, empRelName, JSON.stringify(obj));

    jQuery.ajaxSetup({async: false});
    var respStr = executeCommandAtGivenBaseUrl(getReq, jpdbBaseUrl, jpdbIRL);
    jQuery.ajaxSetup({async: true});
    console.log(respStr);
    
    var record = JSON.parse(respStr.data).record;
    console.log(record);
    $("#profMail").val(record.mail);
    $("#profName").val(record.name);
    $("#profNum").val(record.phoneNumber);
    
    $("#profMail").prop("disabled", true);
    $("#profName").prop("disabled", true);
    $("#profNum").prop("disabled", true);
    
    $("#saveButton").prop("disabled", true);
    $("#editButton").prop("disabled", false);
}

function editData(){
    console.log("!");
    $("#profMail").prop("disabled", true);
    $("#profName").prop("disabled", false);
    $("#profNum").prop("disabled", false);
    $("#profName").focus();
    
    $("#editButton").prop("disabled", true);
    $("#saveButton").prop("disabled", false);
    console.log("@");
}

function saveData(){
    var mail = localStorage.getItem("mail");
    
    var obj = {
        mail: mail
    };
    
    var getReq = createGET_BY_KEYRequest(connToken, empDbName, empRelName, JSON.stringify(obj));

    jQuery.ajaxSetup({async: false});
    var respStr = executeCommandAtGivenBaseUrl(getReq, jpdbBaseUrl, jpdbIRL);
    jQuery.ajaxSetup({async: true});
    var record_no = JSON.parse(respStr.data).rec_no;
    
    var jsonReq = validateData();
    var updateReq = createUPDATERecordRequest(connToken, jsonReq, empDbName, empRelName, record_no);
    jQuery.ajaxSetup({async: false});
    var respObj = executeCommandAtGivenBaseUrl(updateReq, jpdbBaseUrl, jpdbIML);
    jQuery.ajaxSetup({async: true});
    
    fillData();
}