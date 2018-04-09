import java.util.Arrays;
import java.util.Random;

public class Recycle {
    private Random r = new Random();

    public static void main(String[] args) {
        new Recycle().run();
    }

    void run() {
        int[] in;
        int k;

        in = randomInput(10);
        k = r.nextInt(10);

        System.out.println(Arrays.toString(in));
    }

    int[] randomInput(int size) {
        int[] arr = new int[size];
        arr[0] = r.nextInt(size);
        for (int i = 1; i < size; i++)
            arr[i] = arr[i - 1] + r.nextInt(size) + 1;
        return arr;
    }

    interface Algorithm {
        int minDistance(int[] in, int k);
    }

    class DP implements Algorithm {
        public int minDistance(int[] in, int k) {
            int[][] best = new int[in.length + 1][k + 1];
            for (int i = 0; i < in.length; i++) {
                best[i][1] = 0;
            }

            for (int i = 0; i < in.length; i++) {
                for (int j = 0; j < k; j++) {
                    best[i][j] = 
                }
            }
            return 0;
        }
    }
}