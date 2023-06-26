export * from './compute'
export * from './pda'
export * from './numbers'

export const chunk = <T>(arr: T[], size: number): T[][] =>
    [...Array(Math.ceil(arr.length / size))].map((_, i) =>
        arr.slice(size * i, size + size * i)
    );

export async function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
