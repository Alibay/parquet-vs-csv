export default class RandomUtils {

  public static generateSparseField(min: number, max: number, threshold: number = 0.5): string | undefined {
    if (Math.random() < threshold) {
      return undefined;
    }

    return RandomUtils.getRandomString(RandomUtils.getRandomInt(min, max));
  }

  public static getRandomString(length: number) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  public static getRandomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
