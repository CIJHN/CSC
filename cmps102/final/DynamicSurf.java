public class DynamicSurf {
    int max(int[] prices) {
        int maxBuy = -prices[0];
        int maxSell = 0;
        for (int i = 1; i < prices.length; i++) {
            maxBuy = Math.max(maxBuy, maxSell - 2 - prices[i]);
            maxSell = Math.max(maxSell, maxBuy - 2 + prices[i]);
        }
        return maxSell;
    }

    public static void main(String[] args) {
        int[] in;
        // in = new int[] { 11, 7, 10, 9, 13, 14, 10, 15, 12, 10 };
        in = new int[] { 1, 3, 7, 5, 10, 3 };
        int out = new DynamicSurf().max(in);
        System.out.println(out);
    }
}