/* globals problemSet, currentProblem, operate, miniModal, MQ, parseBrackets, unparseBrackets, math */

var data = { // eslint-disable-line no-unused-vars
    equations: {
        Kinematics: [
            "v=\\frac{\\Delta d}{\\Delta t}",
            "\\vec{v}=\\frac{\\Delta\\vec{d}}{\\Delta t}",
            "\\vec{v}=\\frac{\\vec{v}_1+\\vec{v}_2}{2}",
            "a=\\frac{\\Delta\\vec{v}}{\\Delta t}",
            "\\vec{v}_f=\\vec{v}_i+a\\Delta t",
            "\\Delta\\vec{d}=\\vec{v}_i\\Delta t+\\frac{1}{2}a\\Delta t^2",
            "\\Delta\\vec{d}=\\vec{v}_f\\Delta t-\\frac{1}{2}a\\Delta t^2",
            "\\vec{v}_f^2=\\vec{v}_i^2+2a\\Delta\\vec{d}"
        ],
        Forces: [
            "\\Sigma F=0",
            "\\Sigma F=ma",
            "F_1=-F_2",
            "F_g=ma_g",
            "F_{fs}\\le\\mu_sF_N",
            "F_{fk}=\\mu_kF_N",
            "F_s=-kx",
            "a_c=\\frac{v^2}{r}",
            "\\Sigma F=\\frac{mv^2}{r}",
            "a_G=Gm/r^2",
            "F_G=\\frac{Gm_1m_2}{r^2}"
        ],
        Momentum: [
            "p=m\\vec{v}",
            "\\Delta p=F\\Delta t",
            "\\Sigma p_i=\\Sigma p_f"
        ],
        Energy: [
            "W=F_{\\parallel}\\Delta\\vec{d}",
            "W=\\Delta E",
            "E_g=ma_gh",
            "E_K=\\frac{1}{2}mv^2",
            "E_e=\\frac{1}{2}kx^2",
            "\\Sigma E_i=\\Sigma E_f",
            "P=\\frac{W}{\\Delta t}"
        ],
        "Thermodynamics": [
//            "T_C=\\frac{5}{9}\\left(T_F-32\\right)",
//            "T_K=T_C+273",
//            "\\Delta T_C=\\Delta T_K",
//            "\\Delta T_C=\\frac{5}{9}\\Delta T_F",
            "PV=nRT",
            "\\frac{P_1V_1}{T_1}=\\frac{P_2V_2}{T_2}",
            "Q=mc_p\\Delta T",
            "Q=mL",
            "\\Delta U=Q+W",
            "W=-P\\Delta V",
            "Q_H=W+Q_L",
            "\\Delta S=\\frac{Q}{T_K}"
        ],
        
        "Periodic Motion": [
            "T=\\frac{1}{f}",
            "T_{pendulum}=2\\pi\\sqrt{\\frac{l}{a_g}}",
            "T_{spring}=2\\pi\\sqrt{\\frac{m}{k}}"
        ],
        "Light and Optics": [
            "n=\\frac{c}{\\vec{v}}",
            "\vec{v}=\\lambda f",
            "E=\\frac{P}{4\\pi r^2}",
            "n_1\\sin\\theta_1=n_2\\sin\\theta_2",
            "\\sin\\theta_c=\\frac{n_2}{n_1}",
            "f=\\frac{r}{2}",
            "\\frac{1}{f}=\\frac{1}{d_o}+\\frac{1}{d_i}",
            "M=\\frac{h_i}{h_o}=-\\frac{d_i}{d_o}"
        ],
        Magnetism: [
            "F_B=B_{\\perp}q\\vec{v}",
            "F_B=B_{\\perp}IL",
            "\\varepsilon=B_{\\perp}l\\vec{v}",
            "\\frac{V_p}{V_s}=\\frac{n_p}{n_s}=\\frac{I_s}{I_p}"
        ],
        "Modern Physics": [
            "E=hf",
            "E_{kmax}=hf-\\phi",
            "E=mc^2"
        ],
        Electricity: [
            "F_e=\\frac{kq_1q_2}{r^2}",
            "E=\\frac{F_e}{q}",
            "E=\\frac{kQ}{r^2}",
            "V=Ed",
            "V=\\frac{KQ}{r}",
            "V=\\frac{W}{q}=\\frac{\\Delta E_p}{q}",
            "\\Delta E_p=-\\Delta E_k",
            "V=IR",
            "I=\\frac{q}{\\Delta t}",
            "P=IV",
            "R_{eq}=\\Sigma R",
            "\\frac{1}{R_{eq}}=\\Sigma\\frac{1}{R}"
        ],
        "2D Geometry": [
            "C=\\pi d=2\\pi r",
            "A=\\pi r^2=\\frac{\\pid^2}{4}",
            "A=lw",
            "A=bh \\text{ (Parallelogram)}",
            "A=\\frac{1}{2}bh \\text{ (Triangle)}",
            "c^2=a^2+b^2"
        ],
        "3D Geometry": [
            "A=4\\pi r^2",
            "V=\\frac{4}{3}\\pi r^3",
            "V=lwh",
            "A=2\\pi rl+2\\pi r^2",
            "V=\\pi r^2l",
            "A=\\pi r^2+\\pi r\\sqrt{r^2+h^2}",
            "V=\\frac{1}{3}\\pi r^2h"
        ]
    },
    constants: {
        a_g: [9.80665, "\\frac{m}{s^2}"],
        G: [6.6740831e-11, "\\frac{N m^2}{kg^2}"],
        k: [8.9875517873681764e9, "\\frac{N m^2}{C^2}"],
        m_e: [9.10938356e-31, "kg"],
        m_p: [1.6726219e-27, "kg"],
        q_e: [-1.602176620898e-19, "C"],
        q_p: [1.602176620898e-19, "C"],
        c: [2.99792458e8, "\\frac{m}{s}"],
        h: [6.62607004e-34, "\\frac{J}{s}"],
        M_E: [5.9722e24, "kg"],
        r_E: [6.378e6, "m"],
        "\\pi": [Math.PI, ""],
    },
//    units: {
//        x: "m",
//        y: "m",
//        z: "m",
//        d: "m",
//        "\\vec{x}": "m",
//        "\\vec{y}": "m",
//        "\\vec{z}": "m",
//        "\\vec{d}": "m",
//        t: "s",
//        v: "m/s",
//        "\\vec{v}": "m/s",
//        a: "m/s^2",
//        F: "N",
//        μ: "",
//        "\\theta": "r",
//        "\\phi": "r"
//    },
    symbols: {
        α: /\\alpha/g,
        β: /\\beta/g,
        γ: /\\gamma/g,
        Γ: /\\Gamma/g,
        δ: /\\delta/g,
        Δ: /\\Delta/g,
        "∆": /\\Delta/g,
        ϵ: /\\epsilon/g,
        ε: /\\varepsilon/g,
        ζ: /\\zeta/g,
        η: /\\eta/g,
        θ: /\\theta/g,
        ϑ: /\\vartheta/g,
        Θ: /\\Theta/g,
        κ: /\\kappa/g,
        λ: /\\lambda/g,
        Λ: /\\Lambda/g,
        μ: /\\mu/g,
        µ: /\\mu/g,
        ν: /\\nu/g,
        ξ: /\\xi/g,
        Ξ: /\\Xi/g,
        π: /\\pi/g,
        Π: /\\Pi/g,
        ϖ: /\\varpi/g,
        ρ: /\\rho/g,
        ϱ: /\\varrho/g,
        σ: /\\sigma/g,
        Σ: /\\Sigma/g,
        ς: /\\varsigma/g,
        τ: /\\tau/g,
        υ: /\\upsilon/g,
        Υ: /\\Upsilon/g,
        φ: /\\phi/g,
        Φ: /\\Phi/g,
        ϕ: /\\varphi/g,
        χ: /\\chi/g,
        ψ: /\\psi/g,
        Ψ: /\\Psi/g,
        ω: /\\omega/g,
        Ω: /\\Omega/g,
        "°": /\\degree/g,
        Å: /\\AA/g,
        "∂": /\\partial/g,
        "∞": /\\infinity/g,
        "•": /\\cdot/g,
        "⁄": /\\frac/g
    },
    substitution: {
        " degC ": /\\degree C/g,
        " degF ": /\\degree F/g,
        " degR ": /\\degree R/g,
        " deg ": /\\degree/g,
        " deg  ": /\\deg/g,
        " angstrom ": /\\AA/g,
        " Infinity ": /\\inf/g,
        " * ": /\\cdot/g,
        " sqrt($2) ": /\\sqrt(\\\d+l){(.*)\1}/g,
        " nthRoot($4, $2) ": /\\sqrt(\\\d+l)[(.*)\1](\\\d+l){(.*)\3}/g,
        " asin ": /\\sin^\\\d+l{-1\\\d+l}(?!^)/g,
        " acos ": /\\cos^\\\d+l{-1\\\d+l}(?!^)/g,
        " atan ": /\\tan^\\\d+l{-1\\\d+l}(?!^)/g,
        " sin ": /\\sin(?:^\\\d+l{-1}^\\\d+l{-1})?/g,
        " cos ": /\\cos(?:^\\\d+l{-1}^\\\d+l{-1})?/g,
        " tan ": /\\tan(?:^\\\d+l{-1}^\\\d+l{-1})?/g,
        " acsc ": /\\csc^\\\d+l{-1\\\d+l}(?!^)/g,
        " asec ": /\\sec^\\\d+l{-1\\\d+l}(?!^)/g,
        " acot ": /\\cot^\\\d+l{-1\\\d+l}(?!^)/g,
        " csc ": /\\csc(?:^\\\d+l{-1}^\\\d+l{-1})?/g,
        " sec ": /\\sec(?:^\\\d+l{-1}^\\\d+l{-1})?/g,
        " cot ": /\\cot(?:^\\\d+l{-1}^\\\d+l{-1})?/g,
        "Δ_": /\\Delta ?/g,
        "Σ_": /\\Sigma ?/g,
        "vec_$2": /\\vec(\\\d+l){(.*)\1}/g,
        "_$2": /_(\\\d+l){(.*)\1}/g,
        "/": /\\div/g,
        "(($2) / ($4))": /\\frac(\\\d+l){(.*)\1}(\\\d+l){(.*)\3}/gm,
        "($2)": /(\\\d+)\((.*)\1\)/gm, // m triggers multimatch, not multiline
        "": /\\d+(?=[(){}[\]|])/g,
        " ": /\\ /g,
    },
    antisubstitution: {
//        "\\degree C": /degC/g,
//        "\\degree F": /degF/g,
//        "\\degree R": /degR/g,
//        "\\degree": /deg/g,
//        "\\AA": /angstrom/g,
//        "\\inf": /infinity/g,
        "deg": "\\degreee",
        "degC": "\\degreeC",
        "degF": "\\degreeF",
        "degR": "\\degreeR",
        "angstrom": "\\AA",
        "Infinity": "\\inf"
//        "\\sqrt{$2$4}": /sqrt(\\\d+)\((.*)\1\)|nthRoot(\\\d+)\((.*), ?2\3\)/g,
//        "\\sqrt[]{}": /nthRoot(\\\d+)\(((?:[^()]|(\\\d+)\(.*\3\))*), ?((?:[^()]|(\\\d+)\(.*\5\))*)\1\)/g,
//        "\\sin^{-1}": /asin/g,
//        "\\cos^{-1}": /acos/g,
//        "\\tan^{-1}": /atan/g,
//        "\\sin": /sin/g,
//        "\\cos": /cos/g,
//        "\\tan": /tan/g,
//        "\\csc^{-1}": /acsc/g,
//        "\\sec^{-1}": /asec/g,
//        "\\cot^{-1}": /acot/g,
//        "\\csc": /csc/g,
//        "\\sec": /sec/g,
//        "\\cot": /cot/g,
    },
    operations: [ // not in parens (after other validation): (?!.*(\\\d+l?)[)}\]|](?<=\1[({[|].*\\\$s.*))
        {
            name: "Change Subscript",
            title: "<span>x<sub>&hellip;</sub></span>",
            requirements: /(?<!\\Sigma ?|\\Delta ?|\\vec\\\d+l{)\\\$s(?:\\Sigma ?|\\Delta ?)?(?:\\vec(\\\d+l){)?(?:[A-Za-z]|\\[A-Za-z]+(?<!Sigma|Delta) ?)(?:\1})?(?:_(?:[A-Za-z0-9]|(\\\d+l){[A-Za-z0-9\\ ]*\2}))?(?:\^(?:[A-Za-z0-9]|(\\\d+l){[A-Za-z0-9\\ ]*\3}))?\\\$e(?!_)/,
            operation(sel, eq) {
                miniModal.classList.add("active");
                var modalNavigation = miniModal.querySelector(".navigation");
                var modalTitle = miniModal.querySelector(".title");
                var modalContent = miniModal.querySelector(".content");
                modalNavigation.innerHTML = "";
                modalContent.innerHTML = "";
                var done = document.createElement("div");
                    done.classList.add("primary");
                    done.classList.add("disabled");
                    done.innerHTML = "Done";
                    done.addEventListener("click", () => {
                        if (!done.classList.contains("disabled")){
                            var newName = MQ(name).latex().replace(/_{ }/, "");
                            if ((renameToggle.checked ? problemSet.problems[currentProblem].equations : {every: func => func(eq)}).every(eqStr => !eqStr.history.every(oldEq => oldEq.match(newName)))) {
                                miniModal.classList.remove("active");
                                (renameToggle.checked ? problemSet.problems[currentProblem].equations : {forEach: func => func(eq)}).forEach(equation => {
                                    equation.history.forEach((eq, i) => equation.history[i] = eq.replace(RegExp(sel.replace(/.*\\\$s|\\\$e.*/g,"").replace(/[$()*+\-.?[\\\]^{|}]/g, "\\$&") + "(?!_)", "g"), newName));
                                });
                            }
                        }
                    });
                modalNavigation.appendChild(done);
                var cancel = document.createElement("div");
                    cancel.classList.add("secondary");
                    cancel.innerHTML = "Cancel";
                    cancel.addEventListener("click", () => miniModal.classList.remove("active"));
                modalNavigation.appendChild(cancel);
                
                modalTitle.innerHTML = "Change Subscript"
                
                var name = document.createElement("div");
                    name.classList.add("latex");
                    name.classList.add("expressionInput");
                    name.innerHTML = unparseBrackets(parseBrackets(sel.match(/\\\$s(.*)\\\$e/)[1]).replace(/_(\\\d+l){(.*)\1}|_(.)|$/, "_{\\MathQuillMathField{$2$3}}"))
                modalContent.appendChild(name);
                MQ.StaticMath(name).innerFields[0].config({handlers: {
                    edit: () => {
                        if (MQ(name).latex().replace(/_{ }/, "") == sel.replace(/.*\\\$s|\\\$e.*/g, ""))
                            done.classList.add("disabled");
                        else
                            done.classList.remove("disabled");
                    }
                }});
                var rename = document.createElement("div");
                    rename.classList.add("option");
                    var renameToggle = document.createElement("input");
                        renameToggle.setAttribute("type", "checkbox");
                    rename.appendChild(renameToggle);
                    rename.appendChild(document.createTextNode(" Overwrite in all equations (in current problem)"))
                modalContent.appendChild(rename);
            }
        },
        {
            name: "Substitute and Solve",
            title: "x=#",
            requirements: /^(?=.*(?:^(?:\\\$s)?|=)(?:\\Sigma ?|\\Delta ?)?(?:\\vec(\\\d+l){)?(?:[A-Za-z]|\\[A-Za-z]+(?<!Sigma|Delta) ?)(?:\1})?(?:_(?:[A-Za-z0-9]|(\\\d+l){[A-Za-z0-9\\ ]*\2}))?(?:=|(?:\\\$e)?$))(?:.*=)?\\\$s.*\\\$e(?:=.*)?$/,
            verification: (sel) =>
                parseBrackets(sel.replace(/\\\$[se]/g, "").replace(/(?:^|=)(?:\\Sigma ?|\\Delta ?)?(?:\\vec(\\\d+l){)?(?:[A-Za-z]|\\[A-Za-z]+(?<!Sigma|Delta) ?)(?:\1})?(?:_(?:[A-Za-z0-9]|(\\\d+l){[A-Za-z0-9\\ ]*\2}))?(?:=|$)/, "")).match(/(?:\\Sigma ?|\\Delta ?)?(?:\\vec(\\\d+l){)?(?:(?<!\\[^\s\\{}()[\]]*)[A-Za-z]|\\[A-Za-z]+(?<!Sigma|Delta|sin|cos|tan|csc|sec|cot|log)(?![A-Za-z]*\\\d+l)(?!=[A-Za-z]*\\\d+l?) ?)(?:\1})?(?:_(?:[A-Za-z0-9]|(\\\d+l){[A-Za-z0-9\\ ]*\2}))?/g).every(variable => {
                    variable = unparseBrackets(variable);
                    return problemSet.problems[currentProblem].givens[variable] || problemSet.problems[currentProblem].equations.reduce((res, eq) => {
                        if (eq.answer[0])
                            res[eq.answer[0]] = eq.answer[1];
                        return res;
                    }, {})[variable] || data.constants[variable];
                }),
            operation: (sel, eq) => {
                if (sel.match(/=(?:\\Sigma ?|\\Delta ?)?(?:\\vec(\\\d+l){)?(?:[A-Za-z]|\\[A-Za-z]+(?<!Sigma|Delta) ?)(?:\1})?(?:_(?:[A-Za-z0-9]|(\\\d+l){[A-Za-z0-9\\ ]*\2}))?$/)) {
                    data.operations.find(op => op.name == "Flip Equation").operation(sel, eq);
                    sel = sel.split("=").reverse().join("=");
                }
                var start = sel.replace(/\\\$[se]/g, "");
                eq.current = start.replace(/=.*/, "=") + unparseBrackets(parseBrackets(start.replace(/.*=/, "")).replace(/(?:\\Sigma ?|\\Delta ?)?(?:\\vec(\\\d+l){)?(?:(?<!\\[^\s\\{}()[\]]*)[A-Za-z]|\\[A-Za-z]+(?<!Sigma|Delta|sin|cos|tan|csc|sec|cot|log)(?![A-Za-z]*\\\d+l)(?!=[A-Za-z]*\\\d+l?) ?)(?:\1})?(?:_(?:[A-Za-z0-9]|(\\\d+l){[A-Za-z0-9\\ ]*\2}))?/g, variable => {
                    variable = unparseBrackets(variable);
                    var varVal = problemSet.problems[currentProblem].givens[variable] || problemSet.problems[currentProblem].equations.reduce((res, eq) => {
                        if (eq.answer[0])
                            res[eq.answer[0]] = eq.answer[1];
                        return res;
                    }, {})[variable] || data.constants[variable];
                    return varVal[0] + "\\ \\left[" + varVal[1] + "\\right]";
                })).replace(/](\d)/g, "]\\cdot $1");
                eq.current = operate(eq.current.replace(/\\left\[|\\right\]/g, " "), "eval");
                eq.answer = eq.current.split(/ ?= ?/);
                eq.answer[1] = eq.answer[1].replace("\\right]", "").split("\\left[");
                eq.history.forEach((tex, i) => eq.history[i] = tex.replace(/\d+\.?\d*/g, (num) => math.format(parseFloat(num), 3)));
            }
        },
        {
            name: "Add/Subtract",
            title: "+/-",
            requirements: /(?:\\\$s[+-]|^\\\$s|(?<=[=+-])\\\$s)[^=+-]*(?:(\\\d+l?)[([{|].*\1[|}\])])?[^=+-]*\\\$e(?=[+-=]|$)(?!.*(\\\d+l?)[)}\]|](?<=\1[({[|].*\\\$s.*))/,
            operation: (sel, eq) => {eq.current = operate(sel.replace(/\\\$[se]/g, ""), "($&) - ($0)", sel.replace(/.*\\\$s|\\\$e.*/g, ""))}
        },
        {
            name: "Multiply/Divide",
            title: "•/÷",
            requirements: /(?<![^=](?<!^)[-+][^=]*)(?<![_^])(?:\\\$s-?(?=[\\A-Za-z\d])(?:(?<!\d\\\$s)\d*\.?\d*(?!\\\$e\d))?(?:(?<!\\Sigma\\\$s|\\Delta\\\$s)(?:\\Sigma ?|\\Delta ?)?(?:[A-Za-z]|\\[A-Za-z]+(?<!Sigma|Delta)(?:(\\\d+l)[[{].*\1[\]}])* ?)(?:_(?:[A-Za-z\d]|(\\\d+l){[A-Za-z\d\\ ]*\2}))?(?:\^(?:[A-Za-z0-9]|(\\\d+l){[A-Za-z0-9\\ ]*\3}))?(?!\\\$e_))*\\\$e|\\frac(\\\d+l){.*\4}(\\\d+l){\\\$s.*\\\$e\5})(?![^=]*[-+])(?!.*(\\\d+l?)[)}\]|](?<=(?<!\\frac(?:\7{.*(\\\d+l)})?)\6[({[|].*\\\$s.*))/,
            operation: (sel, eq) => {
                if (parseBrackets(sel).match(/\\frac(\\\d+l){.*\1}(\\\d+l){.*\\\$s.*\\\$e.*\2}/))
                    eq.current = operate(sel.replace(/\\\$[se]/g, ""), "($&) * ($0)", sel.replace(/.*\\\$s|\\\$e.*/g, ""))
                else
                    eq.current = operate(sel.replace(/\\\$[se]/g, ""), "($&) / ($0)", sel.replace(/.*\\\$s|\\\$e.*/g, "").replace(/^-$/, "-1"))
            }
        },
        {
            name: "Exponentiate/Radicate",
            title: "^/√",
            requirements: /(?:^|=)(?:\^(\\\d+l){\\\$s.*\\\$e\1}|\\\$s(?:(?:\\Sigma ?|\\Delta ?)?(?:\\vec(\\\d+l){)?(?:[A-Za-z]|\\[A-Za-z]+(?<!Sigma|Delta) ?)(?:\2})?(?:_(?:[A-Za-z0-9]|(\\\d+l){[A-Za-z0-9\\ ]*\3}))?|(\\\d+)[(|].*\4[|)])\^(?:[A-Za-z\d]|(\\\d+l){.*\5})\\\$e|\\\$s\\sqrt(?:(\\\d+l)\[.*\6\])?(\\\d+l){.*\7}\\\$e)(?:$|=)/,
            operation: (sel, eq) => {
                if (sel.replace(/.*\\\$s|\\\$e.*/g).match(/^\\sqrt/))
                    eq.current = operate(sel.replace(/\\\$[se]/g, ""), "($&) ^ ($0)", parseBrackets(sel.replace(/.*\\\$s|\\\$e.*/g, "")).replace(/\\sqrt(?:(\\\d+l)[(.*)\1])(\\\d+l){.*\3}/, "$2") || 2)
                else
                    eq.current = operate(sel.replace(/\\\$[se]/g, ""), "($&) ^ (1 / ($0))", sel.replace(/.*\\\$s|\\\$e.*/g, "").replace(/[^^]*\^/, ""))
            }
        },
//        {
//            name: "Logarithmize",
//            title: "log(x)",
//            requirements: /(?:(?<!\d)\\\$s\d+\\\$e\^|(?<!\\Sigma ?|\\Delta ?)\\\$s(?:\\Sigma ?|\\Delta ?)?)(?!.*(\\\d+l?)[)}\]|](?<=\1[({[|].*\\\$s.*))/
//        },
        {
            name: "Flip Equation",
            title: "x =<span class='vecArrow sub'>&harr;</span>&nbsp;y",
            requirements: /^\\\$s.*\\\$e$|\\\$s=\\\$e/,
            operation: (sel, eq) => {eq.current = sel.replace(/\\\$[se]/g, "").replace(/^([^=]*)=([^=]*)$/, "$2=$1")}
        },
        {
            name: "Subsitute as 0",
            title: "&rarr; 0",
            requirements: /(?<!\\Sigma ?|\\Delta ?|\\vec\\\d+l{)\\\$s(?:\\Sigma ?|\\Delta ?)?(?:\\vec(\\\d+l){)?(?:[A-Za-z]|\\[A-Za-z]+(?<!Sigma|Delta) ?)(?:\1})?(?:_(?:[A-Za-z0-9]|(\\\d+l){[A-Za-z0-9\\ ]*\2}))?(?:\^(?:[A-Za-z0-9]|(\\\d+l){[A-Za-z0-9\\ ]*\3}))?\\\$e(?!_)/,
            verification: (sel) => (problemSet.problems[currentProblem].givens[sel.replace(/.*\\\$s|\\\$e.*/g, "")] || [])[0] === "0",
            operation: (sel, eq) => {
                eq.current = operate(sel.replace(/\\\$s.*\\\$e/, "\\left(0\\right)"), "$&")
            }
        },
//        {
//            name: "Subsitute as 1",
//            title: "&rarr; 1",
//            requirements: /(?<!\\Sigma ?|\\Delta ?|\\vec\\\d+l{)\\\$s(?:\\Sigma ?|\\Delta ?)?(?:\\vec(\\\d+l){)?(?:[A-Za-z]|\\[A-Za-z]+(?<!Sigma|Delta) ?)(?:\1})?(?:_(?:[A-Za-z0-9]|(\\\d+l){[A-Za-z0-9\\ ]*\2}))?(?:\^(?:[A-Za-z0-9]|(\\\d+l){[A-Za-z0-9\\ ]*\3}))?\\\$e(?!_)(?:(?<![-+=]\\\$s.*)|(?![-+=]))/,
//            verification: (sel, eq) => (problemSet.problems[currentProblem].givens[sel.replace(/.*\\\$s|\\\$e.*/g)] || [])[0] === "1",
//            operation: (sel, eq) => {
//                eq.current = operate(sel.replace(/\\\$s.*\\\$e/, "\\left(1\\right)"), "$&")
//            }
//        },
        {
            name: "Inverse Function",
            title: "<span>sin<sup>-1</sup>(x)</span>",
            requirements: /(?:^|=)\\\$s\\(?:sin|cos|tan|csc|sec|cot)(?:\^\\\d+l{-1\\\d+l})?(\\\d)\(.*\1\)\\\$e(?:$|=)/,
            operation: (sel, eq) => {eq.current = operate(sel.replace(/\\\$[se]/g, ""), "$1^{-1}($&)", sel.replace(/.*\\\$s|\\\$e.*/g, ""))}
        },
        {
            name: "Substitute as Component",
            title: "<img src='images/vectors.svg'>",
            requirements: /(?<!\\Sigma ?|\\Delta ?|\\vec\\\d+l{)\\\$s(?:\\Sigma ?|\\Delta ?)?(?:\\vec(\\\d+l){)?(?:[A-Za-z]|\\[A-Za-z]+(?<!Sigma|Delta) ?)(?:\1})?(?:_(?:[A-Za-z0-9]|(\\\d+l){[A-Za-z0-9\\ ]*\2}))?(?:\^(?:[A-Za-z0-9]|(\\\d+l){[A-Za-z0-9\\ ]*\3}))?(?:\^(?:[A-Za-z0-9]|(\\\d+l){[A-Za-z0-9\\ ]*\4}))?\\\$e(?!_)/,
            operation: (sel, eq) => {
                miniModal.classList.add("active");
                var modalNavigation = miniModal.querySelector(".navigation");
                var modalTitle = miniModal.querySelector(".title");
                var modalContent = miniModal.querySelector(".content");
                modalNavigation.innerHTML = "";
                modalContent.innerHTML = "";
                
                var done = document.createElement("div");
                    done.classList.add("primary");
                    done.classList.add("disabled");
                    done.innerHTML = "Done";
                    done.addEventListener("click", () => {
                        if (!done.classList.includes("disabled")) {
                            eq.current = sel.replace(/\\\$s.*\\\$e/, funcField.latex().replace(/_{ }|\u25BE/g, ""));
                            miniModal.classList.remove("active");
                        }
                    })
                modalNavigation.appendChild(done);
                var cancel = document.createElement("div");
                    cancel.classList.add("Secondary");
                    cancel.innerHTML = "Cancel";
                    cancel.addEventListener("click", () => miniModal.classList.remove("active"));
                modalNavigation.appendChild(cancel);
                
                modalTitle.innerHTML = "Select Component";
                
                var func = document.createElement("span");
                    func.classList.add("latex");
                    func.classList.add("expressionInput");
                    func.innerHTML = unparseBrackets(parseBrackets(sel.replace(/.*\\\$s|\\\$e.*/g, "")).replace(/^([^_]*)(?:_(\\\d+l){(.*)(?:[xy](?<!max))?\2}$|_[xy]$|_(.)$|$)/, "\\MathQuillMathField{" + (parseBrackets(sel.replace(/.*\\\$s|\\\$e.*/g, "")).match(/^[^_]*(?:_(\\\d+l){.*y\1}$|_y$)/) ? "cos" : "sin") + " \u25BE}\\left(\\theta_{\\MathQuillMathField{}}\\right)$1_{\\MathQuillMathField{$3$4}}"));
                modalContent.appendChild(func);
                var funcField = MQ.StaticMath(func);
                    var trigField = funcField.innerFields[0].el();
                        trigField.classList.add("selectionField");
                        var hideFunc = () => {
                            if (document.activeElement.closest(".mq-editable-field") != trigField) {
                                miniModal.removeEventListener("pointerdown", hideFunc);
                                miniModal.removeEventListener("keyPress", hideFunc);
                                funcDropdown.classList.remove("dropped");
                            }
                        };
                        trigField.addEventListener("focusin", () => {
                            funcDropdown.classList.add("dropped");
//                            miniModal.removeEventListener("pointerdown", hideFunc);
//                            miniModal.removeEventListener("keyPress", hideFunc);
                            miniModal.addEventListener("pointerdown", hideFunc);
                            miniModal.addEventListener("keyPress", hideFunc);
                            setTimeout(() => funcField.innerFields[0].blur());
                        });
                    funcField.innerFields[2].config({handlers: {
                        edit: () => {
                            if (funcField.innerFields[2].latex().replace(/_{ }/, "") == sel.replace(/.*\\\$s|\\\$e.*/g))
                                done.classList.add("disabled");
                            else
                                done.classList.remove("disabled");
                        }
                    }})
                var funcDropdown = document.createElement("div");
                    funcDropdown.classList.add("dropdown");
                    var sinOpt = document.createElement("span");
                        sinOpt.innerHTML = "sin";
                        sinOpt.addEventListener("pointerdown", () => funcField.innerFields[0].latex("sin \u25BE"));
                    funcDropdown.appendChild(sinOpt);
                    var cosOpt = document.createElement("span");
                        cosOpt.innerHTML = "cos";
                        cosOpt.addEventListener("pointerdown", () => funcField.innerFields[0].latex("cos \u25BE"));
                    funcDropdown.appendChild(cosOpt);
                trigField.appendChild(funcDropdown);
            }
        },
        {
            name: "Substitute for Sigma/Delta",
            title: "Σ/Δ",
            requirements: /(?<!\\Sigma ?|\\Delta ?|\\vec\\\d+l{)\\\$s(?:\\Sigma ?|\\Delta ?)(?:\\frac\\\d+l{1\\\d+l}(\\\d+l){)?(?:\\vec(\\\d+l){)?(?:[A-Za-z]|\\[A-Za-z]+(?<!Sigma|Delta) ?)(?:\2})?(?:_(?:[A-Za-z\d]|(\\\d+l){[A-Za-z\d\\ ]*\3}))?(?:\^(?:[A-Za-z0-9]|(\\\d+l){[A-Za-z0-9\\ ]*\4}))?(?:\1})?\\\$e(?!_)/,
            operation: (sel, eq) => {
                function verify() {
                    var elms = Array.from(miniModal.getElementsByClassName("portion"));
                    elms.forEach(elm => {
                        if (~elms.findIndex(elm2 => elm != elm2 && MQ(elm).latex() == MQ(elm2).latex()))
                            elm.classList.add("error");
                        else
                            elm.classList.remove("error");
                    })
                    if (miniModal.querySelector(".portion.error"))
                        done.classList.add("disabled");
                    else
                        done.classList.remove("disabled");
                }
                                     
                if (sel.match(/\\\$s\\Sigma/)) {
                    miniModal.classList.add("active");
                    var modalNavigation = miniModal.querySelector(".navigation");
                    var modalTitle = miniModal.querySelector(".title");
                    var modalContent = miniModal.querySelector(".content");
                    modalNavigation.innerHTML = "";
                    modalContent.innerHTML = "";

                    var done = document.createElement("div");
                        done.classList.add("primary");
//                        done.classList.add("disabled");
                        done.innerHTML = "Done";
                        done.addEventListener("click", () => {
                            if (!done.classList.contains("disabled")) {
                                eq.current = sel.replace(/\\\$s.*\\\$e/, Array.prototype.map.call(input.children, varInp => MQ(varInp).latex()).join("+"))
                                miniModal.classList.remove("active");
                            }
                        })
                    modalNavigation.appendChild(done);
                    var cancel = document.createElement("div");
                        cancel.classList.add("Secondary");
                        cancel.innerHTML = "Cancel";
                        cancel.addEventListener("click", () => miniModal.classList.remove("active"));
                    modalNavigation.appendChild(cancel);
                    
                    modalTitle.innerHTML = "Substitute for Sigma";
                    
                    var baseText = unparseBrackets(parseBrackets(sel.replace(/.*\\\$s|\\\$e.*/g, "")).replace(/^\\(?:Sigma|Delta)/, "").replace(/_(\\\d+l){(.*)\1}|_(.)|$/, "_{\\MathQuillMathField{$2$3}}")) ;
                    var input = document.createElement("div");
                        input.classList.add("expressionInput")
                        input.addEventListener("click", e => {
                            var portion = e.target.closest(".portion");
                            if (input.classList.contains("deleting") && portion && input.childElementCount < 1) {
                                if (portion.previousSibling)
                                    portion.previousSibling.remove()
                                else
                                    portion.nextSibling.remove()
                                portion.remove();
                                input.classList.remove("deleting");
                            }
                        }, true);
                        var var1 = document.createElement("span");
                            var1.innerHTML = baseText;
                            var1.classList.add("portion");
                        input.appendChild(var1);
                    modalContent.appendChild(input);
                    MQ.StaticMath(var1).innerFields[0].config({handlers: {edit: verify}});
                    var buttons = document.createElement("div");
                        buttons.classList.add("keys");
                        var add = document.createElement("div");
                            add.innerHTML = "+";
                            add.title = "Add variable";
                            add.addEventListener("click", () => {
                                input.appendChild(document.createTextNode("+"))
                                var newVar = document.createElement("span");
                                    newVar.innerHTML = baseText;
                                    newVar.classList.add("portion");
                                input.appendChild(newVar);
                                MQ.StaticMath(newVar).innerFields[0].config({handlers: {edit: verify}});
                                verify()
                            });
                        buttons.appendChild(add);
                        var del = document.createElement("div");
                            del.innerHTML = "x";
                            del.title = "Delete variable";
                            del.addEventListener("click", () => input.classList.add("deleting"))
                        buttons.appendChild(del);
                    modalContent.appendChild(buttons);
                }
                else if (sel.match(/\\\$s\\Delta/)) {
                    eq.current = unparseBrackets(parseBrackets(sel).replace(/\\\$s\\Delta ?([^_]*)(?:_(\\\d+l){(.*)\2})?\\\$e/, "$1_{$3f} - $1_{$3i}"));
                }
            }
        },
        {
            name: "Substitute for Variable",
            title: "x&rarr;&hellip;",
            requriements: /(?<!\\Sigma ?|\\Delta ?|\\vec\\\d+l{)\\\$s(?:\\Sigma ?|\\Delta ?)?(?:\\vec(\\\d+l){)?(?:[A-Za-z]|\\[A-Za-z]+(?<!Sigma|Delta) ?)(?:\1})?(?:_(?:[A-Za-z0-9]|(\\\d+l){[A-Za-z0-9\\ ]*\2}))?(?:\^(?:[A-Za-z0-9]|(\\\d+l){[A-Za-z0-9\\ ]*\3}))?\\\$e(?!_)/,
            verification: (sel, eq) => problemSet.problems[currentProblem].equations.some(eq2 => eq2 != eq && eq2.current.match(RegExp("^" + sel.match(/\\\$s(.*)\\\$e/)[1].replace(/[$()*+\-.?[\\\]^{|}]/g, "\\$&") + "="))),
            operation (sel, eq) {
                var matches = problemSet.problems[currentProblem].equations.filter(eq2 => eq2 != eq && eq2.current.match(RegExp("^" + sel.match(/\\\$s(.*)\\\$e/)[1].replace(/[$()*+\-.?[\\\]^{|}]/g, "\\$&") + "=")));
                if (matches.length > 1) {
                    miniModal.classList.add("active");
                    var modalNavigation = miniModal.querySelector(".navigation");
                    var modalTitle = miniModal.querySelector(".title");
                    var modalContent = miniModal.querySelector(".content");
                    modalNavigation.innerHTML = "";
                    modalContent.innerHTML = "";
                    
                    var done = document.createElement("div");
                        done.classList.add("primary");
                        done.classList.add("disabled");
                        done.innerHTML = "Done";
                        done.addEventListener("click", () => {
                            miniModal.classList.remove("active");
                            return eq.replace(RegExp(sel.replace(/[$()*+\-.?[\\\]^{|}]/g, "\\$&"), "g"), miniModal.getElementsByClassName("selected").value.match(/=(.+)/)[1]);
                        });
                    modalNavigation.appendChild(done);
                    var cancel = document.createElement("div");
                        cancel.classList.add("Secondary");
                        cancel.innerHTML = "Cancel";
                        cancel.addEventListener("click", () => miniModal.classList.remove("active"));
                    modalNavigation.appendChild(cancel);
                    matches.forEach((eq2) => {
                        var choice = document.createElement("div");
                            choice.classList.add("listChoice");
                            choice.innerHTML = choice.value = eq2.current;
                            choice.addEventListener("click", () => {
                                Array.prototype.forEach.apply(miniModal.getElementsByClassName("listChoice"), [elm => elm.classList.remove("selected")]);
                                choice.classList.add("selected");
                            });
                        modalContent.appendChild(choice);
                        MQ.StaticMath(choice);
                    });
                    
                    modalTitle.innerHTML = "Select Replacement Value";
                }
                else {
                    return eq.replace(RegExp(sel.replace(/[$()*+\-.?[\\\]^{|}]/g, "\\$&"), "g"), matches[0].current.match(/=(.+)/)[1]);
                }
            }
        }
    ]
//    conversions: {
//        m: {
//            in: 0.0254,
//            ft: 0.3048,
//            mi: 1609,
//            "\\AA": 1E-10,
//        }
//    },
//    prefixes: {
//        Y: 24,
//        Z: 21,
//        E: 18,
//        P: 15,
//        T: 12,
//        G: 9,
//        M: 6,
//        K: 3,
//        k: 3,
//        H: 2,
//        h: 2,
//        D: 1,
//        da: 1,
//        d: -1,
//        c: -2,
//        m: -3,
//        μ: -6,
//        "\\mu": -6,
//        n: -9,
//        p: -12,
//        f: -15,
//        a: -18,
//        z: -21,
//        y: -24
//    }
}