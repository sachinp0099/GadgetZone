let mailer =require('nodemailer')

function mail(mailoption)
{
    return new Promise((res,rej)=>{
        let transporter = mailer.createTransport({
            host:'smtp.gmail.com',
            port:465,
            secure:true,
            auth:{user:'jackspndy0099@gmail.com',
                   pass:'gepf ddkg vswc mmcj'}
        })
        transporter.sendMail(mailoption,(err,info)=>{
            if(err)
            {
                return rej(err)
            }
            return res(`mail is send to ${mailoption.to}`)
        })
    })
}

module.exports={mail}