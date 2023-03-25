const Chat = require('../models/chat');
const { Op } = require('sequelize');
const AWS=require('aws-sdk');

exports.postchat = async (req, res, next) => {
    try {
        await Chat.create({
            message: req.body.text,
            signupId: req.user.id,
            signupName: req.user.name,
            groupId: req.query.groupid,
            time: new Date().getTime(),
        })
        res.status(201).json({ message: 'Succesfully sent text' });
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ message: err, success: false })
    }
}


exports.getchat = async (req, res, next) => {
    try {
        const currentTime = req.query.currenttime;
        const groupId = req.query.groupid || null; // set groupId to null if it is not provided in the query params
        const messages = await Chat.findAll({
            where: {
                time: {
                    [Op.gt]: currentTime
                },
                groupId: groupId
            }
        });
        res.status(201).json({ success: true, message: messages });
    }
    catch (err) {
        res.status(500).json({ message: err, success: false })
    }
}

function uploadToS3(file){

    const BUCKET_NAME= process.env.AWS_BUCKET_NAME;
    const IAM_USER_KEY= process.env.AWS_KEY_ID;
    const  IAM_USER_SECRET= process.env.AWS_SECRET_KEY;

    let s3bucket=new AWS.S3({
        accessKeyId: IAM_USER_KEY,
        secretAccessKey:IAM_USER_SECRET,
    })
     let params={
            Bucket:BUCKET_NAME,
            Key:file.name,
            Body:file.data,
            ContentType:file.mimetype,
            ACL:'public-read'
        }
       return new Promise((resolve, reject) => {
            s3bucket.upload(params,(err,s3response)=>{
                if(err){
                    console.log("SOMETHING WENT WRONG",err)
                    reject(err);
                } 
                else{
                    resolve(s3response.Location)
                    }
                })
       })      
}

exports.uploadFile=async(req,res,next)=>{
    try{
        const groupId=req.params.groupId;
        console.log(">>>>>>>",req.files.file);
        const file=req.files.file;
        const fileName=file.name;
        const fileURL= await uploadToS3(file);
        console.log(fileURL);
        const user = await req.user.createChat({username:req.user.username,message:fileURL,groupId:groupId});
        res.status(200).json({message:user,success:true})
    }catch(err){
        console.log(">>>>>>>>>>>>>>>",err);
        res.status(500).json({message:"Something went Wrong",error:err,success:false})
    }}