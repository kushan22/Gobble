const express = require('express');
const db = require('../config/database_conn');

const router = express.Router();

module.exports = () => {
    router.get('/',(req,res,next) => {
        return res.send("Hello Gobble World");
    });

    router.post('/register',(req,res,next) =>{
        const firstName = req.body.firstName.trim();
        const lastName = req.body.lastName.trim();
        const email = req.body.email.trim();
        const password = req.body.password.trim();

        const fullName = firstName + " " + lastName;

        const sql = "INSERT INTO users (fullname,email,password) VALUES ('" + fullName + "', '" + email + "', '" + password + "')";
        db.query(sql, (err,result) => {
            if (err){
                console.log(err);
                return res.json({ success : "false"});
            }else{
                console.log("Registered")
                return res.json({ success: "true"});
            }
        });

    });

    router.post("/login",(req,res,next) => {
        const email = req.body.email.trim();
        const password =req.body.password.trim();

        db.query("SELECT * from users where email='" + email + "' and password='" + password + "'",
        (err,result) => {
            if (result.length == 0){
                return res.json({
                    "success":"false",
                    "fullName":"",
                    "uid":""
            })
            }else{
                return res.json({
                    "success":"true",
                    "fullname":result[0].fullname,
                    "uid":result[0].uid
                })
            }
        });
    });

    router.post("/savePreferences",(req,res,next) => {
        const likes = req.body.likes.trim();
        const dislikes = req.body.dislikes.trim();
        const considerations = req.body.considerations.trim();
        const userid = req.body.userid.trim();

        const sql = "INSERT INTO userPreferences(uid,likes,dislikes,considerations) VALUES('" + userid + "', '" + likes + "', '" + dislikes + "','" + considerations +"')";
        db.query(sql, (err,result) => {
            if (err){
                console.log(err);
                return res.json({ success : "false"});
            }else{
                console.log("Registered")
                return res.json({ success: "true"});
            }
        });


    });

    router.get('/getPreferences',(req,res,next) => {
        const userid = req.query.userid.trim();

        db.query("SELECT * from userPreferences where uid='"+ userid +"'",
            (err,result) => {
                if (result.length == 0){
                    return res.json({
                        "success":"false",
                        "likes":"",
                        "dislikes":"",
                        "considerations":""    
                    });
                }else{
                    return res.json({
                        "success":"true",
                        "likes":result[0].likes,
                        "dislikes":result[0].dislikes,
                        "considerations":result[0].considerations
                    });
                }
            }
        )
    });

    router.get('/getUsers',(req,res,next) =>{
        const userid = req.query.userid.trim();

        db.query("SELECT uid,fullname from users where uid != '"+ userid +"' and uid not in (SELECT uid1 from friends) and uid not in (Select uid2 from friends)",
        (err,result) => {
            if (result.length == 0){
                return res.json({
                    "success":"false",
                    "fullname":"",
                    "uid":""   
                });
            }else{
                var allUsers = []
                for (var i = 0; i < result.length; i++){
                    allUsers.push({
                        fullName: result[i]['fullname'],
                        uid:result[i]['uid']
                    });
                }

                return res.json({
                    "users":allUsers
                });
                
                
            }
        }
    )

    });

    router.post('/sendFriendRequest',(req,res,next) => {
        var user1 = req.body.user1id.trim();
        var user2 = req.body.user2id.trim();

        friendReqStatus = 1;

        var friend_sql = "INSERT INTO friends(uid1,uid2,status) VALUES('" + user1 + "', '" + user2 +"', '" + friendReqStatus + "')";
        db.query(friend_sql, (err,result) => {
            if (err){
                console.log(err);
                return res.json({ success : "false"});
            }else{
                console.log("Friend Request Sent")
                return res.json({ success: "true"});
            }
        });


    });

    router.get('/getFriendRequests',(req,res,next) => {
        const userId = req.query.userid.trim();
        db.query("SELECT uid,fullname from users where uid in (select uid1 from friends where status=1 and uid2='" + userId + "')",
            (err,result) => {
                if (result.length == 0){
                    return res.json({
                        "success":"false",
                        "fullname":"",
                        "uid":""   
                    });
                }else{
                    var allUsers = []
                    for (var i = 0; i < result.length; i++){
                        allUsers.push({
                            fullName: result[i]['fullname'],
                            uid:result[i]['uid']
                        });
                    }
    
                    return res.json({
                        "success":"true",
                        "users":allUsers
                    });
                    
                    
                }
            }
        )
    });

    router.get('/acceptFriendReq',(req,res,next) => {
        const userId = req.query.userid.trim();
        const friendId = req.query.friendid.trim();
        friendStatus=2;

        const sql = "UPDATE friends set status='" + friendStatus + "' where uid2 = '" + userId +"' and uid1 = '" + friendId + "'";
        db.query(sql, (err,result) => {
            if (err){
                console.log(err);
                return res.json({ success : "false"});
            }else{
                console.log("Friend Request Sent")
                return res.json({ success: "true"});
            }
        });

    });

    router.get('/getFriendList',(req,res,next) => {
        const userId = req.query.userid.trim();
        db.query("SELECT uid,fullname from users where uid in (select uid1 from friends where status=2 and uid2='" + userId + "') or uid in (SELECT uid2 from friends where status=2 and uid1='" + userId + "')",
            (err,result) => {
                if (result.length == 0){
                    return res.json({
                        "success":"false",
                        "fullname":"",
                        "uid":""
                        
                    });
                }else{
                    var allUsers = []
                    for (var i = 0; i < result.length; i++){
                        allUsers.push({
                            fullName: result[i]['fullname'],
                            uid:result[i]['uid']    
                        });
                    }
    
                    return res.json({
                        "success":"true",
                        "users":allUsers
                    });
                    
                    
                }
            }
        )

    });

    router.post('/addTripDetails',(req,res,next) => {
        const userid = req.body.userid.trim();
        const groupIds= req.body.groupids.trim();
        const cityName = req.body.cityName.trim();
        const fromDate = req.body.fromDate.trim();
        const toDate = req.body.toDate.trim();

        const sql = "INSERT INTO tripdetails (uid,groupids,cityname,startdate,todate) VALUES ('" + userid + "', '" + groupIds + "', '" + cityName + "', '" + fromDate + "', '" + toDate +"')";
        db.query(sql,(err,result) => {
            if (err){
                console.log(err);
                return res.json({ success : "false"});
            }else{
                console.log("Friend Request Sent")
                return res.json({ success: "true"});
            }
        });

    });


    router.get('/getTripDetails',(req,res,next) => {
        const userid = req.query.userid.trim();

        db.query("SELECT * from tripdetails where uid ='" + userid + "'",
            (err,result) => {
                if (result.length == 0){
                    return res.json({
                        "success": "false",

                    });
                }else{
                    var tripDetails = [];
                    for (var i = 0; i < result.length; i++){
                        var date = result[i].startdate + "-" + result[i].todate; 
                        tripDetails.push({
                            tripCity: result[i].cityname,
                            date:date

                        });
                    }

                    return res.json({
                        "success":"true",
                        "tripdetails":tripDetails
                    });
                }
            }
        )
    });

    return router;
};