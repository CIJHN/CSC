import java.util.*;

public class Code {
    public static void main(String[] args) {
        // Code.PizzaProblem.run();
        Mono.INSTANCE.run();
    }

    public static enum Mono {
        INSTANCE;
        static Random r = new Random();

        int nextRand(int bound, Set<Integer> exist) {
            int i;
            do {
                i = r.nextInt(bound);
            } while (exist.contains(i));
            exist.add(i);
            return i;
        }

        int[][] randomInput(int size) {
            int[][] in = new int[2][size];
            Set<Integer> exist = new HashSet<>();
            int bound = size * 4;
            for (int i = 0; i < size; ++i) {
                in[0][i] = nextRand(bound, exist);
            }
            for (int i = 0; i < size; ++i) {
                in[1][i] = nextRand(bound, exist);
            }
            Arrays.sort(in[0]);
            Arrays.sort(in[1]);
            return in;
        }

        void run() {
            int[][] in;
            in = randomInput(8);
            // in = new int[2][];
            // in[0] = new int[]{5, 8, 16};
            // in[1] = new int[]{12, 14, 15};
            System.out.println(Arrays.toString(in[0]) + " " + Arrays.toString(in[1]));
            List<Integer> ls = new ArrayList<>();
            for (int i : in[0])
                ls.add(i);
            for (int i : in[1])
                ls.add(i);
            ls.sort((x, y) -> x - y);
            System.out.println(ls);

            test(new Bruteforce(), in);
            test(new BinaryBySub(), in);
            // test(new Binary(), in);
        }

        void test(Algorithm alg, int[][] in) {
            System.out.println(alg.getClass().getSimpleName());
            double med = alg.med(in[0], in[1]);
            System.out.println(med);
            int lower = 0;
            int higher = 0;

            for (int i : in[0]) {
                if (i < med)
                    lower++;
                else
                    higher++;
            }
            for (int i : in[1]) {
                if (i < med)
                    lower++;
                else
                    higher++;
            }
            System.out.println(lower + " " + higher);
            System.out.println("Valid: " + (lower == higher));
        }

        interface Algorithm {
            double med(int[] a, int[] b);
        }

        class Bruteforce implements Algorithm {
            public double med(int[] a, int[] b) {
                List<Integer> ls = new ArrayList<>();
                for (int i : a)
                    ls.add(i);
                for (int i : b)
                    ls.add(i);
                ls.sort((x, y) -> x - y);
                return (ls.get(ls.size() / 2 - 1) + ls.get(ls.size() / 2)) / 2.0;
            }
        }

        class BinaryBySub implements Algorithm{
            public double med(int[] a, int[] b) {
                System.out.println(Arrays.toString(a) + " " + Arrays.toString(b));
                if (a[a.length - 1] < b[0])
                    return (a[a.length - 1] + b[0]) / 2.0;
                if (b[b.length - 1] < a[0])
                    return (b[b.length - 1] + a[0]) / 2.0;
                if(a.length + b.length == 4) {
                    return (Math.max(a[0], b[0]) + Math.min(a[1], b[1])) / 2.0;
                }
                int len = a.length;
                boolean ev = len % 2 == 0;
                int amid = ev ? (a[len / 2] + a[len / 2 + 1]) / 2 : a[len / 2];
                int bmid = ev ? (b[len / 2] + b[len / 2 + 1]) / 2 : b[len / 2];
                if (amid > bmid) {
                    return med(Arrays.copyOfRange(a, 0, a.length / 2 + 1), 
                        Arrays.copyOfRange(b, ev ? b.length / 2 - 1 : b.length / 2, b.length));
                } else if (amid < bmid) {
                    return med(Arrays.copyOfRange(a, ev ? a.length / 2 - 1 : a.length / 2, a.length), 
                        Arrays.copyOfRange(b, 0, b.length / 2 + 1));
                } else {
                    return amid;
                }
            }
        }

        class Binary implements Algorithm {
            public double med(int[] a, int[] b) {
                if (a[a.length - 1] < b[0])
                    return (a[a.length - 1] + b[0]) / 2.0;
                if (b[b.length - 1] < a[0])
                    return (b[b.length - 1] + a[0]) / 2.0;
                return search(a, b, 0, a.length - 1, 0, b.length - 1);
            }

            // 2n
            // 1/2n lo n hi 1/2n
            // 
            double search(int[] a, int[] b, int alo, int ahi, int blo, int bhi) {
                // System.out.printf("%d %d - %d %d\n",alo, ahi, blo, bhi);
                if (ahi - alo == 1 && bhi - blo == 1) 
                    return (Math.max(a[alo], b[blo]) + Math.min(a[ahi], b[bhi])) / 2.0;
                int amid = a[(ahi + alo) / 2];
                int bmid = b[(bhi + blo) / 2];
                if (amid > bmid) {
                    return search(a, b, alo, (ahi + alo) / 2, (bhi + blo) / 2, bhi);
                } else if (amid < bmid) {
                    return search(a, b, (ahi + alo) / 2, ahi, blo, (bhi + blo) / 2);
                } else {
                    return amid;
                }
            }
        }

        void test() {

        }
    }

    public static class PizzaProblem {
        static Random r = new Random();

        static List<Pizza> fromString(String s) {
            List<Pizza> ls = new ArrayList<>();
            s = s.substring(1, s.length() - 1);
            s = s.replace("(", "").replace(")", "");
            String[] ar = s.split(", ");
            for (int i = 0; i < ar.length; i += 2) {
                int a = Integer.valueOf(ar[i].substring(3));
                int b = Integer.valueOf(ar[i + 1].substring(3));
                ls.add(new Pizza(a, b));
            }
            return ls;
        }

        static void run() {
            List<Pizza> in;
            in = PizzaProblem.randomInput(1000);
            //  in = PizzaProblem.fromString(
            //         "[(p: 18, c: 5), (p: 16, c: 16), (p: 15, c: 10), (p: 13, c: 4), (p: 12, c: 10), (p: 12, c: 1), (p: 9, c: 8), (p: 4, c: 1), (p: 2, c: 8), (p: 1, c: 6)]");
            // Collections.shuffle(in);
            // System.out.println(in);
            // in = fromString(
            // "[(p: 12, c: 10), (p: 4, c: 1), (p: 18, c: 5), (p: 9, c: 8), (p: 13, c: 4), (p: 2, c: 8), (p: 15, c: 10), (p: 12, c: 1), (p: 16, c: 16), (p: 1, c: 6)]");

            // List<Pizza> in = PizzaProblem.fromString(
            // "[(p: 17, c: 9), (p: 17, c: 17), (p: 16, c: 7), (p: 11, c: 6), (p: 9, c: 9), (p: 8, c: 11), (p: 5, c: 3), (p: 1, c: 15), (p: 1, c: 12), (p: 0, c: 11)]");
            test(new Bruteforce(), in);
            test(new Sort(), in);
            test(new DivideAndConq(), in);
            // in.sort((a, b) -> -a.popularity + b.popularity);
            // System.out.println(in);
            // System.out.println("Linear: " + valid(in, new Linear().mostUndominated(in)));
        }

        static void test(Algorithm algorithm, List<Pizza> in) {
            System.out.println(algorithm.getClass().getSimpleName());
            List<Pizza> out = algorithm.mostUndominated(in);
            out.sort((a, b) -> -a.popularity + b.popularity);
            System.out.println(out);
            System.out.println("valid: " + valid(in, out));
        }

        static class Pizza {
            int popularity;
            int cost;

            Pizza(int pop, int c) {
                popularity = pop;
                cost = c;
            }

            public String toString() {
                return "(p: " + popularity + ", c: " + cost + ")";
            }
        }

        interface Algorithm {
            List<Pizza> mostUndominated(List<Pizza> input);
        }

        static List<Pizza> randomInput(int size) {
            List<Pizza> ls = new ArrayList(size);
            for (int i = 0; i < size; ++i)
                ls.add(new Pizza(r.nextInt(size * 2), r.nextInt(size * 2)));
            return ls;
        }

        static boolean valid(List<Pizza> input, List<Pizza> output) {
            if (output.size() == 0)
                return false;
            for (Pizza p : output)
                for (Pizza in : input) {
                    if (p == in)
                        continue;
                    if (p.cost > in.cost && p.popularity < in.popularity)
                        return false;
                }
            return true;
        }

        static class Bruteforce implements Algorithm {
            public List<Pizza> mostUndominated(List<Pizza> input) {
                List<Pizza> all = new ArrayList<>();
                for (Pizza p : input) {
                    boolean hold = true;
                    for (Pizza in : input) {
                        if (p == in)
                            continue;
                        if (p.cost > in.cost && p.popularity < in.popularity) {
                            hold = false;
                            break;
                        }
                    }
                    if (hold)
                        all.add(p);
                }
                return all;
            }
        }

        static class Sort implements Algorithm {
            public List<Pizza> mostUndominated(List<Pizza> input) {
                List<Pizza> dup = new ArrayList<>(input);
                dup.sort((a, b) -> -a.cost + b.cost);
                dup.sort((a, b) -> -a.popularity + b.popularity);
                List<Pizza> out = new ArrayList<>();
                Pizza cap = dup.get(0);
                for (Pizza p : dup)
                    if (p.popularity <= cap.popularity && p.cost <= cap.cost) {
                        out.add(p);
                        cap = p;
                    }
                return out;
            }
        }

        static class DivideAndConq implements Algorithm {
            public List<Pizza> mostUndominated(List<Pizza> input) {
                if (input.size() <= 2) {
                    List<Pizza> ls = new ArrayList<>();
                    if (input.size() == 1) {
                        ls.add(input.get(0));
                        return ls;
                    }
                    Pizza a = input.get(0);
                    Pizza b = input.get(1);
                    if (a.popularity > b.popularity) {
                        if (a.cost >= b.cost) {
                            ls.add(a);
                            ls.add(b);
                        } else {
                            ls.add(a);
                        }
                    } else if (a.popularity == b.popularity) {
                        if (a.cost > b.cost) {
                            ls.add(a);
                            ls.add(b);
                        } else {
                            ls.add(b);
                            ls.add(a);
                        }
                    } else {
                        if (a.cost <= b.cost) {
                            ls.add(b);
                            ls.add(a);
                        } else {
                            ls.add(b);
                        }
                    }
                    return ls;
                }
                List<Pizza> left = mostUndominated(input.subList(0, input.size() / 2));
                List<Pizza> right = mostUndominated(input.subList(input.size() / 2, input.size()));
                return merge(left, right);
            }

            void addToList(List<Pizza> ls, Pizza current) {
                if (ls.size() == 0) {
                    ls.add(current);
                    return;
                }
                Pizza last = ls.get(ls.size() - 1);
                if (current.cost <= last.cost)
                    ls.add(current);
            }

            List<Pizza> merge(List<Pizza> first, List<Pizza> sec) {
                if (sec.size() == 0)
                    return first;
                if (first.size() == 0)
                    return sec;
                List<Pizza> ls = new ArrayList<>();
                int i = 0;
                int j = 0;
                while (i < first.size() || j < sec.size()) {
                    if (i == first.size()) {
                        addToList(ls, sec.get(j++));
                        continue;
                    }
                    if (j == sec.size()) {
                        addToList(ls, first.get(i++));
                        continue;
                    }
                    Pizza a = first.get(i), b = sec.get(j);
                    if (a.popularity > b.popularity) {
                        addToList(ls, a);
                        i++;
                        if (a.cost < b.cost)
                            j++;
                    } else if (a.popularity == b.popularity) {
                        if (b.cost > a.cost) {
                            addToList(ls, b);
                            j++;
                        } else {
                            addToList(ls, a);
                            i++;
                        }
                    } else {
                        addToList(ls, b);
                        j++;
                        if (a.cost > b.cost)
                            i++;
                    }
                }
                return ls;
            }
            // 10 8, 9 7 | 15 20, 14 10 
            // 15 20, 14 10, 10 8, 9 7 | 13 4, 12 3
            // 15 20, 14 10, 13 4, 12 3,
        }
    }
}