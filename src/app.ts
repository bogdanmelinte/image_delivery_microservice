import express, {NextFunction, Request, Response} from "express";
import * as statsController from "./controllers/stats";
import * as imageController from "./controllers/image";
import {param, query, validationResult} from "express-validator";

require('express-async-errors');

const app = express();

app.set("env", process.env.ENV || 'production');
app.set("port", process.env.PORT || 3000);

app.use(require('express-status-monitor')());

const validate = (validations: any) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        await Promise.all(validations.map((validation: any) => validation.run(req)));

        const errors = validationResult(req);
        if (errors.isEmpty()) {
            return next();
        }

        res.status(400).end();
    };
};

/**
 * Primary app routes.
 */
app.get("/stats", statsController.getStats);
app.get("/image/:fileName", validate([
    param('fileName').matches('^[A-Za-z0-9_-]*\.(gif|jpe?g|tiff|png|webp|bmp)$'),
    query('size').matches('^(\\d+)x(\\d+)$', 'i').optional(),
]), imageController.getImage);

app.use((err: Error, req: Request, res: Response, _: NextFunction) => {
    res.status(500).end();
});

export default app;