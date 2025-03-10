/**
 * @typedef {Object} Pairing
 * @property {string[]} players
 * @property {number} ending
 */

/**
    @typedef {Object} SwissRound
    @property {Pairing[]} pairings
*/

export class SwissTournament {
    /** @type {string[]} */
    #players;

    /** @type {SwissRound[]} */
    rounds;

    /**
     * @param {string[]} players
     */
    constructor(players) {
        this.#players = players;
        this.rounds = []
    }

    rivals() {
        /**  @type {Record<string, string[]>} */
        const result = Object.assign(
            {},
            ...this.#players.map((v) => ({ [v]: [] }))
        );
        const addRival = (
      /** @type {string} */ player,
      /** @type {string} */ rival
        ) => {
            if (!(player in result)) {
                result[player] = [];
            }
            result[player].push(rival);
        };
        const recordMatch = (
      /** @type {string} */ player1,
      /** @type {undefined | string} */ player2
        ) => {
            if (player2 === undefined) {
                return;
            }
            addRival(player1, player2);
            addRival(player2, player1);
        };
        this.rounds
            .flatMap((v) => v.pairings)
            .forEach((v) => recordMatch(...v.players));
        return result;
    }

    standings() {
        const standing_template = () => {
            /** @type {Record<string, number>} */
            const result = Object.assign(
                {},
                ...this.#players.map((v) => ({ [v]: 0 }))
            );
            return result;
        };

        const rounds = this.rounds.map((round) => {
            const result = standing_template();

            const updates = round.pairings.flatMap((v) => {
                if (v.players.length < 1) {
                    console.warn("Pairing with 0 players recorded");
                    return [];
                }
                if (v.players.length === 1) {
                    return [{ player: v.players[0], score: v.ending }];
                }
                if (v.players.length === 2) {
                    return [
                        { player: v.players[0], score: v.ending },
                        { player: v.players[1], score: 1 - v.ending },
                    ];
                }
                console.warn("Pairing with more than 2 players, ignoring");
                return [];
            });

            for (const u of updates) {
                result[u.player] += u.score;
            }
            return result;
        });
        const global = standing_template();
        for (const round of rounds.flat()) {
            for (const [player, score] of Object.entries(round)) {
                global[player] += score;
            }
        }
        return { global, rounds };
    }

    /**
     * @param { Record<string, number> } standings
     */
    buchholz(standings) {
        // TODO: [IMPORTANT]: weigh the rival score with the score in the match. If we won by 0.25 against them, only count they score by 0.25
        // We do not want to count losses against rivals
        const sum = (/** @type {number} */ a, /** @type {number} */ b) => a + b;
        const r = this.rivals();
        return Object.assign(
            {},
            ...this.#players.map((v) => ({ [v]: 0 })),
            ...Object.keys(standings).map((v) => {
                return { [v]: r[v].map((q) => standings[q]).reduce(sum, 0) };
            })
        );
    }

    /**
     * @param {Record<string, number>} standings
     * @param {Record<string, number>} buchholz
     */
    ranking(standings, buchholz) {
        const result = [...this.#players];
        return result.sort((a, b) => {
            const result = standings[b] - standings[a];
            if (result === 0) {
                return buchholz[b] - buchholz[a];
            }
            return result;
        });
    }

    next_pairings() {
        const r = this.rivals();
        const hasLoner = (this.#players.length % 2) === 1
        const { global: s } = this.standings();
        const b = this.buchholz(s);
        const initial = this.ranking(s, b);

        const searcher = new BacktrackingSearch((/** @type {any[]} */ v) => {
            if (hasLoner) {
                if (v.length === 0) {

                    const previous_loners = this.rounds
                        .flatMap((v) => v.pairings)
                        .filter((v) => v.players.length === 1)
                        .map((v) => v.players[0]);
                    return initial.toReversed().filter(q => !previous_loners.includes(q))
                }
            }
            const { candidates, chosen } = (() => {
                if (hasLoner) {

                    const loner = v[0]
                    const unlonely_candidates = initial.filter(q => q !== loner)
                    const unlonely_chosen = v.slice(1)
                    return { candidates: unlonely_candidates, chosen: unlonely_chosen }
                } else {
                    return { candidates: initial, chosen: v }
                }
            })()
            if (v.length === candidates.length) {
                return 'done'
            }
            // If the candidates are even, so far everyone found a pairing, and we just return the remaining available candidates
            if (v.length % 2 === 0) {
                return candidates.filter(q => !chosen.includes(q))
            }

            const last_candidate = chosen[chosen.length - 1]
            return candidates
                // find matches which are lower in the ranking than the last candidate, since the order in the pairings does not matter
                .slice(candidates.indexOf(last_candidate) + 1)
                // remove already chosen candidates
                .filter(q => !chosen.includes(q))
                // also, do not select a previous rival of the candidate
                .filter(q => !r[q].includes(last_candidate))
        })

        const p = searcher.solve()
        return Object.values(
            Object.groupBy(
                p.toReversed(),
                (_, i) => Math.floor(i / 2)
            )
        )
    }
}

class BacktrackingSearch {
    /** @type {any[][]} */
    #nodes
    #step

    /**
     * @param {any} step
     */
    constructor(step) {
        this.#nodes = []
        this.#step = step
    }

    #backtrack() {
        if (this.#nodes.length === 0) {
            return
        }
        const last_node = this.#nodes[this.#nodes.length - 1]
        last_node.shift()
        if (last_node.length === 0) {
            this.#nodes.pop()
            this.#backtrack()
        }
    }
    #currentSolution() {
        return this.#nodes.map(v => v[0])
    }

    solve() {
        this.#nodes.push(this.#step([]))
        while (this.#nodes.length > 0) {
            // console.dir(this.#nodes)
            const s = this.#step(this.#currentSolution())
            if (s === 'done') {
                return this.#currentSolution()
            } else if (s === undefined || s.length === 0) {
                this.#backtrack()
            } else {
                this.#nodes.push(s)
            }
        }
    }
}
