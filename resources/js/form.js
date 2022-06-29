/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var jpdbBaseUrl = "http://api.login2explore.com:5577";
var jpdbIML = "/api/iml";
var jpdbIRL = "/api/irl";
var connToken = "90939375|-31949287667723142|90941209";
var empDbName = "empDB";
var empRelName = "empRel1";

setBaseUrl(jpdbBaseUrl);

function disableCtrl(b) {
    $("#new").prop("disabled", b);
    $("#save").prop("disabled", b);
    $("#edit").prop("disabled", b);
    $("#change").prop("disabled", b);
    $("#reset").prop("disabled", b);
}

function disableNav(b) {
    $("#first").prop("disabled", b);
    $("#prev").prop("disabled", b);
    $("#next").prop("disabled", b);
    $("#last").prop("disabled", b);
}

function disableForm(b) {
    $("#empid").prop("disabled", b);
    $("#empname").prop("disabled", b);
    $("#basic").prop("disabled", b);
    $("#hra").prop("disabled", b);
    $("#da").prop("disabled", b);
    $("#deduc").prop("disabled", b);
}

function initEmpForm() {
    localStorage.setItem("first_rec_no", "0");
    localStorage.setItem("last_rec_no", "0");
    localStorage.setItem("curr_rec_no", "0");

//    localStorage.removeItem(first_rec_no);
//    localStorage.removeItem(last_rec_no);
//    localStorage.removeItem(curr_rec_no);

    console.log("Local Storage evacuated");
}

function validateData() {
    $("#empid").focus();
    var empid, empname, basic, hra, da, deduc;
    empid = $("#empid").val();
    empname = $("#empname").val();
    basic = $("#basic").val();
    hra = $("#hra").val();
    da = $("#da").val();
    deduc = $("#deduc").val();

    if (empid === "") {
        alert("Employee ID is not filled");
        $("#empid").focus();
        return "";
    } else if (empname === "") {
        alert("Employee Name is not filled");
        $("#empname").focus();
        return "";
    } else if (basic === "") {
        alert("Basic Salary is not filled");
        $("#basic").focus();
        return "";
    } else if (hra === "") {
        alert("HRA is not filled");
        $("#hra").focus();
        return "";
    } else if (da === "") {
        alert("DA is not filled");
        $("#da").focus();
        return "";
    } else if (deduc === "") {
        alert("Deduction is not filled");
        $("#deduc").focus();
        return "";
    }

    var jsonStrObj = {
        id: empid,
        name: empname,
        salary: basic,
        hra: hra,
        da: da,
        deduction: deduc
    };

    return JSON.stringify(jsonStrObj);
}

function setFirstRec(result) {
    var record = JSON.parse(result.data);
    if (record.rec_no === undefined) {
        localStorage.setItem("first_rec_no", "0");
    } else {
        localStorage.setItem("first_rec_no", record.rec_no);
    }
}

function setLastRec(result) {
    var record = JSON.parse(result.data);
    if (record.rec_no === undefined) {
        localStorage.setItem("last_rec_no", "0");
    } else {
        localStorage.setItem("last_rec_no", record.rec_no);
    }
}

function setCurrRec(result) {
    var record = JSON.parse(result.data);

    if (record.rec_no === undefined) {
        localStorage.setItem("curr_rec_no", "0");
    } else {
        localStorage.setItem("curr_rec_no", record.rec_no);
    }

}

function getCurrRec() {
    return localStorage.getItem("curr_rec_no");
}

function getFirstRec() {
    return localStorage.getItem("first_rec_no");
}

function getLastRec() {
    return localStorage.getItem("last_rec_no");
}

function showData(result) {
    if (result.status === 400) {
        return;
    }

    console.log(result);
    setCurrRec(result);
    var rec = JSON.parse(result.data).record;

    console.log(rec);

    $("#empid").val(rec.id);
    $("#empname").val(rec.name);
    $("#basic").val(rec.salary);
    $("#hra").val(rec.hra);
    $("#da").val(rec.da);
    $("#deduc").val(rec.deduction);

    disableNav(false);
    disableForm(true);

    $("#new").prop("disabled", false);
    $("#save").prop("disabled", true);
    $("#edit").prop("disabled", false);
    $("#change").prop("disabled", true);
    $("#reset").prop("disabled", true);

    if (getCurrRec() === getLastRec()) {
        $("#next").prop("disabled", true);
        $("#last").prop("disabled", true);
    }
    if (getCurrRec() === getFirstRec()) {

        $("#prev").prop("disabled", true);
        $("#first").prop("disabled", true);
    }
    
}

function noRecord() {
    if (getFirstRec() === "0" && getLastRec() === "0")
        return true;
    return false;
}

function oneRecord() {
    if (noRecord()) {
        console.log("false");
        return false;
    } else if (parseInt(getLastRec()) - parseInt(getFirstRec()) === 0) {
        return true;
    }
    return false;
}

function newForm() {
    emptyForm();
    disableForm(false);
    

    disableNav(true);
    disableCtrl(true);

    $("#save").prop("disabled", false);
    $("#reset").prop("disabled", false);
    $("#empid").focus();
}

function emptyForm() {
    $("#empid").val("");
    $("#empname").val("");
    $("#basic").val("");
    $("#hra").val("");
    $("#da").val("");
    $("#deduc").val("");
}

function getEmpFromEmpId() {
    var empid = $("#empid").val();
    var jsonStr = {
        id: empid
    };

    var getReq = createGET_BY_KEYRequest(connToken, empDbName, empRelName, JSON.stringify(jsonStr));

    jQuery.ajaxSetup({async: false});
    var respStr = executeCommandAtGivenBaseUrl(getReq, jpdbBaseUrl, jpdbIRL);
    jQuery.ajaxSetup({async: true});
    console.log(respStr);
    if (respStr.status === 400) {
        $("#save").prop("disabled", false);
        $("#reset").prop("disabled", false);

        $("#empname").focus();
    } else if (respStr.status === 200) {
        showData(respStr);
        $("#edit").prop("disabled", false);
    }
}

function saveData() {
    var jsonStrObj = validateData();
    if (jsonStrObj === "") {
        return "";
    }

    var putReq = createPUTRequest(connToken, jsonStrObj, empDbName, empRelName);


    jQuery.ajaxSetup({async: false});
    var resJsonObj = executeCommandAtGivenBaseUrl(putReq, jpdbBaseUrl, jpdbIML);
    jQuery.ajaxSetup({async: true});

    if (noRecord()) {
        setFirstRec(resJsonObj);
    }
    setLastRec(resJsonObj);
    setCurrRec(resJsonObj);
    resetForm();
}

function resetForm() {
    disableCtrl(true);
    disableNav(false);

    var obj = createGET_BY_RECORDRequest(connToken, empDbName, empRelName, getCurrRec());
    jQuery.ajaxSetup({async: false});
    var getFirstResp = executeCommandAtGivenBaseUrl(obj, jpdbBaseUrl, jpdbIRL);
    showData(getFirstResp);
    jQuery.ajaxSetup({async: true});

    if (oneRecord() || noRecord()) {
        disableNav(true);
    }

    $("#new").prop("disabled", false);

    if (noRecord()) {
        emptyForm();
        $("#edit").prop("disabled", true);
    } else {
        $("#edit").prop("disabled", false);
    }
    disableForm(true);
}

function editData() {
    disableForm(false);
    $("#empid").prop("disabled", false);
    $("#empname").focus();

    disableCtrl(true);
    disableNav(true);

    $("#reset").prop("disabled", false);
    $("#change").prop("disabled", false);

}

function changeData() {
    $("#change").prop("disabled", true);
    var jsonReq = validateData();

    var updateReq = createUPDATERecordRequest(connToken, jsonReq, empDbName, empRelName, getCurrRec());
    jQuery.ajaxSetup({async: false});
    var respObj = executeCommandAtGivenBaseUrl(updateReq, jpdbBaseUrl, jpdbIML);
    jQuery.ajaxSetup({async: true});

    resetForm();
    $("#empid").focus();
    $("#edit").focus();
}

function checkForNoOrOneRec() {
    if (noRecord()) {
        console.log("norec");
        disableCtrl(true);
        disableNav(true);
        disableForm(true);
        $("#new").prop("disabled", false);
        return;
    }
    if (oneRecord()) {
        console.log("onerec");
        disableCtrl(true);
        disableNav(true);
        disableForm(true);
        $("#new").prop("disabled", false);
        $("#edit").prop("disabled", false);
        return;
    }
}

function getFirst() {
    var getFirstReq = createFIRST_RECORDRequest(connToken, empDbName, empRelName);
    jQuery.ajaxSetup({async: false});
    var getFirstResp = executeCommandAtGivenBaseUrl(getFirstReq, jpdbBaseUrl, jpdbIRL);
    console.log(getFirstResp);
    showData(getFirstResp);
    setFirstRec(getFirstResp);
    jQuery.ajaxSetup({async: true});


    $("#empid").prop("disabled", true);
    $("#save").prop("disabled", true);
    $("#prev").prop("disabled", true);
    $("#first").prop("disabled", true);

    $("#next").prop("disabled", false);
}

function getPrev() {
    if (getCurrRec() === getFirstRec()) {
        $("#first").prop("disabled", true);
        $("#prev").prop("disabled", true);
    }

    var getReq = createPREV_RECORDRequest(connToken, empDbName, empRelName, getCurrRec());

    console.log("getprev 1");
    jQuery.ajaxSetup({async: false});
    var getResp = executeCommandAtGivenBaseUrl(getReq, jpdbBaseUrl, jpdbIRL);
    showData(getResp);
    setCurrRec(getResp);
    jQuery.ajaxSetup({async: true});

    console.log("getprev 2 resp");

    console.log(getResp);

    
    if (getCurrRec() === getFirstRec()) {
        $("#first").prop("disabled", true);
        $("#prev").prop("disabled", true);
    }

    console.log("getprev3");
    $("#save").prop("disabled", true);
}

function getNext() {
    var r = getCurrRec();

    var getReq = createNEXT_RECORDRequest(connToken, empDbName, empRelName, r);

    jQuery.ajaxSetup({async: false});
    var getResp = executeCommand(getReq, jpdbIRL);
    setCurrRec(getResp);
    jQuery.ajaxSetup({async: true});

    showData(getResp);
    $("#save").prop("disabled", true);
}

function getLast() {
    var getLastReq = createLAST_RECORDRequest(connToken, empDbName, empRelName);

    jQuery.ajaxSetup({async: false});
    var getLastResp = executeCommand(getLastReq, jpdbIRL);
    jQuery.ajaxSetup({async: true});


    console.log(getLastResp);
    showData(getLastResp);
    setLastRec(getLastResp);
    $("#empid").prop("disabled", true);
    $("#save").prop("disabled", true);
    $("#prev").prop("disabled", false);
    $("#first").prop("disabled", false);

    $("#next").prop("disabled", true);
    $("#last").prop("disabled", true);
}

function pageLoadFunction() {
    console.log("pageLoadFunction 1");
    initEmpForm();
    console.log("pageLoadFunction 2");
    getFirst();
    console.log("pageLoadFunction 3");
    getLast();
    console.log("pageLoadFunction 4");
    checkForNoOrOneRec();
    console.log("pageLoadFunction 5");
    $("#empid").focus();
}