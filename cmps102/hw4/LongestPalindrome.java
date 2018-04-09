import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;
import java.util.TreeMap;

public class LongestPalindrome {
    public static void main(String[] args) {
        new LongestPalindrome().run();
    }

    void run() {
        String input;
        int out;
        input = "";
        // input = "LATBA";
        // input = "AHLATBARGA";
        out = new DP().maxPalindrome(input);
        System.out.println("Input: " + input + ", Output: " + out);
    }

    interface Algorithm {
        int maxPalindrome(String s);
    }

    class DP implements Algorithm {
        public int maxPalindrome(String s) {
            if (s.length() == 0) return 0;
            String[][] history = new String[s.length() + 1][s.length() + 1];
            for (int i = 0; i < s.length(); i++) {
                history[i][i] = "";
                history[i + 1][i] = s.substring(i, i + 1);
            }
            for (int i = 0; i < s.length(); ++i) {
                char next = s.charAt(i);
                int end = i + 1;
                for (int j = i - 1; j >= 0; --j) {
                    int start = j;
                    char prev = s.charAt(j);
                    if (next == prev) {
                        if (end - start - 1 == 1) {
                            history[end][start] = next + "" + prev;
                        } else {
                            history[end][start] = next + history[end - 1][start + 1] + prev;
                        }
                    } else {
                        String last = history[end][start + 1];
                        String hisLast = history[end - 1][start];
                        history[end][start] = last.length() > hisLast.length() ? last : hisLast;
                    }
                }
            }
            return history[s.length()][0].length();
        }

        // private String maxPalindrome(String s, Map<String, String> map) {
        //     if (s == null || s.length() == 0)
        //         return "";
        //     if (map.containsKey(s))
        //         return map.get(s);
        //     if (s.length() == 1) {
        //         map.putIfAbsent(s, s);
        //         return s;
        //     }
        //     String current = s.substring(0, 1);
        //     for (int i = 1; i < s.length(); i++) {
        //         char next = s.charAt(i);
        //         for (int j = current.length() - 1; j > 0; j--) {
        //             String target = current.substring(j);
        //             if (current.charAt(j) == next) {
        //                 String formed = current.charAt(j) + map.get() + next;
        //                 String his = map.get(target + next);
        //                 if (his == null || last.length() > his.length()) {
        //                     map.put(target + next, last);
        //                 }
        //             } else {
        //                 String his = map.get(target + next);
        //                 String oldMax = maxPalindrome(target, map);
        //                 String formMax = maxPalindrome(target, map);
        //                 if (his == null || his.length() < max.length())
        //                     map.put(target + next, max);
        //             }
        //         }
        //         current += next;
        //     }
        //     return map.get(s);
        // }
    }
}