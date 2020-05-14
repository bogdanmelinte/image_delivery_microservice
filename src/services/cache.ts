export class CacheService {
    private static instance: CacheService;
    private readonly memory: Map<string, Buffer>;

    private constructor() {
        this.memory = new Map<string, Buffer>();
    }

    public static getInstance(): CacheService {
        if (!CacheService.instance) {
            CacheService.instance = new CacheService();
        }

        return CacheService.instance;
    }

    public get(key: string): Buffer {
        return this.memory.get(key);
    }

    public has(key: string): boolean {
        return this.memory.has(key);
    }

    public set(key: string, buffer: Buffer): void {
        this.memory.set(key, buffer);
    }

    public size(): number {
        return this.memory.size;
    }
}