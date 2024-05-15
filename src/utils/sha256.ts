export const encrypt = async (text: any) => {
    const hasher = new Bun.CryptoHasher("sha256");
    hasher.update(text);

    return hasher.digest('hex').toString();
}