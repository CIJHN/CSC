
function entropy(pa, pb) {
    if (pa != 0 && pb != 0)
        return -pa * Math.log2(pa) - pb * Math.log2(pb);
    if (pa == 0)
        return - pb * Math.log2(pb);
    return - pa * Math.log2(pa);

}

function IG(totalEntro, left, right) {
    const totalLeft = left.p + left.n;
    const totalRight = right.p + right.n;
    const total = totalLeft + totalRight;

    const fracLeft = totalLeft / total;
    const fracRight = totalRight / total;

    const entroLeft = entropy(left.p / totalLeft, left.n / totalLeft);
    const entroRight = entropy(right.p / totalRight, right.n / totalRight);

    return totalEntro - fracLeft * entroLeft - fracRight * entroRight;
}

// const out = IG(0.985, { name: 'Male', p: 3, n: 2 }, { name: 'Female', p: 1, n: 1 });

function latexIG(attrName, totalEntro, attributes) {
    let total = 0;
    for (const attr of attributes) {
        attr.total = attr.n + attr.p;
        total += attr.total;
    }
    let first = `
$$
IG(S, ${attrName}) = H(S) `;
    let middle = ``;
    let last = `
$$
IG(S, ${attrName}) = ${totalEntro} `;

    let ie = totalEntro;
    for (const attr of attributes) {
        const t = attr.total;
        const e = attr.p === 0 || attr.q === 0 ? 0 : entropy(attr.p / t, attr.n / t);
        const frac = t / total;
        ie -= (frac * e);

        first += `- \\frac ${t} ${total} H(S_{${attrName}=${attr.name}})`;
        middle += `
$$
H(S_{${attrName}=${attr.name}}) = -\\frac ${attr.p} ${t} log_2 \\frac ${attr.p} ${t} - \\frac ${attr.n} ${t} log_2 \\frac ${attr.n} ${t} \\approx ${e.toFixed(3)}
$$
`;
        last += `- \\frac ${t} ${total} \\times ${e.toFixed(3)}`
    }

    return last + `= ${ie.toFixed(5)}`;
    // return `${first}
    // $$
    // ${middle}
    // ${last} = ${ie.toFixed(5)}
    // $$
    // `;
}

let t;

// t = latexIG('Gender', 0.985, [{ name: 'Male', p: 3, n: 2 }, { name: 'Female', p: 1, n: 1 }])
// console.log(t)
// t = latexIG('h=5.3', 0.985, [{ name: 'Height \\ge 5.3', p: 3, n: 3 }, { name: 'Height \\le 5.3', p: 0, n: 1 }])
// console.log(t)
// t = latexIG('h=6.1', 0.985, [{ name: 'Height \\ge 6.1', p: 2, n: 3 }, { name: 'Height < 6.1', p: 1, n: 1 }])
// console.log(t)
// t = latexIG('h=6.2', 0.985, [{ name: 'Height \\ge 6.2', p: 1, n: 3 }, { name: 'Height < 6.2', p: 2, n: 1 }])
// console.log(t)
// t = latexIG('h=6.8', 0.985, [{ name: 'Height \\ge 6.8', p: 1, n: 1 }, { name: 'Height < 6.8', p: 2, n: 3 }])
// console.log(t)
// t = latexIG('h=6.9', 0.985, [{ name: 'Height \\ge 6.9', p: 1, n: 0 }, { name: 'Height < 6.9', p: 2, n: 4 }])
// console.log(t)

t = latexIG('Gender', 0.918, [
    { name: 'Male', p: 1, n: 3 },
    { name: 'Female', p: 1, n: 1 }
])

t = latexIG('h=5.3', 0.918, [
    { name: '<', p: 0, n: 1 },
    { name: '\\ge', p: 2, n: 3 }
])

t = latexIG('h=6.1', 0.918, [
    { name: '<', p: 1, n: 1 },
    { name: '\\ge', p: 1, n: 3 }
])

t = latexIG('h=6.2', 0.918, [
    { name: '<', p: 2, n: 1 },
    { name: '\\ge', p: 0, n: 3 }
])

t = latexIG('h=6.8', 0.918, [
    { name: '<', p: 2, n: 3 },
    { name: '\\ge', p: 0, n: 1 }
])

////////////////////

t = latexIG('Gender', 0.918, [
    { name: 'Male', p: 1, n: 1 },
    { name: 'Female', p: 1, n: 0 }
])

// t = latexIG('h=5.3', 0.918, [
//     { name: '<', p: 0, n: 1 },
//     { name: '\\ge', p: 2, n: 0 }
// ])

// t = latexIG('h=6.1', 0.918, [
//     { name: '<', p: 1, n: 1 },
//     { name: '\\ge', p: 1, n: 0 }
// ])

console.log(t)

// console.log(entropy(2 / 3, 1 / 3))
