import request from "supertest";
import app from "../src/app";
import {ImageService} from "../src/services/image";
import sinon from "sinon";

describe('Image Controller API Tests', () => {
    describe('# GET /images without size query parameter', () => {
        it('Should return 422 if no image file is provided', () => {
            return request(app).get('/image').expect(404);
        });

        it('Should return 422 if the image file has the wrong extension', () => {
            return request(app).get('/image/img_0001.pdf').expect(422);
        });

        it('Should return 404 if the image file is not found', () => {
            return request(app).get('/image/not_found.jpg').expect(404);
        });


        it('Should return 200 if the image exists', () => {
            return request(app).get('/image/img_0001.jpg').expect(200);
        });

        it('Should return 200 if the image exists [CACHE]', () => {
            return request(app).get('/image/img_0001.jpg').expect(200);
        });
    });

    describe('# GET /images with size query parameter', () => {
        it('Should return 422 if the size query parameter is empty', () => {
            return request(app).get('/image/img_0001.jpg?size=').expect(422);
        });

        it('Should return 422 if the size query parameter is not a resolution', () => {
            return request(app).get('/image/img_0001.jpg?size=not_a_resolution').expect(422);
        });

        it('Should return 200 if the image exists and size query parameter is valid', () => {
            return request(app).get('/image/img_0001.jpg?size=200x200').expect(200);
        });

        it('Should return 200 if the image exists and size query parameter is valid [CACHE]', () => {
            return request(app).get('/image/img_0001.jpg?size=200x200').expect(200);
        });
    });

    describe('# GET /images unexpected error', () => {
        before(function () {
            sinon.stub(ImageService.prototype, 'getImage').throws(new Error('Unexpected error'));
        });

        it('Should return 500 when an unexpected errors occurs', () => {
            return request(app).get('/image/img_0001.jpg').expect(500);
        });
    });
});