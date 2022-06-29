/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var myStatus = "";
var myName = "";

function loadHeader() {
    $("#myHeader").load("resources/header.html");
    currentTab();

//    loadName();
}

function deleteSession() {

    localStorage.clear();

    window.location.href = "login.html";
}

function checkSession() {
    if (localStorage.getItem("mail") === null) {
        console.log("alert");
        window.location.href = "login.html";
    }
    return;
}

function loadFooter() {
    $("#myFooter").load("resources/footer.html");
    currentTab();
//    loadName();
}

//function loadName(){
//    var mail = localStorage.getItem("mail");
//    console.log(mail);
//    document.getElementById("myUser").innerText = mail;
//    return;
//}

function currentTab() {
    if (myName === "home") {
        $("#myHome").prop("class", "active");
    } else if (myName === "profile") {
        $("#myProfile").prop("class", "active");
    } else if (myName === "change") {
        $("#myChange").prop("class", "active");
    } else if (myName === "form") {
        $("#myForm").prop("class", "active");
    }
    return;
}