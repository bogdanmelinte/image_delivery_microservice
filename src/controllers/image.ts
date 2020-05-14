import {Request, Response} from "express";
import {ImageService} from "../services/image";

export const getImage = async (req: Request, res: Response) => {
    let fileName: string = req.params.fileName;
    let size: string;

    if (req.query.size) {
        size = req.query.size.toString();
    }

    let imageService = new ImageService(fileName, size);
    let imageBuffer = await imageService.getImage();

    if (imageBuffer) {
        res.status(200).end(imageBuffer, 'binary');
    }

    res.status(404).end();
};