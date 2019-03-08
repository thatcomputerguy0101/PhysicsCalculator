/* globals data, math *//* eslint-disable no-unused-vars*/

window.addEventListener("load", () => {
    math.simplify.rules.splice(math.simplify.rules.findIndex(rule => rule.l == "n*(n1/n2)"), 1, {l: "c*(c1/c2)", r: "(c*c1)/c2"}, {l: "n*(n1/v2)", r: "(n*n1)/v2"}, {l: "n*(v1/n2)", r: "(n*v1)/n2"});
    math.simplify.rules.push({l: "n / n", r: "1"});
    math.simplify.rules.push({l: "(n * n1) / n", r: "n1"});
    math.simplify.rules.push({l: "n / (n * n1)", r: "1 / n1"});
    math.simplify.rules.push({l: "(n * n1) / (n * n2)", r: "n1 / n2"});
});

var arithmetic = {
    "(-?\\d+)+(-?\\d+)": (x, y) => x + y,
    "(-?\\d+)-(-?\\d+)": (x, y) => x - y,
    "(-?\\d+)*(-?\\d+)": (x, y) => x * y,
    "(-?\\d+)/(-?\\d+)": (x, y) => x / y,
    "(-?\\d+)^(-?\\d+)": (x, y) => x ** y,
    "\\\\sqrt(?:(\\\\\\d+l)\\\\[(-?\\d+)\\1\\\\])?(\\\\\\d+l)\\\\{(-?\\d+)\\3\\\\}": (n, y, n2, x) => x ** (1 / (y || 2)),
    "\\\\sin": (x) => x
};

var bracketReX = [
    /(?<!\\\d+l?)(?<!\\left)({(?:[^{[]|\\\d+l?[{[]|\\left[{[])+?)(?<!\\\d+l?)(?<!\\right)(})|(?<!\\\d+l?)(?<!\\left)(\[(?:[^{[]|\\\d+l?[{[]|\\left[{[])+?)(?<!\\\d+l?)(?<!\\right)(])/,
    /(?<!\\\d+l?)\\left({(?:[^{([|]|\\\d+l?[{([|])+?)(?<!\\\d+l?)\\right(})|(?<!\\\d+l?)\\left(\((?:[^{([|]|\\\d+l?[{([|])+?)(?<!\\\d+l?)\\right(\))|(?<!\\\d+l?)\\left(\[(?:[^{([|]|\\\d+l?[{([|])+?)(?<!\\\d+l?)\\right(])|(?<!\\\d+l?)\\left(\|(?:[^{([|]|\\\d+l?[{([|])+?)(?<!\\\d+l?)\\right(\|)/,
//    /(?<!\\\d+l?)({(?:[^{([|]|\\\d+l?[{([|])+?)(?<!\\\d+l?)(})|(?<!\\\d+l?)(\((?:[^{([|]|\\\d+l?[{([|])+?)(?<!\\\d+l?)(\))|(?<!\\\d+l?)(\[(?:[^{([|]|\\\d+l?[{([|])+?)(?<!\\\d+l?)(])|(?<!\\\d+l?)(\|(?:[^{([|]|\\\d+l?[{([|])+?)(?<!\\\d+l?)(\|)/,
    /(\\\d+l)([{[].*?)\1([}\]])/,
    /(\\\d+)([{[(|].*?)\1([|)}\]])/,
];

function parseBrackets(str/*, latex = true*/) {
//    if (latex) {
        for (var i = 0; bracketReX[0].exec(str); i++)
            str = str.replace(bracketReX[0], "\\" + i + "l$1$3\\" + i + "l$2$4");
        for (i = 0; bracketReX[1].exec(str); i++)
            str = str.replace(bracketReX[1], "\\" + i + "$1$3$5$7\\" + i + "$2$4$6$8");
//    }
//    else {
//        for (i = 0; bracketReX[2].exec(str); i++)
//            str = str.replace(bracketReX[2], "\\" + i + "$1$3$5$7\\" + i + "$2$4$6$8");
//    }
    return str;
}

function unparseBrackets(str, force/*, latex = true*/) {
    while (bracketReX[2].exec(str))
        str = str.replace(bracketReX[2], "$2$3");
    while (bracketReX[3].exec(str))
        str = str.replace(bracketReX[3], "\\left$2\\right$3");
//    if (latex) {
//        while (bracketReX[3].exec(str))
//            str = str.replace(bracketReX[3], "$2$3");
//        while (bracketReX[4].exec(str))
//            str = str.replace(bracketReX[4], "\\left$2\\right$3");
//    }
//    else {
//        while (bracketReX[4].exec(str))
//            str = str.replace(bracketReX[4], "$2$3");
//    }
    return str;
}

function operate(equation, operation, item) {
    if (operation != "latex") {
        equation = parseBrackets(equation);
        item = parseBrackets(item);
        if (operation != "unit" && operation != "eval")
            equation = equation.replace(/((?:\\Sigma ?|\\Delta ?)?(?:\\vec(\\\d+l){)?(?:(?<!\\\d+)[A-Za-z]|\\[A-Za-z]+(?<!Sigma|Delta) ?)(?:\2})?(?:_(?:[A-Za-z0-9]|(\\\d+l){[A-Za-z0-9\\ ]*\3}))?(?:\^(?:[A-Za-z0-9]|(\\\d+l){[A-Za-z0-9\\ ]*\4}))?)/g, " $1");
        item = typeof item == "string" ? item.replace(/((?:\\Sigma ?|\\Delta ?)?(?:\\vec(\\\d+l){)?(?:(?<!\\\d+)[A-Za-z]|\\[A-Za-z]+(?<!Sigma|Delta) ?)(?:\2})?(?:_(?:[A-Za-z0-9]|(\\\d+l){[A-Za-z0-9\\ ]*\3}))?(?:\^(?:[A-Za-z0-9]|(\\\d+l){[A-Za-z0-9\\ ]*\4}))?)/g, " $1") : undefined;
        Object.keys(data.substitution).forEach(key => {
            if (!data.substitution[key].multiline) {
                equation = equation.replace(data.substitution[key], key);
                item = typeof item == "string" ? item.replace(data.substitution[key], key) : undefined;
            }
            else {
                while (equation.match(data.substitution[key]) || typeof item == "string" && item.match(data.substitution[key])) {
                    equation = equation.replace(data.substitution[key], key);
                    item = typeof item == "string" ? item.replace(data.substitution[key], key) : undefined;
                }
            }
        });
        Object.keys(data.symbols).forEach(key => {
            equation = equation.replace(data.symbols[key], key)
            item = typeof item == "string" ? item.replace(data.symbols[key], key) : undefined;
        });
        if (operation == "unit")
            equation = equation.replace(/μ /g, "μ")
    }
    if (operation != "latex" && operation != "mathjs" && operation != "simplify" && operation != "eval" && operation != "unit")
        equation = equation.split("=").map(exp => math.simplify(operation.replace("$&", exp).replace("$0", item))).join(" = ");
    else if (operation == "simplify")
        equation = equation.split("=").map(exp => math.simplify(exp)).join(" = ");
    else if (operation == "eval")
        equation = equation.split("=")[0] + "=" + (item ? math.eval(equation.split("=")[1], item) : math.eval(equation.split("=")[1]));
    if (operation != "mathjs" && operation != "unit") {
        if (operation == "eval") {
            var value = equation.match(/(?<== ?)\d*\.?\d*/);
            equation = equation.replace(/(?<== ?)\d*\.?\d*/, "");
        }
        equation = equation.split("= ").map(exp => math.parse(exp).toTex({
            parenthesis: "auto",
            handler: (node, options) => {
                if (node.type == "SymbolNode") {
                    if (data.antisubstitution[node.name])
                        return data.antisubstitution[node.name];
                    else if (data.symbols[node.name])
                        return data.symbols[node.name].source.replace(/\\(.)/g, "$1");
                    else if (node.name.match(/vec_|[ΔΣ]_|_\w\w/))
                        return node.name.replace(/vec_([^ _]*)/, "\\vec{$1}").replace(/Δ_/, "\\Delta ").replace(/Σ_/, "\\Sigma ").replace(/_([^ ]{2,})/, "_{$1}");
                    else
                        return node.name
                }
                else if (node.type == "ConstantNode") {
                    return data.antisubstitution[node.value]
                }
                else if (node.type == "OperatorNode") {
                    if (node.fn == "multiply" && !(node.args[0].type == "ConstantNode" && node.args[1].type == "ConstantNode"))
                        return node.args[0].toTex({parenthesis: "keep", handler: options.handler}) + node.args[1].toTex({parenthesis: "keep", handler: options.handler});
                    else if (node.fn == "pow" && node.args[1].type == "ParenthesisNode" && node.args[1].content.type == "OperatorNode" && node.args[1].content.fn == "divide" && node.args[1].content.args[0].type == "ConstantNode" && node.args[1].content.args[0].value == 1) {
                        if (node.args[1].content.args[1].value == 2)
                            return "\\sqrt{" + node.args[0].toTex(options) + "}";
                        else
                            return "\\sqrt[" + node.args[1].content.args[1].toTex(options) + "]{" + node.args[0].toTex(options) + "}"
                    }
//                    else if (node.fn == "divide" && node.args[0].type == "OperatorNode" && node.args[0].fn == "unaryMinus") {
//                        return "-\\frac{" + node.args[0] + "}{" +  + "}"
//                    }
                }
            }
        })).join(" = ");
//        equation = unparseBrackets(parseBrackets(equation).replace(/\\mathrm(\\\d+l){(.*)\1}/g, "$2"))
        if (operation == "eval")
            equation = equation.replace("=", "=" + math.parse(value).toString(3) + "\\left[") + "\\right]";
//        Object.keys(data.antisubsitution).forEach(key => {equation = equation.replace(data.antisubstitution[key], key)})
//        Object.keys(data.symbols).forEach(key => {equation = equation.replace(RegExp(key.replace(/[$()*+\-.?[\\\]^{|}]/g, "\\$&"), "g"), data.symbols[key].source)});
    }
    return equation;
}

function getOperations(latex, equation) {
    latex = parseBrackets(latex)
    return data.operations.reduce((opList, operation) => {if (latex.match(operation.requirements) && (!operation.verification || operation.verification(latex, equation))) opList.push(operation); return opList}, []);
}