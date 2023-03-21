const Usergroup = require('../models/usergroup');

exports.getgroupuser=async (req,res,next)=>{
    try{
        const grpusers=await Usergroup.findAll({where:{groupId:req.query.groupid}});
        res.status(201).json({message: 'Succesfully sent  grptext',grpusers:grpusers});
      }     
    catch(err){
      console.log("err>>>>>>>>>>>>>>>>",err);
       res.status(500).json({
          error: err
       })
    }
 }