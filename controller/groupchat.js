const Usergroup = require('../models/usergroup');

exports.getgroupuser=async (req,res,next)=>{
    try{
        const grpusers=await Usergroup.findAll({where:{groupId:req.query.groupid}});
        res.status(201).json({message: 'Succesfully sent grptext',grpusers:grpusers});
      }     
    catch(err){
      console.log("err>>>>>>>>>>>>>>>>",err);
       res.status(500).json({
          error: err
       })
    }
 }
 exports.removeuser=async (req,res,next)=>{
    try{
       const members=req.body.members;
       const admin=await Usergroup.findAll({where:{groupId:req.body.grpId,signupId:req.user.id}});
       if(admin[0].admin){
          for (const member of members) {
 
         const user= await Usergroup.findAll({where:{groupId:req.body.grpId,name:member}});
         if(user.length>0){
          await Usergroup.destroy({where:{groupId:req.body.grpId,name:member}});
         }
         else{
         return res.status(200).json({message: `${member} is not member of this group ` });
 
         }
       }
       res.status(201).json({ success: true, message: 'Member successfully removed from group' });
 
    }
    else{
       res.status(202).json({ success: false, message: ' You are not admin of the group,you can not remove user from the group' });
 
    }
    }
    catch(err){
       console.log("err>>>>>>>>>>>>>>>>",err);
        res.status(500).json({
           error: err
        })
     }
  }
 
 
  exports.makememberadmin=async (req,res,next)=>{
    try{
       const members=req.body.members;
       const admin=await Usergroup.findAll({where:{groupId:req.body.grpId,signupId:req.user.id}});
       if(admin[0].admin){
          for (const member of members) {
 
         const user= await Usergroup.findAll({where:{groupId:req.body.grpId,name:member}});
         if(user){
          if(user.admin){
             return res.status(204).json({message: `${member} is already admin of this group ` });
 
          }
          else{
 
             await Usergroup.update(
                { admin: true },
                { where: { groupId: req.body.grpId, name: member } }
              );}
         }
         else{
         return res.status(200).json({message: `${member} is not member of this group ` });
 
         }
       }
       res.status(201).json({ success: true, message: 'Selected members are admin now' });
 
    }
    else{
       res.status(202).json({ success: false, message: ' You are not admin of the group,you can not make user admin' });
 
    }
    }
    catch(err){
       console.log("err>>>>>>>>>>>>>>>>",err);
        res.status(500).json({
           error: err
        })
     }
    }