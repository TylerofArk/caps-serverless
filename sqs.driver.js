'use strict';

const Chance = require('chance');
const chance = new Chance();
const { Consumer } = require('sqs-consumer');
const { Producer } = require('sqs-producer');

const producer = Producer.create({
  queueUrl: 'https://sqs.us-east-2.amazonaws.com/112727125534/delivery-confirmation.fifo',
  region: 'us-east-2',
});

async function confirmDelivery(data){
  let message = '';

  try {
    let body = JSON.parse(data.Body);
    console.log('SUCCESS!');
    message = body.Message;
    console.log(message);

  } catch (e){
    console.log('EPIC FAIL', e.message);
  }

  let stringifiedMessage = JSON.stringify(message);

  let payload = {
    id: 'sportySpice',
    body: stringifiedMessage,
    groupId: 'TeamSporty',
    deduplicationId: chance.guid(),
  };

  try {
    let response = await producer.send(payload);
    console.log(response);
  } catch (e) {
    console.log(e);
  }
}

const app = Consumer.create({
  queueUrl: 'https://sqs.us-east-2.amazonaws.com/112727125534/confirmed',
  handleMessage: confirmDelivery,
});

app.start();
