# Midterm 2

This document contains the key points on my view point to midterm 2.
## Clean code

~~Personally, I believe the idea: "The code is written for human reading and machine running." Therefore the code should be first human-readable, and then effcient to run.~~

### Purpose of clean code 

Document the code: Clean code is a better explaination than document to solfware.

Easy to extends/expand the code: Clean code is easy to debug, extends/expand.

*Unclear code is hard to modify and debug, it can be broken easily.*

### To get clean code

- Setup a standard/conventions for project 
- no magic/hard code
- Use the simplest structure if possible
- Manage coupling well.... DONT COUPLED TOGETHER
- Use comment if it's necessary
- Do code review
#### Clean code common standard

- No repeat
- Meaningful var/func name (func name should describe what the function do)
- Wrap/Encapsulate conditions (avoid negative condition)
- Function should do one thing
- Good code layout

## Managing complexity

High Cohesion, Loose Coupling (高内聚 低耦合, 很经典)

The component/idea inside a class/module should be mostly 

## Simple Design

Create a table with four columns:
1. All tests must pass
2. No code is duplicated
3. Code is self-explanatory
4. No superfluous parts exist

Design Dilemma: Too much design or Too little design

## Emerging Design

- agility is building software in tiny increment
- develop code based on current demand
- refactor when requirement change

## Grow code with test

Hard code to test:

- Tight coupled: Cannot test unless you mock/initialize half of system. (like dev minecraft mod)
- Weakly cohesive: One class do too much. The test becomes complexs.
- Redundant: Have to test multiple place to prove

### Test Driven development

## The SOLID Design Principles

- SRP: the single responsibility principle
- OCP: the open/closed principle
- LSP: the Liskovsubstitution principle
- ISP: the interface segregation principle
- DIP: the dependency inversion principle

### SRP

A class should have only one reason to change. (A class should only serve for one purpose)

### OCP

Software entities (classes, modules, functions, etc.) should be open for extension but closed for modification.

### LSP

Subtypes must be substitutable for their base types in all contexts.

### ISP

Clients should not be forced to depend on methods they do not use.

### DIP

A. High-level modules should not depend on low-level modules. Both should depend on abstractions.

B. Abstractions should not depend upon details. Details should depend upon abstractions.

## V-Model of Software Development

```
Busniess req                            acceptance testing
    System req                      system testing
        Techn req               integration testing
            Component spec  unit testing
                        coding
```

## Unit test

## Desirable Test Characteristics (F.I.R.S.T.)

Fast
- tests will run frequently
- Small and simple: test one concept at a time

Independent
- No dependencies between tests
- Tests can run in any order
- Simplifies failure analysis (debugging)

Repeatable
- Tests can run at any time, in any order

Self-Validating
- Test either pass or fail (Boolean result)

Timely
- Write the tests when you need them
- In TDD: write test first, then code

## Common Unit Test Pattern/Practice

Test Stub

- Supplies indirect inputs to SUT

Test Spy

- Observes and records calls to Depended-on Components (DoC)
- Provides retrieval interface for test verification (assertion methods)
- May also provide indirect inputs

Mock Object
- Compares actual invocation of DoC with expected invocation during SUT execution 

- May also provide indirect inputs

Fake objects
- “knock-offs” of DoCwith same functionality but more efficient
- E.g. hash table instead of relational D