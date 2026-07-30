/**
 * Stack trace'i temizler ve renklendirir
 * @param stackOrError - Stack string veya Error nesnesi
 * @returns Temizlenmiş ve renklendirilmiş stack
 */
export function cleanStack(stackOrError: string | Error): string;

/**
 * Error nesnesinin stack'ini temizler ve nesneye geri atar
 * @param error - Error nesnesi
 * @returns Stack'i temizlenmiş Error nesnesi
 */
export function cleanError(error: Error): Error;

export default cleanStack;
