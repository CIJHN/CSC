import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Random;

public class CoinChange {
    private Random rnd = new Random();

    public static void main(String[] args) {
        new CoinChange().run();
    }

    public void run() {
        int[] coins;
        int total;
        int min;

        coins = this.randomInput(10);
        total = rnd.nextInt(10 * 5);
        // coins = new int[] { 2, 13, 3, 12, 8, 4, 10, 3, 12, 16 };
        // total = 19;

        System.out.println("Input: " + Arrays.toString(coins) + ", Total: " + total);
        min = new BottomUpDP().minChange(coins, total);
        System.out.println("DP BP: " + min);
        // min = new TopDownDP().minChange(coins, total);
        // System.out.println("DP TB: " + min);
        min = new BruteForce().minChange(coins, total);
        System.out.println("BruteForce: " + min);
        // min = new TopDownDP().minChange(coins, total);
        // System.out.println("DP: " + min);

    }

    public int[] randomInput(int size) {
        int[] arr = new int[size];
        for (int i = 0; i < arr.length; i++)
            arr[i] = rnd.nextInt(size * 2) + 1;
        return arr;
    }

    public interface Algorithm {
        int minChange(int[] coins, int total);
    }

    public class BottomUpDP implements Algorithm {
        public int minChange(int[] coins, int total) {
            int[] history = new int[total + 1];
            Arrays.fill(history, Integer.MAX_VALUE);

            for (int i = 1; i <= total; ++i) 
                for (int c : coins) {
                    int subtotal = i - c;
                    if (subtotal == 0) {
                        history[i] = 1;
                    } else if (subtotal > 0 && history[subtotal] != Integer.MAX_VALUE) {
                        history[i] = Math.min(history[subtotal] + 1, history[i]);
                    }
                }
            
            return history[total];
        }
    }

    public class TopDownDP implements Algorithm {
        private int[] history;
        int dpcount = 0;
        int totalCount = 0;

        public int minChange(int[] coins, int total) {
            history = new int[total + 1];
            Arrays.fill(history, -1);
            int min = minChange0(coins, total, new ArrayList<>());
            System.out.println("total " + totalCount);
            System.out.println("dp " + dpcount);
            return min;
        }

        private int minChange0(int[] coins, int total, List<Integer> list) {
            totalCount++;
            if (total == 0) {
                return list.size();
            }
            if (history[total] != -1) {
                dpcount++;
                return history[total];
            }
            int min = Integer.MAX_VALUE;
            for (int c : coins) {
                if (c > total)
                    continue;
                int nextTotal = total - c;
                list.add(c);
                int nextMin = minChange0(coins, nextTotal, list);
                list.remove(list.size() - 1);
                if (nextMin > 0)
                    min = Math.min(min, nextMin);
            }
            if (min == Integer.MAX_VALUE)
                return -1;
            history[total] = min;
            return min;
        }
    }

    public class BruteForce implements Algorithm {
        public int minChange(int[] coins, int total) {
            return minChange0(coins, total, new ArrayList<>());
        }

        private int minChange0(int[] coins, int total, List<Integer> list) {
            if (total == 0) {
                return list.size();
            }
            if (total < 0) {
                return -1;
            }
            int min = Integer.MAX_VALUE;
            for (int c : coins) {
                int nextTotal = total - c;
                list.add(c);
                int nextMin = minChange0(coins, nextTotal, list);
                list.remove(list.size() - 1);
                if (nextMin > 0)
                    min = Math.min(min, nextMin);
            }
            if (min == Integer.MAX_VALUE)
                return -1;
            return min;
        }
    }
}