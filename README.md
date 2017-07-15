# hnk-jasmine

hnk-jasmine is a collection of small helper functions for testing Node.js code in Jasmine. It includes:
- co
  - modify jasmine's `it` function to accept generator function
  - silence console when `it` function is called with no function
- mock
  - this method assumes you use monk (mongodb driver) in your code
  - mock your database for e2e testing. It is fast enough to mock the whole collection for every function calls
  - add new method db.mock( collectionName: string, data... : json) : Promise
- gendoc
  - create readme.md documenting everything described by your test case
  - use this script and never have an outdated doc ever again
- supertest
  - properly print stack trace when your server-side code throw exception (and usually returns 500)
  - simplify supertest assertion by the following assumption
    - every http request would check for http status of 200 by default
    - inputing number would check for http status
    - inputing regexp would check the response text with http status of 400
  - this method assume you use `koa.js`
  - new API includes
    - st.GET*( route: string [, expect: number or regexp]): httpBody as json or text if it can't be parsed
    - st.POST*( route: string, postData: json [, expect: number or regexp]): httpBody as json or text if it can't be parsed
    - st.PUT*( route: string, postData: json [, expect: number or regexp]): httpBody as json or text if it can't be parsed
    - st.DELETE*( route: string, postData: json [, expect: number or regexp]): httpBody as json or text if it can't be parsed
    - st.agent(server) : original supertest object
    
# Usage

co
```js
// require this in jasmine's helper function or at the top of your file
require('hnk-jasmine').co()
```
mock
```js
// require this in jasmine's helper function or at the top of your file
const mock = require('hnk-jasmine').mock;
const monk = require('monk');

// use this db object instead
const db = mock(monk('CONNECTION_STRING'));
// we need some cleanup afterward this is usually done automatically when you close db
// but for SIGINT, you need some special care
process.on('SIGINT', () => mock.exitHandler().then(() => process.exit(0)));
...
// in your tests
yield db.mock('user', { username: 'user1'}, {username: 'user2'});
yield db.get('user').find({}); // return above 2 objects
```
supertest
```js
const SuperTest = require('hnk-jasmine').supertest;
const st = new SuperTest();
const app = require('koa')();

app.use(st.middleware);
app.use(router);
const sv = app.listen();
const originalSupertest = st.agent(sv); //in case u need it
...
// in your test
yield st.GET('/login');
yield st.POST('/login',{username: 'foo', password: 'bar'});
yield st.POST('/login',{username: 'foo', password: 'bar'}, /login unsuccessful/);
yield st.POST('/login',{username: 'foo', password: 'bar'}, 403);
```
