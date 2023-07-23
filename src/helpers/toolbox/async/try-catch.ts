export function tryCatchWrapper<T>(callback: () => T): [T | null, Error | null] {
    try {
        const result = callback();
        return [result, null];
    } catch (error:any) {
        return [null, error as Error | null];
    }
}
