import { describe, it } from "mocha";
import { assert } from "chai";
import { SwissTournament } from "./swiss.mjs";

describe("Swiss Tournament", function () {
  describe("Fresh pairing", function () {
    const players = [..."abcdefgh"];
    const t = new SwissTournament(players);

    it("has no rivals", () => {
      /** @type {Record<string, string[]>} */
      const expected = Object.assign(
        {},
        ...players.map((v) => {
          return { [v]: [] };
        })
      );
      assert.deepEqual(t.rivals(), expected);
    });

    it("has normalized standings", () => {
      const expected = Object.assign(
        {},
        ...players.map((v) => {
          return { [v]: 0 };
        })
      );
      assert.deepEqual(t.standings().global, expected);
    });

    it("generates some kind of pairing", () => {
      const r = t.next_pairings();
      assert.deepEqual(
        r.map((v) => v.length),
        [2, 2, 2, 2]
      );
      assert.deepEqual(r.flat().toSorted(), players);
    });
  });

  describe("In-progress game", function () {
    const players = [..."abcdefgh"];
    const t = new SwissTournament(players);
    t.rounds.push({
      pairings: [
        { players: ["a", "b"], ending: 0, },
        { players: ["c", "d"], ending: 0.75, },
        { players: ["e", "f"], ending: 0.25, },
        { players: ["g", "h"], ending: 1, },
      ],
    }, {
      pairings: [
        { players: ["g", "b"], ending: 0, },
        { players: ["c", "f"], ending: 0.75, },
        { players: ["e", "d"], ending: 0.25, },
        { players: ["a", "h"], ending: 1, },
      ],
    });

    it('has rivals', function () {
      const r = t.rivals();
      assert.deepEqual(r['a'].toSorted(), ['b', 'h']);
    })

    it('has standings', function () {
      const s = t.standings();
      assert.equal(s.global['a'], 1)
      assert.equal(s.global['e'], 0.5)
    })

    it("generates some kind of pairing", () => {
      const r = t.next_pairings();
      assert.deepEqual(
        r.map((v) => v.length),
        [2, 2, 2, 2]
      );
      assert.deepEqual(r.flat().toSorted(), players);
    });
  });
});
