import java.util.Arrays;
import java.util.Random;

public class Schedular {
    private static int SKIP_CYCLE = 100;
    private Random r = new Random();

    interface Algorithm {
        int schedule(int[] P, int[] Q);
    }

    public static void main(String[] args) {
        new Schedular().run();
    }

    void run() {
        int[][] rnd;
        int max;

        rnd = randomInput(7);
        // rnd = new int[2][8];
        // for (int i = 0; i < 4; i++) {
        //     rnd[0][i] = 0;
        //     rnd[1][i] = i;
        // }
        // for (int i = 4; i < 8; i++) {
        //     rnd[0][i] = i;
        //     rnd[1][i] = 0;
        // }
        System.out.println("P: " + Arrays.toString(rnd[0]) + "\n Q: " + Arrays.toString(rnd[1]));
        max = new DP().schedule(rnd[0], rnd[1]);
        System.out.println("DP: " + max);
    }

    int[][] randomInput(int n) {
        int[][] rnd = new int[2][n];
        for (int i = 0; i < n; ++i)
            rnd[0][i] = r.nextInt(n * 100);
        for (int i = 0; i < n; ++i)
            rnd[1][i] = r.nextInt(n * 100);
        return rnd;
    }

    // Brute force's runtime complexity is O(2^n).... Not worth to impl


    class DP implements Algorithm {
        public int schedule(int[] p, int[] q) {
            int N = p.length;
            int[] hisp = new int[N + 1];
            int[] hisq = new int[N + 1];
            for (int i = 1; i <= N; ++i) {
                hisp[i] = Math.max(hisp[i - 1] + p[i - 1], i - SKIP_CYCLE < 0 ? -1 : hisq[i - SKIP_CYCLE] + p[i - 1]);
                hisq[i] = Math.max(hisq[i - 1] + q[i - 1], i - SKIP_CYCLE < 0 ? -1 : hisp[i - SKIP_CYCLE] + q[i - 1]);
            }
            return Math.max(hisp[N], hisq[N]);
        }
    }

}