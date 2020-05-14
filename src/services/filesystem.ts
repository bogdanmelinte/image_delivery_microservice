import * as fs from "fs";

export class FilesystemService {
    private static instance: FilesystemService;

    private constructor() {
    }

    public static getInstance(): FilesystemService {
        if (!FilesystemService.instance) {
            FilesystemService.instance = new FilesystemService();
        }

        return FilesystemService.instance;
    }

    public async read(filePath: string): Promise<Buffer> {
        return await fs.promises.readFile(filePath)
    }

    public async exists(filePath: string): Promise<boolean> {
        try {
            await fs.promises.access(filePath, fs.constants.F_OK);
            return true;
        } catch (_) {
            return false;
        }
    }

    public async write(filePath: string, buffer: Buffer): Promise<void> {
        await fs.promises.writeFile(filePath, buffer);
    }
}