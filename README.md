# hnk-jasmine

HNK-Jasmine is a collection of small helper functions for testing Node.js code in Jasmine. It includes:
- co
  - modify jasmine's `it` function to accept generator function
- mock
  - this method assumes you use monk (mongodb driver) in your code
  - mock your database for e2e testing. It is fast enough to mock the whole collection for every function calls
- gendoc
  - create readme.md documenting everything described by your test case
  - use this script and never have an outdated doc ever again
- supertest
  - properly print stack trace when your server-side code throw exception (and usually returns 500)
  - simplify supertest assertion by the following assumption
    - every function call must return 200 by default
    - inputing number would check for http status
    - inputing regexp would check the response text with http status of 400
