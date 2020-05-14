import request from "supertest";
import {expect} from "chai";
import app from "../src/app";
import sinon from "sinon";
import {StatsService} from "../src/services/stats";

describe('Stats Controller API Tests', () => {
    describe('# GET /stats', () => {
        it('Should return 200 and contain specific properties', (done => {
            request(app)
                .get('/stats')
                .end((err, res) => {
                    expect(res.status).to.equal(200);
                    expect(res.body).to.have.property('cache');
                    expect(res.body).to.have.property('filesystem');

                    expect(res.body.cache).to.have.property('ttl_cached_images');
                    expect(res.body.cache).to.have.property('hits');
                    expect(res.body.cache).to.have.property('misses');
                    expect(res.body.filesystem).to.have.property('available_space');
                    expect(res.body.filesystem).to.have.property('original_images');
                    expect(res.body.filesystem).to.have.property('resized_images');
                    expect(res.body.filesystem).to.have.property('hits');
                    expect(res.body.filesystem).to.have.property('misses');
                    done();
                });
        }));
    });

    describe('# GET /stats unexpected error', () => {
        before(function () {
            sinon.stub(StatsService.prototype, 'toJson').throws(new Error('Unexpected error'));
        });

        it('Should return 500 when an unexpected errors occurs', () => {
            return request(app).get('/stats').expect(500);
        });
    });
});