import { describe, it } from 'mocha'
import { assert } from 'chai';
import { SwissTournament } from './swiss.mjs';

describe('Swiss Tournament', function () {
  describe('Fresh pairing', function () {
    const players = [..."abcdefgh"]
    const t = new SwissTournament(players)
    it("has no rivals", () => {
      /** @type {Record<string, string[]>} */
      const expected = Object.assign({},
        ...players.map(v => {
          return { [v]: [] }
        }))
      assert.deepEqual(t.rivals(), expected)
    })
    it("has normalized standings", () => {
      const expected = Object.assign({},
        ...players.map(v => {
          return { [v]: 0 }
        }))
      assert.deepEqual(t.standings().global, expected)
    })
    it("generates some kind of pairing", () => {
      console.log(t.next_pairings())
    })
  });
});
