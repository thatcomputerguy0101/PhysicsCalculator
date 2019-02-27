
if (!math) {
    if (this.require) {
        try {
            var math = require("mathjs");
        }
        catch (e) {}
    }
    if (!this.require || !this.math) {
        try {
//            var math = import("mathjs");
            var math
        }
        catch (e) {
            let req = foo
        }
    }
}

math.simplify.rules = math.simplify.rules.concat([
    {l:"n1 / (n2 / n3)", r:"n1 / n2 * n3"},
    {l:"n1 / (n2 * n3)", r:"n1 / n2 / n3"},
    {l:"n ^ 1", r:"n"}
]);

math.solveFor = (exp1, exp2, variable) => {
    exp1 = math.simplify(exp1 + "-" + exp2, math.simplify.rules.concat([
        {l:"square(n)", r:"n ^ 2"},
        {l:"cube(n)", r:"n ^ 3"},
        {l:"sqrt(n)", r:"n ^ (1 / 2)"},
        {l:"cbrt(n)", r:"n ^ (1 / 3)"},
        {l:"log(n)", r:"log(n, e)"},
        {l:"log1p(n)", r:"log(n + 1, e)"},
        {l:"log2(n)", r:"log(n, 2)"},
        {l:"log10(n)", r:"log(n, 10)"},
        {l:"exp(n)", r:"exp(e, n)"},
        {l:"expm1(n)", r:"exp(e, n) - 1"},
    ]));
    exp2 = math.parse(0);
    variable = math.parse(variable);
    if (!variable.isSymbolNode)
        throw new TypeError("Variable is not a single variable");
    else
        variable = JSON.stringify(variable);
    if (!JSON.stringify(exp1).match(variable))
        throw new TypeError("Equation does not contain variable");
    else if (JSON.stringify(exp1).match(RegExp(variable, "g")).length > 1)
        throw new TypeError("Cannot solve for an equation with multiple variables (yet)");
    var inverses = {
        "add": "($&) - ($0)",
        "subtract": ["($&) + ($0)", "-($&) + ($0)"],
        "multiply": "($&) / ($0)",
        "divide": ["($&) * ($0)", "($&) ^ -1"],
        "pow": ["nthRoots($&, $0)", "log($&, $0)"],
        "unaryMinus": "-($&)",
        "sin": "asin($&)",
        "cos": "acos($&)",
        "tan": "atan($&)",
        "csc": "acsc($&)",
        "sec": "asec($&)",
        "cot": "acot($&)",
        "asin": "sin($&)",
        "acos": "cos($&)",
        "atan": "tan($&)",
        "acsc": "csc($&)",
        "asec": "sec($&)",
        "acot": "cot($&)",
        "sinh": "asinh($&)",
        "cosh": "acosh($&)",
        "tanh": "atanh($&)",
        "csch": "acsch($&)",
        "sech": "asech($&)",
        "coth": "acoth($&)",
        "asinh": "sinh($&)",
        "acosh": "cosh($&)",
        "atanh": "tanh($&)",
        "acsch": "csch($&)",
        "asech": "sech($&)",
        "acoth": "coth($&)",
        "nthRoot": ["($&) ^ ($0)", "log(1 / ($0), $&)"],
        "nthRoots": ["($&) ^ ($0)", "log(1 / ($0), $&)"],
        "log": ["($0) ^ ($&)", "nthRoots($0, $&)"] // log(a,b)=c -> b^c=a -> b=a^(1/c)
    };
    while (!math.type.isSymbolNode(exp1)) {
        let originalExp = exp1;
        let operation = inverses[exp1.fn.toString()];
        if (!operation)
            throw Error("Unknown operation: " + exp1.fn.toString());
        let side = exp1.args.findIndex(node => JSON.stringify(node).match(variable));
        if (Array.isArray(operation))
            operation = operation[side];
        exp2 = math.simplify(operation.replace("$&", exp2).replace("$0", exp1.args[+!side]));
        exp1 = math.simplify(operation.replace("$&", exp1).replace("$0", exp1.args[+!side]));
        if (JSON.stringify(exp1) == JSON.stringify(originalExp))
            throw Error("equation is unsimplifyable");
    }
    return math.parse(exp1 + " = " + exp2)
}

if (this.exports) {
    for (let key of Object.keys(math))
        exports[key] = math[key]
}