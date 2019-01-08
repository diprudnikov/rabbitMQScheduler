'use strict';

const Sequelize = require('sequelize');
const CommentModel = require('./models/Comment');
const amqp = require('amqplib/callback_api');
const AMPQ_URL = 'amqp://zwousfrg:7wkM11gLX4gYjNGYMRtpcsJqzwHW3YUp@shark.rmq.cloudamqp.com/zwousfrg';
const QUEUE_NAME = 'Hello World Queue';

const sequelize = new Sequelize('databaselab3', 'diprudnikov', '12345678', {
    host: 'db4free.net',
    dialect: 'mysql',
    pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

const Comment = CommentModel(sequelize, Sequelize);

sequelize.sync({ force: true })
    .then(() => {
       Comment.create({
            text: 'Hello World!',
       });
       connectToScheduler();
    });

function connectToScheduler() {
    amqp.connect(AMPQ_URL, (err, connection) => {
        connection.createChannel((err, channel) => {

            channel.assertQueue(QUEUE_NAME, { durable: false });

            setInterval(() => {
                Comment.findById(1).then(comment => {
                    const message = comment.dataValues.text;
                    channel.sendToQueue(QUEUE_NAME, Buffer.from(message));
                    console.log(`Sent message: ${message}`);
                });
            }, 5000);
        });
    });
}