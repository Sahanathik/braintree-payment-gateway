const express = require('express');
const cors = require('cors')
require('dotenv').config()
const braintree = require('braintree')
const bodyparser = require('body-parser')

const app = express();
app.use(cors());

app.use(express.json());

const config = {
    environment:braintree.Environment.Sandbox,
    merchantId:process.env.merchantid,
    publicKey:process.env.publickey,
    privateKey:process.env.privatekey
}

const gateway = new braintree.BraintreeGateway(config)

app.get('/token', async(req,res)=>{
    try {
        gateway.clientToken.generate({}, (err,response)=>{
            if(err){
                console.log("err", err)
            } else {
                return res.json({'status':'success', 'message':response})
            }
        })
    } catch (error) {
        return res.json({'error':err.message})
    }

})

app.post('/transaction', (req,res)=>{

    console.log(req.body)
    try {
        const paymentDetail = gateway.transaction.sale({
            amount:req.body.amount,
            paymentMethodNonce:req.body.paymentMethodNonce,
            options:{
                submitForSettlement:true
            }
        },(err, response)=>{
            if(response.success){
                return res.json({'status':'success', 'message': response.transaction})
            }else{
                return res.send({err:err})
            }
        })
    } catch (error) {
        console.log("error", error)
    }
   
})

app.post("/")
app.listen(4000, ()=>{
    console.log("server running on 4000....")
})
