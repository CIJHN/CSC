#include <iostream>


using namespace std;

class A;

void g(A *);

class A {
public:
    int a;
    A *peer;

    A(int x, A *m = 0) : a(x), peer(m) {
        cout << "A() a==" << a << endl;
    }

    A(const A &c) {
        a = c.a + 1;
        peer = c.peer;
        cout << "A(const A&) " << a << endl;
    }

    int geta() const { return a; }

    void f();

    ~A() { cout << "~A() " << a << endl; }

    A operator*() { return peer ? *peer : *this; }
};

ostream &operator<<(ostream &os, const A &a) {
    os << "A " << a.geta();
    return os;
}

void A::f() {
    cout << "A::f()" << *this << endl;
    if (peer) g(peer);
    else cout << "null peer\n";
}

void g(A *p) {
    cout << "g()" << *p << endl;
    p->f();
}

int main() {
    cout << "one:\n";
    A b(50);
    cout << "two:\n";
    A a(1, &b);
    cout << "three:\n";
    g(&a);
    cout << "four:\n";
    a.peer->f();
    cout << "five:\n";
    b.f();
    (*b).f();
    (*a).f();
    cout << "done!\n";
}




