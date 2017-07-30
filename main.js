//express_demo.js 文件
//express_demo.js 文件
    'use strict'
const express = require('express');
const bodyparser = require('body-parser');
const redis = require('redis');
const client = require('redis').createClient(6379,'127.0.0.1');
const app = express();

app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.static('public'));


client.on('connect', function() {
    console.log('connected');
});


app.get('/', function (req, res) {



    res.sendFile( __dirname+"/student.html");

});

app.post('/student',function (req,res) {
    let temp=[];
    let stu=req.body;
    temp.push(stu);
    client.get("students", function(err, val) {
        if(val){
            let students=JSON.parse(val);
            students.push(stu);
            client.set("students",JSON.stringify(students),function (err,reply) {
                    //console.log(reply);
            })

        }else {
            client.set("students",JSON.stringify(temp),function (err,reply) {
                //console.log(reply);

            })
        }
    });
    res.send("ok");

});
app.post('/student/id',function (req,res) {
    client.get("students", function(err, object) {
        let students=JSON.parse(object);
        let stu=req.body;
        for(let i=0;i<students.length;i++){
            if(students[i].id==stu.id){
                students.splice(i,1);
                break;
            }
        }
        students.push(stu);
        client.set("students",JSON.stringify(students),function (err,reply) {
            console.log("修改成功");
        })
    });
    res.send("ok");

})

app.get('/allStudent',function (req,res) {
    client.get("students", function(err, object) {
       let students=JSON.parse(object);
       res.send(students);
    });

})

app.post('/allStudent/id',function (req,res) {
    let id=req.body.id;
    console.log(id);
    client.get("students", function(err, val) {
        let students=JSON.parse(val);
        for(let i=0;i<students.length;i++){
            if(students[i].id==id){
                console.log(students[i].id);
                students.splice(i,1);
                break;
            }
        }
        client.set("students",JSON.stringify(students),function (err,reply) {
            //console.log(reply);
        })
    });
    res.send("ok");

})

/*app.get('/stuView',function (req,res) {
    let stuID=req.body.studentid;
    let stus=[];
    for(let i=0;i<stuID.length;i++){
        client.hgetall(stuID[i], function(err, object) {
            stus.push(object);
        });
    }
    res.send(stus);


})*/
/*app.post('/index',urlencodedParser,function (req,res) {
    var stu=new Student(req.body.name,req.body.id,req.body.nation,req.body.klass,req.body.math,req.body.chinese,req.body.english,req.body.code);
    client.hmset(stu.id,stu);
    res.sendFile( __dirname+"/"+"index.html");

    /*client.hgetall(stu.id, function(err, object) {
        console.log(object);
        res.send(JSON.stringify(object)) ;
    });


})*/

var server = app.listen(8081, function () {

    var host = server.address().address;
    var port = server.address().port;


    console.log("应用实例，访问地址为 http://%s:%s", host, port)

})
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


