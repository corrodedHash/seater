import { describe, it } from 'mocha'
import startApp from './server.mjs'
import supertest from 'supertest'
import { assert } from 'chai';


function parseCookieArray( /** @type string[] */ cookies) {
  const header_regex = /(?<cookie_name>[\w-]+)=(?<cookie_value>[\w-]+);/;
  const c = cookies.map((v) => {
    const m = v.match(header_regex)
    return { [m.groups['cookie_name']]: m.groups['cookie_value'] }
  })
  return Object.assign({}, ...c)
}

describe('Rooms', function () {
  describe('Create room', function () {
    const app = startApp()
    const request = supertest(app)

    it('should require authentication', async function () {
      const a = await request.post('/room')
      assert.equal(a.statusCode, 401)
    });


    it('should be retrievable', async function () {
      const agent = supertest.agent(app)
      const a = await agent.get('/token');

      const b = await agent
        .post('/room')
        .expect(200);

      const room_id = b.body.id
      const c = await agent
        .get(`/room/${room_id}`)
        .expect(200);
      assert.equal(c.body.id, room_id)

    })
  });

  describe('Join room', function () {
    const app = startApp()
    const request = supertest(app)

    it('should work', async function () {
      const creator_agent = supertest.agent(app)
      const joiner_agent = supertest.agent(app)

      await creator_agent.get('/token')
      const { userid: joiner_id } = await joiner_agent.get('/token')
        .then(v => parseCookieArray(v.headers['set-cookie']))
        .then(v => ({ userid: v['user_id'] }))

      const room_id = await creator_agent
        .post('/room')
        .expect(200)
        .then(v => v.body.id);

      await joiner_agent
        .get(`/room/${room_id}`)
        .expect(404);

      await joiner_agent
        .put(`/room/join/${room_id}`)
        .expect(200);

      await creator_agent
        .put(`/room/${room_id}/accept/${joiner_id}`)
        .expect(200);

      await joiner_agent
        .get(`/room/${room_id}`)
        .expect(200);

    })
  });
});
