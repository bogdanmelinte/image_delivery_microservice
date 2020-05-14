import {Request, Response} from "express";
import {StatsService} from "../services/stats";

export const getStats = async (req: Request, res: Response) => {
    let stats = StatsService.getInstance();
    res.json(await stats.toJson())
};