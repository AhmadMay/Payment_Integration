const express = require('express');
const paypal =  require('paypal-rest-sdk');

    paypal.configure({
        'mode':'sandbox',
        'client_id': 'AVmytjhKwf9sQgn5EFizDVab4Ev6c-G6gaQUoF9HVAMmTB39IHmvQ1AfctUzvMjPNhifY8DC3p1OorOM',
        'client_secret': 'ELXyuGrRZqhkseaNsJsj0j9aMuWP8dthJx2tnMjvSPtViXB9dAq0Dt-xsbLlBOLScuKoJ7No9s5aS4tn'
    });

const app = express();

app.get('/', (req,res)=>{
    res.sendFile(__dirname +'/index.html' );

})

app.post('/pay', (req, res) => {
    const create_payment_json = {
      "intent": "sale",
      "payer": {
          "payment_method": "paypal"
      },
      "redirect_urls": {
          "return_url": "http://localhost:5000/success",
          "cancel_url": "http://localhost:5000/cancel"
      },
      "transactions": [{
          "item_list": {
              "items": [{
                  "name": "leather shoe ",
                  "sku": "001",
                  "price": "25.00",
                  "currency": "USD",
                  "quantity": 1
              }]
          },
          "amount": {
              "currency": "USD",
              "total": "25.00"
          },
          "description": "Hat for the best team ever"
      }]
  };
  app.get('/success', (req, res) => {
    const payerId = req.query.PayerID;
    const paymentId = req.query.paymentId;
  
    const execute_payment_json = {
      "payer_id": payerId,
      "transactions": [{
          "amount": {
              "currency": "USD",
              "total": "25.00"
          }
      }]
    };
  
    paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
      if (error) {
          console.log(error.response);
          throw error;
      } else {
          console.log(JSON.stringify(payment));
          res.send('Success');
      }
  });
  });
    paypal.payment.create(create_payment_json, function (error, payment) {
        if (error) {
            throw error;
        } else {
            for(let i = 0;i < payment.links.length;i++){
              if(payment.links[i].rel === 'approval_url'){
                res.redirect(payment.links[i].href);
              }
            }
        }
      });
      
      });
  app.get('/cancel', (req, res) => res.send('Cancelled'));
  
  





let port = 5000;
app.listen(port, ()=> console.log(`app is listening to the port ${port}`)
);
