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
      const a = await (request.post('/room'))
      assert.equal(a.statusCode, 401)
    });


    it('should be retrievable', async function () {
      const a = await request.get('/token');
      const cookies = parseCookieArray(a.headers['set-cookie']);
      const auth_cookies = [
        `user_id=${cookies['user_id']}`,
        `token=${cookies['token']}`
      ]

      const b = await request
        .post('/room')
        .set('Cookie', auth_cookies)
        .expect(200);

      const room_id = b.body.id
      const c = await request
        .get(`/room/${room_id}`)
        .set('Cookie', auth_cookies)
        .expect(200);
      assert.equal(c.body.id, room_id)
    })
  });
});
