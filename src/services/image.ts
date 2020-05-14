import {CacheService} from "./cache";
import {FilesystemService} from "./filesystem";
import sharp from "sharp";
import {config} from "../configs/default";
import {StatsService} from "./stats";

export class ImageService {
    private readonly fileName: string;
    private readonly size: string;
    private readonly width: number;
    private readonly height: number;
    private cacheService: CacheService;
    private filesystemService: FilesystemService;
    private statsService: StatsService;

    constructor(fileName: string, size?: string) {
        this.fileName = fileName;
        this.size = size;
        if (this.size) {
            [this.width, this.height] = this.size
                .split('x')
                .map((part: string): number => parseInt(part));
        }
        this.cacheService = CacheService.getInstance();
        this.filesystemService = FilesystemService.getInstance();
        this.statsService = StatsService.getInstance();
    }

    public async getImage(): Promise<Buffer> | null {
        let cacheKey: string = this.getCacheKey();
        let fsPath: string = this.getFsPath();
        let resizedFsPath: string = this.getResizedFsPath();

        if (this.cacheService.has(cacheKey)) {
            this.statsService.incrementCacheHit();
            return this.cacheService.get(cacheKey);
        }

        this.statsService.incrementCacheMiss();

        if (!await this.filesystemService.exists(fsPath)) {
            this.statsService.incrementFileMiss();
            return null;
        }

        this.statsService.incrementFileHit();

        let buffer = await this.filesystemService.read(fsPath);

        if (this.width && this.height) {
            buffer = await sharp(buffer)
                .resize(this.width, this.height)
                .toBuffer();

            await this.filesystemService.write(resizedFsPath, buffer);
        }

        this.cacheService.set(cacheKey, buffer);

        return buffer;
    }

    private getCacheKey(): string {
        return this.fileName + `_${this.size}`
    }

    private getFsPath(): string {
        return config.imagesPath + this.fileName;
    }

    private getResizedFsPath(): string {
        return config.imagesPath + config.resizedFilePrefix + `${this.size}_${this.fileName}`;
    }
}