
import React, { useEffect, useState } from "react";
import axios from 'axios';
import DropIn from 'braintree-web-drop-in-react';
function Payment(){

    const [pay,setPay] = useState({
        clientToken : null,
        error:"",
        success : "",
        instance : ""
    });

    const {clientToken, instance}=pay

    useEffect(()=>{
        axios.get('http://localhost:4000/token').then((data)=>{
            console.log(data.data.message.clientToken)
            setPay({clientToken : data.data.message.clientToken})
        }).catch( error =>{
            console.log(error)
        })
    },[])

    const transaction =()=>{
        try {
            instance.requestPaymentMethod().then((data)=>{
                console.log('nonce',data)
                console.log('paymentNonce', data.nonce)
                if(data){
                    let res={
                        amount:100,
                        paymentMethodNonce:data.nonce
                    }
                    axios.post('http://localhost:4000/transaction',res).then(paymentData=>{
                        console.log(paymentData)
                        
                    }).catch(err=>{
                        console.log("err", err.message)
                    })
                }
            })
        } catch (error) {
            console.log("error", error)
        }
    }

 
    return(
        <>
        <h1>Payment Details</h1>
        {clientToken && (
            <div>
                <DropIn
                    options={{authorization: clientToken}}
                    onInstance={(instance)=>setPay({...pay, instance:instance})}
                />
                
                    <button className="btn btn-primary" onClick={()=>transaction()}>buy</button>

            </div>
        )}
        </>
    )
}

export default Payment