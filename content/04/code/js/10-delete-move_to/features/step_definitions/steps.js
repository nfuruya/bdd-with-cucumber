const { Given, When, Then, Before } = require('@cucumber/cucumber')
const { assertThat, is } = require('hamjest')

const { Person, Network } = require('../../src/shouty')

Before(function () {
  this.network = new Network()
})

Given('a person named Lucy', function () {
  this.lucy = new Person(this.network)
})

Given('a person named Sean', function () {
  this.sean = new Person(this.network)
})

When('Sean shouts {string}', function (message) {
  this.sean.shout(message)
  this.messageFromSean = message
})

Then('Lucy should hear Sean\'s message', function () {
  assertThat(this.lucy.messagesHeard(), is([this.messageFromSean]))
})
