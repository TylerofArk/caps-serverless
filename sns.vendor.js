'use strict';

const { Consumer } = require('sqs-consumer');
const AWS = require('aws-sdk');

AWS.config.update({ region: 'us-east-2' });

const message = process.argv[2];
const sns = new AWS.SNS();
const topic = 'arn:aws:sns:us-east-2:112727125534:pickup';

const payload = {
  Message: message,
  TopicArn: topic,
}

sns.publish(payload).promise()
  .then(data => console.log(data))
  .catch(err => console.log(err));

const app = Consumer.create({
  queueUrl: 'https://sqs.us-east-2.amazonaws.com/112727125534/delivery-confirmation.fifo',
  handleMessage: (data) => {
    let body = JSON.parse(data.Body);
    console.log('Message Received: ', body);
  }
});

app.start();