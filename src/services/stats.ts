import * as fs from "fs";
import {config} from "../configs/default";
import {CacheService} from "./cache";
import checkDiskSpace from "check-disk-space";

export class StatsService {

    private static instance: StatsService;

    private cacheHits: number = 0;
    private cacheMisses: number = 0;

    private fileHits: number = 0;
    private fileMisses: number = 0;

    private constructor() {
    }

    public static getInstance(): StatsService {
        if (!StatsService.instance) {
            StatsService.instance = new StatsService();
        }

        return StatsService.instance;
    }

    incrementCacheHit() {
        this.cacheHits++
    }

    incrementCacheMiss() {
        this.cacheMisses++
    }

    incrementFileHit() {
        this.fileHits++;
    }

    incrementFileMiss() {
        this.fileMisses++
    }

    async getOriginalImageCount(): Promise<number> {
        let res = await fs.promises.readdir(config.imagesPath);
        res = res.filter((fileName) =>
            new RegExp('^(?!resized)(.*)(?=gif|jpe?g|tiff|png|webp|bmp)').test(fileName));
        return res.length;
    }

    async getResizedImageCount(): Promise<number> {
        let res = await fs.promises.readdir(config.imagesPath);
        res = res.filter((fileName) =>
            new RegExp('^(?=resized)(.*)(?=gif|jpe?g|tiff|png|webp|bmp)').test(fileName));
        return res.length;
    }

    async getAvailableCapacity(): Promise<string> {
        let info = await checkDiskSpace(config.imagesPath);
        return ((info.free / info.size) * 100).toFixed(2) + "%";
    }

    async toJson(): Promise<object> {
        return {
            'cache': {
                'ttl_cached_images': CacheService.getInstance().size(),
                'hits': this.cacheHits,
                'misses': this.cacheMisses
            },
            'filesystem': {
                'available_space': await this.getAvailableCapacity(),
                'original_images': await this.getOriginalImageCount(),
                'resized_images': await this.getResizedImageCount(),
                'hits': this.fileHits,
                'misses': this.fileMisses
            }
        }
    }
}