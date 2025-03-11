import { describe, it } from 'mocha'
import { matches } from './matches.mjs';
import supertest from 'supertest'
import { assert } from 'chai';
import express from 'express'

function smallMatchServer() {
  const app = express()
  /** @type {Partial<import('./exchangeData').Matches>} */
  const roomMatches = { rounds: [] };

  app.use(function generateRoom(req, res, next) {
    res.locals.matches = roomMatches
    next()
  }, matches())
  return app
}

describe("Match management", function () {
  describe("Empty match", function () {
    it("Has no rounds", async () => {
      const r = await supertest(smallMatchServer()).get('/');
      assert.deepEqual(r.body.rounds, [])
    })
  })
})