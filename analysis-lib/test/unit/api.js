'use strict'

const chaiHttp = require('chai-http')
const chai = require('chai').use(chaiHttp)
const dirtyChai = require('dirty-chai')
const expect = chai.expect
const request = chai.request
chai.use(dirtyChai)

const mocks = require('../../mocks/api/api')

const DbInterface = require('../../src/db-scripts/db-interface')
let fs = require('fs')

describe('should test API', function () {
  this.timeout(10000)

  let _interface
  const server = 'http://localhost:3000'
  const dataPath = mocks['getDataset']['dataset']

  before((done) => {
    _interface = new DbInterface()
    _interface.init()

    _interface.saveTsvIntoDB(mocks['getDataset']['tsvFile'], 1)
      .then(() => done())
  })

  it('should test dataset/:datasetId - returns a dataset', (done) => {
    request(server)
      .get('/dataset/1.tsv')
      .end((err, res) => {
        if (err) {}

        let dataset = ''
        if (fs.existsSync(dataPath)) {
          dataset = fs.readFileSync(dataPath, { encoding: 'utf-8' })
        }

        const response = res.text

        expect(res).to.have.status(200)
        expect(response).to.be.equal(dataset)
        done()
      })
  })

  it('should test dataset/:datasetId - returns an empty tsv', (done) => {
    request(server)
      .get('/dataset/-1.tsv')
      .end((err, res) => {
        if (err) {}

        const response = res.text
        expect(response).to.be.an('string').that.is.empty('Reason: response should be empty')

        expect(res).to.have.status(200)

        done()
      })
  })

  it('should test get /dataset - saves a tsv and run filters', (done) => {
    const metadata = mocks['saveAndRun']['metadata']
    const success = mocks['saveAndRun']['success']

    request(server)
      .post('/dataset')
      .send(metadata)
      .end((err, res) => {
        if (err) {
          console.error(err)
          return
        }

        try {
          const response = JSON.parse(res.text)

          expect(res).to.have.status(201)
          expect(response.status).to.be.equal(success.status)
          expect(response.datasetId).to.be.a('number')

          done()
        } catch (err) { console.log(err) }
      })
  })

  it('should test get /dataset - invalid tsv file: internal server error', (done) => {
    const metadata = mocks['saveAndRun']['tsvError']

    request(server)
      .post('/dataset')
      .send(metadata)
      .end((err, res) => {
        if (err) {}

        /**
         * @type {{title: string, detail: string}}
         */
        const response = JSON.parse(res.text)

        expect(response).to.be.an('object')
        expect(response.title).to.be.not.empty('Reason: Title is required')
        expect(response.detail).to.be.not.empty('Reason: Detail is required')
        expect(res).to.have.status(500)

        done()
      })
  })
})
