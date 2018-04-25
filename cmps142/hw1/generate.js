
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

const out = IG(0.985, { name: 'Male', p: 3, n: 2 }, { name: 'Female', p: 1, n: 1 });



function latexIG(attrName, totalEntro, left, right) {
    const totalLeft = left.p + left.n;
    const totalRight = right.p + right.n;
    const total = totalLeft + totalRight;

    const fracLeft = totalLeft / total;
    const fracRight = totalRight / total;

    const entroLeft = entropy(left.p / totalLeft, left.n / totalLeft).toFixed(3);
    const entroRight = entropy(right.p / totalRight, right.n / totalRight).toFixed(3);

    const ig = (totalEntro - fracLeft * entroLeft - fracRight * entroRight).toFixed(5);

    return `
$$
IG(S, ${attrName}) = H(S) - \\frac ${totalLeft} ${total} H(S_{${attrName}=${left.name}})-\\frac ${totalRight} ${total} H(S_{${attrName}=${right.name}})
$$

$$
H(S_{${attrName}=${left.name}}) = -\\frac ${left.p} ${totalLeft} log_2 \\frac ${left.p} ${totalLeft} - \\frac ${left.n} ${totalLeft} log_2 \\frac ${left.n} ${totalLeft} \\approx ${entroLeft}
$$

$$
H(S_{${attrName}=${right.name}}) = -\\frac ${right.p} ${totalRight} log_2 \\frac ${right.p} ${totalRight} - \\frac ${right.n} ${totalRight} log_2 \\frac ${right.n} ${totalRight} \\approx ${entroRight}
$$

$$
IG(S, ${attrName}) = ${totalEntro} - \\frac ${totalLeft} ${total} \\times ${entroLeft} - \\frac ${totalRight} ${total} \\times ${entroRight} = ${ig}
$$`
}


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

    return `${first}
$$
${middle}
${last} = ${ie.toFixed(5)}
$$
`;
}

// let t = latexIG('Gender', 0.985, [{ name: 'Male', p: 3, n: 2 }, { name: 'Female', p: 1, n: 1 }])
// const t = latexIG('h=5.3', 0.985, [{ name: 'Height \\ge 5.3', p: 3, n: 3 }, { name: 'Height \\le 5.3', p: 0, n: 1 }])
// const t = latexIG('h=6.1', 0.985, [{ name: 'Height \\ge 6.1', p: 2, n: 3 }, { name: 'Height < 6.1', p: 0, n: 2 }])
// const t = latexIG('h=6.2', 0.985, [{ name: 'Height \\ge 6.2', p: 1, n: 3 }, { name: 'Height < 6.2', p: 1, n: 2 }])
// const t = latexIG('h=6.8', 0.985, [{ name: 'Height \\ge 6.8', p: 1, n: 1 }, { name: 'Height < 6.8', p: 1, n: 4 }])
const t = latexIG('h=6.9', 0.985, [{ name: 'Height \\ge 6.9', p: 1, n: 0 }, { name: 'Height < 6.9', p: 1, n: 5 }])

console.log(t)

