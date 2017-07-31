"use strict"
$(document).ready(function () {
    //添加学生
    $("#sendStu").on('click',function () {

        let name=$('#name').val();
        let id=$('#id').val();
        let nation=$('#nation').val();
        let klass=$('#klass').val();
        let chinese=$('#chinese').val();
        let math=$('#math').val();
        let english=$('#english').val();
        let code=$('#code').val();

        if((name=='')||(id=='')||(nation=='')||(klass=='')||(chinese=='')||(math=='')||(english=='')||(code=='')){
            alert("您输入的信息不完整");
        }else {
            $.get('/allStudent',function (ans) {
                let students=ans;
                let find=0;
                for(let i=0;i<students.length;i++){
                    if(students[i].id==id){
                        find=1;
                        break;
                    }
                }



                if(find==0){


                    let newStu=new Student(name,id,nation,klass,math,chinese,english,code);
                    $.post('/student',newStu,function (ans) {
                        // alert(JSON.stringify(newStu));
                    });
                    alert(`学生${newStu.name}的成绩已成功添加`)


                }else {
                    alert(`请不要重复添加学生${name}`);
                }
            });
        }



        //alert(code);


    })
    //查找学生
    $("#search").on('click',function () {
        $("#stuTable").empty();
        $("#stuTable").append(`<tr><td>姓名</td><td>语文成绩</td><td>数学成绩</td><td>英语成绩</td><td>编程成绩</td><td>平均分</td><td>总分</td></tr>`);

        $.get('/allStudent',function (ans) {
            let students=ans;
            let sumarray=[];
            let find=0;
            let stuIds=$('#check').val().split(' ');
            for(let i=0;i<students.length;i++){
                if(stuIds.indexOf(students[i].id)>=0){
                    sumarray.push(calSum(students[i]));
                    $('#stuTable').append(addStu(students[i]));
                    find=1;
                }
            }
            if(find=1){
                let summid=calSumMid(sumarray);
                let sumave=calSumAve(sumarray);
                let str='';
                str+=`<tr><td colspan="2">总分中位数</td><td colspan="5">${summid}</td></tr>`
                str+=`<tr><td colspan="2">总平均分</td><td colspan="5">${sumave}</td></tr>`;
                $("#stuTable").append(str);
            }else {
                $("#stuTable").empty();
                alert("您输入的学号不存在");
            }
        });

       

        

    })
    $("#submit-change").on('click',function () {
        $("#changeTable").empty();
        $("#changeTable").append(`<tr><td>姓名</td><td>学号</td><td>民族</td><td>班级</td><td>语文成绩</td><td>数学成绩</td><td>英语成绩</td><td>编程成绩</td><td colspan="2">修改项</td></tr>`);

        $.get('/allStudent',function (ans) {
            let students=ans;
            let str;
            let find=0;

            let stuIds=$('#changeText').val().split(' ');
            for(let i=0;i<students.length;i++){
                if(stuIds.indexOf(students[i].id)>=0){
                    str+=`<tr date-stuId="${students[i].id}">`+
                        `<td><input class="input-1" type="text" value="${students[i].name}"></input></td>`+
                        `<td><input class="input-1" type="text" value="${students[i].id}"></input></td>`+
                        `<td><input class="input-1" type="text" value="${students[i].nation}"></input></td>`+
                        `<td><input class="input-1" type="text" value="${students[i].klass}"></input></td>`+
                        `<td><input class="input-1" type="text" value="${students[i].chinese}"></input></td>`+
                        `<td><input type="text" class="input-1" value="${students[i].math}"></input></td>`+
                        `<td><input type="text" class="input-1" value="${students[i].english}"></input></td>`+
                        `<td><input type="text" class="input-1" value="${students[i].code}"></input></td>`+
                        `<td><input class=" blue button"type="button" value="确认修改" id="${students[i].id}modify" ></td>`+
                        `<td><input class=" blue button"type="button" id="${students[i].id}delete"  value="确认删除" ></td></tr>`;
                    find=1;
                }
            }
            if(find==1){
                $('#changeTable').append(str);
            }else {
                $("#changeTable").empty();
                alert("您输入的学号不存在")
            }
        });


    })
    $(document).click(function(e) { // 在页面任意位置点击而触发此事件
       if(/delete/.test($(e.target).attr("id"))==true){
           e.target.parentNode.parentNode.remove();

           $.post('/allStudent/id',{id:$(e.target).attr("id").match(/\d+/g)[0]},function (ans) {
               // alert(JSON.stringify(newStu));
               alert(`成功删除该学生`);
           });
       }
       if(/modify/.test($(e.target).attr("id"))==true){
           var tdList = e.target.parentNode.parentNode;
           let name=tdList.cells[0].firstChild.value;
           let id=tdList.cells[1].firstChild.value;
           let nation=tdList.cells[2].firstChild.value;
           let klass=tdList.cells[3].firstChild.value;
           let chinese=tdList.cells[4].firstChild.value;
           let math=tdList.cells[5].firstChild.value;
           let english=tdList.cells[6].firstChild.value;
           let code=tdList.cells[7].firstChild.value;
           let student=new Student(name,id,nation,klass,math,chinese,english,code);
           $.post('/student/id',student,function (ans) {
               // alert(JSON.stringify(newStu));
               alert("修改成功");
           });






       }

    })



});

















class Student{
    constructor(name,id,nation,klass,math,chinese,english,code){
        this.name=name;
        this.id=id;
        this.nation=nation;
        this.klass=klass;
        this.math=math;
        this.chinese=chinese;
        this.english=english;
        this.code=code;
    }
}
function addStu(student) {
    let stuStr='';
    stuStr=`<tr><td>${student.name}</td>`+

        `<td>${student.chinese}</td>`+
        `<td>${student.math}</td>`+
        `<td>${student.english}</td>`+
        `<td>${student.code}</td>`+
        `<td>${calAvg(student)}</td>`+
        `<td>${calSum(student)}</td></tr>`;
    return stuStr;

}
function calSum(student) {
    return parseFloat(student.chinese)+parseFloat(student.math)+parseFloat(student.english)+parseFloat(student.code);
}
function calAvg(student) {
    return (parseFloat(student.chinese)+parseFloat(student.math)+parseFloat(student.english)+parseFloat(student.code))/4;
}





/*var express = require('express');
var bodyParser = require('body-parser');

var app = express();
var urlencodedParser = bodyParser.urlencoded({ extended: false });
app.use(express.static('public'));

var redis = require("redis");
var client = redis.createClient(6379,'127.0.0.1');
function search() {



    let inputId=document.getElementById('search').value;
    client.hgetall('7', function(err, object) {
        alert(object.name);
    });
    inputId=inputId.split(' ');
    for(let i=0;i<inputId.length;i++){
        client.hgetall(inputId[i], function(err, object) {
                addTOTable(object);
            })
    }
}

function addTOTable(student) {
    let stuStr='';
    stuStr=`<tr><td>${student.name}</td>`+
                `<td>${student.id}</td>`+
                `<td>${student.chinese}</td>`+
                `<td>${student.math}</td>`+
                `<td>${student.chinese}</td>`+
                `<td>${student.code}</td>`+
                `<td>${calAvg(student)}</td>`+
                `<td>${calSum(student)}</td></tr>`;
    $(`#table`).append(stuStr);

}

function calSum(student) {
    return parseFloat(student.chinese)+parseFloat(student.math)+parseFloat(student.english)+parseFloat(student.code);
}
function calAvg(student) {
    return (parseFloat(student.chinese)+parseFloat(student.math)+parseFloat(student.english)+parseFloat(student.code))/4;
}*/
function calSumAve(sumArray) {
    var sum=0;
    var sumAve=0;
    for(var i in sumArray){
        sum+=sumArray[i];
    }
    sumAve=sum/sumArray.length;
    return sumAve;
}
function calSumMid(sumArray) {
    var sumMid=0;
    var orderedSumArray=sumArray.slice().sort();
    if(orderedSumArray.length%2==0){
        sumMid=(orderedSumArray[orderedSumArray.length/2]+orderedSumArray[(orderedSumArray.length/2)-1])/2
    }
    else{
        sumMid=orderedSumArray[(orderedSumArray.length-1)/2];
    }
    return sumMid;
}
