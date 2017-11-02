#include <iostream>
#include <string>

using namespace std;

class A {
    int a;
public:
    A(int x = 0) : a(x) { cout << "A(int=0) a== " << a << endl; }

    virtual void print() { cout << "A: " << a << endl; }

    ~A() { cout << "~A() a== " << a << endl; }
};

class B : virtual public A {
public:
    B(int x = 0) : A(x) { cout << "B(int=0)\n"; }

    virtual void print() {
        A::print();
        cout << "B\n";
    }

    ~B() { cout << "~B()\n"; }
};

class C : virtual public A {
public:
    C(int x = 0) : A(x) { cout << "C(int=0)\n"; }

    virtual void print() {
        A::print();
        cout << "C\n";
    }

    ~C() { cout << "~C()\n"; }
};

class D : public C, public B, public A {
public:
    D(int x = 0) : C(x + 1), B(x + 2), A(x + 3) { cout << "D(int=0)\n"; }

    virtual void print() {
        C::print();
        B::print();
        cout << "D\n";
    }

    ~D() { cout << "~D()\n"; }
};

int main() {
    D d;
    d.print();
}