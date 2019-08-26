/* globals MathQuill, math, data, givens, equations, equationSolutions, equationSelection, problems, modal, operate, parseBrackets, getOperations, popup, popupSizer, Proxy */
document.querySelectorAll("[id]").forEach(elem => window[elem.id] = elem);

var MQ = MathQuill.getInterface(2);
MQ.MathDisplay = (el, opts) => {
    if (!MQ(el))
        MQ.MathField(el, opts);
    el.addEventListener("keypress", (e) => e.preventDefault());
    el.addEventListener("keydown", (e) => {e.key.match(/Arrow/) || e.stopPropagation(); e.preventDefault()}, true);
    el.style.border = "none";
    el.style.boxShadow = "none";
};
//MQ.MathSelection = (el, opts) => {
//    if (!MQ(el))
//        MQ.MathField(el, opts);
//}
var dragBorder = {
    start: (event) => {
        event.preventDefault();
        pointers[event.pointerId] = event.target.computedStyleMap().getAll("height")[0].toString() == "100%" ? ["border", event.path, "clientX", "width", (event.target.getBoundingClientRect().left - event.path[1].getBoundingClientRect().left == 0) * -2 + 1] : ["border", event.path, "clientY", "height", (event.target.getBoundingClientRect().top - event.path[1].getBoundingClientRect().top == 0) * -2 + 1];
        pointers[event.pointerId][5] = event[pointers[event.pointerId][2]];
    },
    mid: (event) => {
        if (pointers[event.pointerId] && pointers[event.pointerId][0] == "border") {
            let pointer = pointers[event.pointerId],
                initialState, index;
            if (borderEvents[index = Array.prototype.indexOf.call(sectionBorders, pointer[1][0])].length) {
                initialState = pointer[1][1].style[pointer[3]]
            }
            pointer[1][1].style[pointer[3]] = parseFloat(pointer[1][1].style[pointer[3]]) + pointer[4] * (event[pointer[2]] - pointer[5]) + "px"; 
            pointer[5] = event[pointer[2]];
            if (initialState) {
                borderEvents[index].forEach(listener => listener(initialState, pointer[1][1].style[pointer[3]]))
            }
        }
    },
    end: (event) => {
        delete pointers[event.pointerId];
    }
}, sectionBorders = document.querySelectorAll(".border"), pointers = [], borderEvents = Array(sectionBorders.length).fill().map(() => []);
var ignore, timer = 0, mouseState = false, popupOffset = 0, activeStream, selectionEq;

function problem() {
    var problemDiv = document.createElement("div");
        problemDiv.classList.add("problem");
        var problemDisplay = document.createElement("div");
            problemDisplay.innerHTML = "\\mathit{New\\ Equation}";
            problemDisplay.addEventListener("click", () => {MQ(problemDisplay).blur(), loadProblem(Array.prototype.indexOf.call(problems.querySelector(".list").children, problemDiv))})
            problemDisplay.addEventListener("dblclick", () => {MQ(problemDisplay).select()})
        problemDiv.appendChild(problemDisplay);
    problems.querySelector(".list").appendChild(problemDiv);
    MQ.MathField(problemDisplay);
    document.querySelector("#equations .add").dispatchEvent(new MouseEvent("click"));
    currentProblem = problemSet.problems.length;
}
problem.prototype = {
    equations: [],
    givens: {}
}

function equation(latex) {
    var that = this;
    this.history = new Proxy([latex], {
        get: (eqs, attr) => {
            switch (attr) {
                case "push":
                    return (latex) => {
                        var equationStream = equations.querySelector(".solutions").children[that.id], equationSpacer = equationStream.children[equationStream.childElementCount - 1];
                        that.answer = [undefined, [undefined, undefined]];
                        if (document.querySelector(".mq-selection"))
                            that.history.strip(Array.prototype.indexOf.call(equationStream.children, selectionEq) - 1);
                        MQ(selectionEq).clearSelection();
                        var equationSpan = document.createElement("span");
                            equationSpan.classList.add("latex");
                            equationSpan.innerHTML = latex;
                        equationStream.insertBefore(equationSpan, equationSpacer);
                        MQ.MathDisplay(equationSpan);
                        equationSpacer.style.height = "calc(50% - 2.5px - (" + equationSpan.getBoundingClientRect().height + "px / 2)";
//                        equationStream.scrollTo({top: equationStream.height, left: 0, behavior: "smooth"});
                        equationStream.scrollTop = equationStream.scrollHeight;
                        return eqs.push(MQ(equationSpan).latex());
                    };
                case "map":
                    return (callback, context) => {
                        return eqs.map((...arguments) => {return callback(...arguments)}, context)
                    };
                case "strip":
                    return (start = 1, end = eqs.length) => {
                        var equationStream = equationSolutions.querySelector(".solutions").children[that.id];
                        for (let i = start; i < end; i ++) {
                            equationStream.children[start + 2].remove()
                        }
                        eqs.length = start;
                    }
                default:
                    return eqs[attr];
            }
        },
        set: (eqs, i, latex) => {
            if (Number.isFinite(parseInt(i)) && i < eqs.length && that.problem == currentProblem)
                MQ(equations.querySelector(".solutions").children[that.id].children[parseInt(i) + 2]).latex(latex);
            return eqs[i] = latex;
        }
    });
    this.problem = currentProblem
}
equation.prototype = {
    get current() {return this.history[this.history.length - 1]},
    set current(eq) {return this.history.push(eq)},
    get id() {return problemSet.problems[this.problem].equations.indexOf(this)},
    answer: [undefined, [undefined, undefined]]
};

sectionBorders.forEach((border, index) => {
    border.addEventListener("pointerdown", dragBorder.start);
    window.addEventListener("pointermove", dragBorder.mid);
    window.addEventListener("pointerup", dragBorder.end);
    border.addEventListener("dragstart", (e) => e.preventDefault());
    border.on = (eventName, callback) => {
        if (eventName == "resize") {
            borderEvents[index].push(callback)
        }
    }
    border.off = (eventName, callback) => {
        if (eventName == "resize") {
            borderEvents[index].splice(borderEvents[index].indexOf(callback), 1)
        }
    }
});

function dropDown(event) {
    var category = event.target.parentElement.parentElement;
    category.classList.toggle("open");
    if (category.children[1].style.height == "") {
        var height = category.children[1].getBoundingClientRect().height;
        category.classList.toggle("open");
        category.children[1].style.height = height + "px";
        setTimeout(() => category.classList.toggle("open"), 0);
    }
}

window.addEventListener("keydown", e => {
    if (e.key == "Escape" && document.querySelector("#modal.active, #miniModal.active"))
        document.querySelector("#modal.active, #miniModal.active").querySelector(".navigation .secondary, .navigation .primary").dispatchEvent(new MouseEvent("click"));
    else if (e.key == "Enter" && document.querySelector("#modal.active, #miniModal.active") && document.querySelector("#modal.active, #miniModal.active").querySelector(".navigation .secondary"))
        document.querySelector("#modal.active, #miniModal.active").querySelector(".navigation .primary").dispatchEvent(new MouseEvent("click"));
    else if (e.key == "Escape" && !document.querySelector("#modal.active, #miniModal.active") && document.querySelector("#equations.selecting") && document.querySelector("#equations .stream"))
        document.querySelector("#equations.selecting").classList.remove("selecting");
});

function getMQSelection(mathField) {
    var mFMQ = MQ(mathField)
    if (mFMQ && mathField.getElementsByClassName("mq-selection").length) {
        var start = mFMQ.latex();
        var retVal = mFMQ.write("\\text{selection}").latex();
        var selection = start.replace(RegExp("^" + retVal.replace(/\\text{selection}.*$/, "").replace(/[$()*+\-.?[\\\]^{|}]/g, "\\$&")), "").replace(RegExp(retVal.replace(/^.*\\text{selection}/, "").replace(/[$()*+\-.?[\\\]^{|}]/g, "\\$&") + "$"), "");
        retVal = retVal.replace("\\text{selection}", "\\$s" + selection + "\\$e");
        mFMQ.keystroke("Shift-Left").write(selection).keystroke("Shift-Left ".repeat(parseBrackets(selection).match(/(\\\d+)[([{|].*\1[)\]}|]|\\\w*(?:(?:(\\\d+l)[[{].*\2[\]}])+| |$|(?=\\[A-Za-z]))|[A-Za-z\d.!=/*+-]|_[A-Za-z\d]\^[A-Za-z\d]|[_^][A-Za-z\d]|_(\\\d+l)[[{].*\3[\]}]\^(\\\d+l)[[{].*\4[\]}]|[_^](\\\d+l)[[{].*\5[\]}]/gy).length));
        return retVal;
    }
    else {
        return getSelection();
    }
}

function operationPopup() {
    var selection = document.querySelector("#equationSolutions .mq-selection")
    if (selection) {
        var mqeq = selection.closest(".latex"),
            stream = activeStream = mqeq.closest(".stream"),
            eqData = problemSet.problems[currentProblem].equations[Array.prototype.indexOf.call(document.getElementsByClassName("solutions")[0].children, stream)],
            string = getMQSelection(mqeq),
//            borders = selection.getBoundingClientRect(),
            operations = getOperations(string, eqData);
        if (operations.length) {
            popup.innerHTML = "";
            for (var op of operations) {
                let opFunc = op.operation,
                    opButton = document.createElement("span");
                    opButton.classList.add("operationButton");
                    opButton.innerHTML = op.title;
                    opButton.title = op.name;
                    opButton.addEventListener("click", () => {selectionEq = mqeq; opFunc(string, eqData)});
                popup.appendChild(opButton);
            }
            selection = document.querySelector("#equationSolutions .mq-selection");
//            popupSizer.style.transform = "translate(calc(" + (selection.offsetLeft + selection.offsetWidth / 2) + "px - 50%), calc(-100% - 15px + " + selection.offsetTop + "px))";
            popupSizer.classList.add("visible");
            popupOffset = [selection.offsetLeft + selection.offsetWidth / 2 - popupSizer.offsetWidth / 2, - mqeq.offsetTop - Math.min(selection.offsetTop, ...Array.prototype.map.call(selection.children, elm => elm.offsetTop)) + 15];
            popupSizer.style.left = mqeq.offsetLeft + popupOffset[0] + "px";
            popupSizer.style.bottom = equationSolutions.offsetHeight + popupOffset[1] + stream.scrollTop + "px";
            if (popupSizer.offsetLeft - equationSolutions.scrollLeft <= 0)
                popup.style.transform = "translate(" + (- popupSizer.offsetLeft + equationSolutions.scrollLeft) + "px)";
            else if (popupSizer.offsetLeft + popupSizer.offsetWidth - equationSolutions.scrollLeft >= equationSolutions.offsetWidth)
                popup.style.transform = "translate(" + (equationSolutions.offsetWidth -popupSizer.offsetLeft - popupSizer.offsetWidth + equationSolutions.scrollLeft) + "px)";
            else
                popup.style.transform = "";
            stream.addEventListener("scroll", relocatorY);
//            mqeq.appendChild(popupSizer);
        }
    }
}

function relocatorX() {
    var selection = document.querySelector(".mq-selection")
    popupSizer.style.left = selection.closest(".latex").offsetLeft + popupOffset[0] + "px";
}

function relocatorY(e) {
    popupSizer.style.bottom =  equationSolutions.offsetHeight + popupOffset[1] + e.target.scrollTop + "px";
}

popup.addEventListener("pointerdown", (e) => {e.stopPropagation(); e.preventDefault()})

document.addEventListener("selectionchange", () => {
    popupSizer.classList.remove("visible");
    (activeStream || {removeEventListener: () => {}}).removeEventListener("scroll", relocatorY);
    if (timer) {
        clearTimeout(timer);
        timer = 0;
    }
    (document.querySelector(".selected") || {classList:{remove:()=>{}}}).classList.remove("selected")
    var sel = document.querySelector("#equationSolutions .mq-selection")
    if (sel) {
        sel.closest(".latex").classList.add("selected")
        timer = mouseState || setTimeout(operationPopup, 500);
    }
})

equationSolutions.addEventListener("pointerdown", e => {if (e.button === 0) mouseState = true})

equationSolutions.addEventListener("pointerup", e => {
    if (e.button === 0) mouseState = false; if (timer === true) timer = setTimeout(operationPopup, 500)})

//var popupObserver = new ResizeObserver(e => {
//    for (var i of e) {
//        if (!i.isIntersecting && i.target == popup || i.target != popup) {
//            correctScrolling()
//        }
//    }
//})

function correctScrolling() {
    if (popupSizer.classList.contains("visible")) {
        relocatorX()
        if (popupSizer.offsetLeft - equationSolutions.scrollLeft <= 0)
            popup.style.transform = "translate(" + (- popupSizer.offsetLeft + equationSolutions.scrollLeft) + "px)";
        else if (popupSizer.offsetLeft + popupSizer.offsetWidth - equationSolutions.scrollLeft >= equationSolutions.offsetWidth)
            popup.style.transform = "translate(" + (equationSolutions.offsetWidth -popupSizer.offsetLeft - popupSizer.offsetWidth + equationSolutions.scrollLeft) + "px)";
    }
}

//popupObserver.observe(equationSolutions);
equationSolutions.addEventListener("scroll", correctScrolling);
window.addEventListener("resize", correctScrolling);
sectionBorders[0].on("resize", correctScrolling);
sectionBorders[2].on("resize", correctScrolling);

document.querySelector("#givens .add").addEventListener("click", e => {
    e.preventDefault();
    modal.classList.add("active");
    var modalNavigation = modal.querySelector(".navigation");
    var modalTitle = modal.querySelector(".title");
    var modalContent = modal.querySelector(".content");
    modalNavigation.innerHTML = "";
    modalContent.innerHTML = "";
    
    var done = document.createElement("div");
        done.classList.add("primary");
        done.innerHTML = "Done";
        done.addEventListener("click", () => {
            modal.classList.remove("active");
            confirmButton.dispatchEvent(new MouseEvent("click"));
            givenList.innerHTML = "";
            givenDisplay.querySelectorAll(".given").forEach(given => givenList.appendChild(given));
        });
    modalNavigation.appendChild(done);
    
    modalTitle.innerHTML = "Enter All Givens";
    
    var givenIn = document.createElement("div");
        givenIn.classList.add("givenInput")
        var helptext = document.createElement("div");
            helptext.classList.add("helpme");
            helptext.innerHTML = "<span>Symbol</span> = <span>Number</span> [<span>Unit</span>]";
        givenIn.appendChild(helptext);
        var nameIn = document.createElement("div"), activeInput = nameIn;
            nameIn.classList.add("latex");
            nameIn.addEventListener("keypress", e => {
                if (e.key == "=") {
                    MQ(numberIn).focus();
                    e.preventDefault();
                }
                else if (e.key == "_" && parseBrackets(MQ(nameIn).latex()).match(/^(?:\\Sigma ?|\\Delta ?)?\\vec(\\\d+l){(?:[A-Za-z]|\\[A-Za-z]+(?<!Sigma|Delta) ?)\1}$/)) {
                    MQ(nameIn).moveToRightEnd()
                }
            }, true)
            nameIn.addEventListener("focusin", () => activeInput = nameIn);
        givenIn.appendChild(nameIn);
        givenIn.appendChild(document.createTextNode(" = "));
        var numberIn = document.createElement("div");
            numberIn.classList.add("latex");
            numberIn.addEventListener("keypress", e => {
                if (e.key == "[") {
                    MQ(unitIn).focus();
                    e.preventDefault();
                }
            }, true);
            numberIn.addEventListener("focusin", () => activeInput = numberIn);
        givenIn.appendChild(numberIn);
        givenIn.appendChild(document.createTextNode(" ["));
        var unitIn = document.createElement("div");
            unitIn.classList.add("latex");
            unitIn.addEventListener("keypress", e => {
                if (e.key == "/" && !MQ(unitIn).latex().match(/^\\frac/)) {
                    e.preventDefault();
                    MQ(unitIn).latex("\\frac{" + MQ(unitIn).latex() + "}{}");
                    MQ(unitIn).keystroke("Left");
                }
                else if (e.key == "]") {
                    confirmButton.dispatchEvent(new MouseEvent("click"))
                }
            })
            unitIn.addEventListener("focusin", () => activeInput = unitIn);
        givenIn.appendChild(unitIn);
        givenIn.appendChild(document.createTextNode("]"));
        var confirmButton = document.createElement("img");
            confirmButton.src = "images/check.svg";
            confirmButton.width = "20";
            confirmButton.title = "Verify Given";
            confirmButton.addEventListener("click", () => {
                MQ(nameIn).moveToLeftEnd().keystroke("Backspace").blur()
                MQ(numberIn).moveToLeftEnd().keystroke("Backspace").blur()
                MQ(unitIn).moveToLeftEnd().keystroke("Backspace").blur()
                if (!nameIn.classList.contains("error") && !numberIn.classList.contains("error") && !unitIn.classList.contains("error")) {
                    var name = MQ(nameIn).latex(), number = MQ(numberIn).latex(), unit = MQ(unitIn).latex();
                    problemSet.problems[currentProblem].givens[name] = [number, unit];
                    var given = document.createElement("div");
                        given.classList.add("given");
                        var givenText = document.createElement("div");
                            givenText.classList.add("latex");
                            givenText.innerHTML = name + "=" + number + (unit && "\\ \\left[" + unit + "\\right]");
                        given.appendChild(givenText)
                        var x = document.createElement("img");
                            x.src = "images/x.svg";
                            x.width = "20";
                            x.addEventListener("click", () => {
                                if (!document.body.contains(givenDisplay))
                                    givenDisplay = document.querySelector("#modalGivens");
                                if (confirm("Are you sure you want to delete this given?")) {
                                    if (ignore == name)
                                        ignore = undefined;
                                    delete problemSet.problems[currentProblem].givens[name];
                                    given.remove();
                                }
                            });
                        given.appendChild(x);
                        var edit = document.createElement("img");
                            edit.src = "images/edit.svg";
                            edit.width = "20";
                            edit.addEventListener("click", () => {
                                if (!document.body.contains(nameIn)) {
                                    [nameIn, numberIn, unitIn] = modal.getElementsByClassName("latex");
                                    confirmButton = modal.getElementsByTagName("img")[0]
                                }
                                ignore = name;
                                MQ(nameIn).latex(name);
                                MQ(numberIn).latex(number);
                                MQ(unitIn).latex(unit);
                                confirmButton.addEventListener("click", () => {
                                    given.remove()
                                    ignore = undefined
                                }, {captures: true, once: true});
                            });
                        given.appendChild(edit);
                    givenDisplay.appendChild(given);
                    MQ.StaticMath(givenText);
                    MQ(nameIn).latex("");
                    MQ(numberIn).latex("");
                    MQ(unitIn).latex("");
                    nameIn.classList.remove("error");
                    numberIn.classList.remove("error");
                }
            })
        givenIn.appendChild(confirmButton);
    modalContent.appendChild(givenIn);
    MQ.MathField(nameIn, {handlers: {
        edit: () => {
            var name = MQ(nameIn).latex(), value = parseBrackets(name);
            if (!value.match(/^(?:\\Sigma ?|\\Delta ?)?(?:\\vec(\\\d+l){)?(?:[A-Za-z]|\\[A-Za-z]+(?<!Sigma|Delta|sin|cos|tan|csc|sec|cot|log))(?:\1})?(?:_(?:[A-Za-z0-9]|(\\\d+l){[A-Za-z0-9\\ ]*\2}))?$/) || Object.keys(problemSet.problems[currentProblem].givens).includes(name) && ignore != name)
                nameIn.classList.add("error");
            else
                nameIn.classList.remove("error");
        },
        enter: () => confirmButton.dispatchEvent(new MouseEvent("click"))
    }});
    MQ.MathField(numberIn, {handlers: {
        edit: () => {
            var value = parseBrackets(MQ(numberIn).latex());
            if (!value.match(/^-?\d*\.?\d*(?:\\pi(?:\^-?\d+)?)?$(?<!^$)|^-?\\frac\\\d+l{\d+(?:\\pi(?:\^\d+)?)?\\\d+l}\\\d+l{\d*[1-9]\d*(?:\\pi(?:\^\d+)?)?\\\d+l}$/))
                numberIn.classList.add("error");
            else
                numberIn.classList.remove("error");
        },
        enter: () => confirmButton.dispatchEvent(new MouseEvent("click"))
    }});
    MQ.MathField(unitIn, {handlers: {
        edit: () => {
            try {
                var value = parseBrackets(MQ(unitIn).latex());
                if (!value.match(/^(?:(?:\\frac\\\d+l{)?(?:(?:[a-zA-Z]+|\\deg ?|\\AA ?|\\Omega ?|\\mu ?)(?:\^\d|\^\\\d+l{?\d{2,}\\\d+l}?)?(?:\\ )?)+(?:(?<=\\frac.+)\\\d+l}\\\d+l{(?:(?:[a-zA-Z]+|\\deg ?|\\AA ?|\\Omega ?|\\mu ?)(?:\^\d|\\\d+l{?\^\d{2,}\\\d+l}?)?(?:\\ )?)+\\\d+l})?)?$/))
                    throw new Error();
                math.unit(operate(value, "unit"));
                unitIn.classList.remove("error");
            }
            catch(err) {
                unitIn.classList.add("error");
            }
        },
        enter: () => confirmButton.dispatchEvent(new MouseEvent("click"))
    }});
    var givenList = givens.querySelector(".list");
    var givenDisplay = document.createElement("div");
        givenDisplay.classList.add("modalGivens");
        givenList.querySelectorAll(".given").forEach(elm => {
            givenDisplay.appendChild(elm);
            givenList.appendChild(elm.cloneNode(true));
        });
    modalContent.appendChild(givenDisplay);
    var latexButtons = document.createElement("div");
        latexButtons.classList.add("keys");
        var piButton = document.createElement("div");
            piButton.innerHTML = "π";
            piButton.title = "Pi (\\pi)";
            piButton.addEventListener("click", () => MQ(activeInput).cmd("\\pi").focus());
        latexButtons.appendChild(piButton);
        var SigmaButton = document.createElement("div");
            SigmaButton.innerHTML = "Σ";
            SigmaButton.title = "Sigma (\\Sigma)";
            SigmaButton.addEventListener("click", () => MQ(activeInput).cmd("\\Sigma").focus());
        latexButtons.appendChild(SigmaButton);
        var DeltaButton = document.createElement("div");
            DeltaButton.innerHTML = "Δ";
            DeltaButton.title = "Delta (\\Delta)";
            DeltaButton.addEventListener("click", () => MQ(activeInput).cmd("\\Delta").focus());
        latexButtons.appendChild(DeltaButton);
        var thetaButton = document.createElement("div");
            thetaButton.innerHTML = "θ";
            thetaButton.title = "Theta (\\theta)";
            thetaButton.addEventListener("click", () => MQ(activeInput).cmd("\\theta").focus());
        latexButtons.appendChild(thetaButton);
        var phiButton = document.createElement("div");
            phiButton.innerHTML = "φ";
            phiButton.title = "Phi (\\phi)";
            phiButton.addEventListener("click", () => MQ(activeInput).cmd("\\phi").focus());
        latexButtons.appendChild(phiButton);
        var muButton = document.createElement("div");
            muButton.innerHTML = "μ";
            muButton.title = "Mu (\\mu)";
            muButton.addEventListener("click", () => MQ(activeInput).cmd("\\mu").focus());
        latexButtons.appendChild(muButton);
        var vecButton = document.createElement("div");
            vecButton.innerHTML = "x<span class='vecArrow'>&rarr;</span>";
            vecButton.title = "Vector (\\vec)";
            vecButton.addEventListener("click", () => MQ(activeInput).cmd("\\vec").focus());
        latexButtons.appendChild(vecButton);
        var OmegaButton = document.createElement("div");
            OmegaButton.innerHTML = "Ω";
            OmegaButton.title = "Omega (\\Omega)";
            OmegaButton.addEventListener("click", () => MQ(activeInput).cmd("\\Omega").focus());
        latexButtons.appendChild(OmegaButton);
    modalContent.appendChild(latexButtons);
});

document.querySelector("#equations .add").addEventListener("click", e => {
    if (e)
        e.preventDefault();
    if (!e || !e.isTrusted)
        equations.classList.add("forced");
    equations.classList.add("selecting");
    equationSelection.children[0].innerHTML = "";
    Object.keys(data.equations).forEach(category => {
        var categoryDiv = document.createElement("div");
            categoryDiv.classList.add("category");
            var categoryTitle = document.createElement("span");
                categoryTitle.classList.add("title");
                categoryTitle.innerHTML = category;
                    var dropDownArrow = document.createElement("img");
                    dropDownArrow.src = "images/arrow.svg";
                    dropDownArrow.addEventListener("click", dropDown);
                categoryTitle.appendChild(dropDownArrow);
            categoryDiv.appendChild(categoryTitle);
            var categoryEquations = document.createElement("div");
                categoryEquations.classList.add("equationList");
                data.equations[category].forEach((equation) => {
                    var equationSpan = document.createElement("span");
                        equationSpan.classList.add("latex");
                        equationSpan.innerHTML = equation;
                    categoryEquations.appendChild(equationSpan);
                });
            categoryDiv.appendChild(categoryEquations);
        equationSelection.children[0].appendChild(categoryDiv);
    });
    var categoryDiv = document.createElement("div");
        categoryDiv.classList.add("category");
        var categoryTitle = document.createElement("span");
            categoryTitle.classList.add("title");
            categoryTitle.innerHTML = "Custom";
            var dropDownArrow = document.createElement("img");
                dropDownArrow.src = "images/arrow.svg";
                dropDownArrow.addEventListener("click", dropDown);
            categoryTitle.appendChild(dropDownArrow);
        categoryDiv.appendChild(categoryTitle);
        var categoryEquations = document.createElement("div");
            categoryEquations.classList.add("equationList");
            problemSet.customEquations.forEach((equation) => {
                var equationSpan = document.createElement("span");
                    equationSpan.classList.add("latex");
                    equationSpan.innerHTML = equation;
                categoryEquations.appendChild(equationSpan);
            });
            var addEquation = document.createElement("img");
                addEquation.src = "images/add.svg";
                addEquation.width = 40;
            categoryEquations.appendChild(addEquation);
        categoryDiv.appendChild(categoryEquations);
    equationSelection.children[0].appendChild(categoryDiv);
    Array.prototype.forEach.call( document.querySelectorAll("#equationSelection .latex"), (elm) => {
        var math = MQ.StaticMath(elm);
        elm.addEventListener("click", () => {
            var eq;
            problemSet.problems[currentProblem].equations.push(eq = new equation(math.latex().match(/(.*?)(?:\\text{.*}|$)/)[1]));
            var equationStream = document.createElement("div");
                equationStream.classList.add("stream");
                equationStream.equation = eq;
                var deleteSpacer = document.createElement("div");
                    deleteSpacer.classList.add("spacer");
                equationStream.appendChild(deleteSpacer);
                var deleteX = document.createElement("span");
                    deleteX.classList.add("latex");
                    deleteX.classList.add("delete");
                    deleteX.innerHTML = "X";
                    deleteX.addEventListener("click", e => {
                        e.preventDefault();
                        if (confirm("Are you sure you want to delete this equation? (This action cannot be undone.)")) {
                            problemSet.problems[currentProblem].equations.splice(Array.prototype.indexOf.call(equationSolutions.children[0].children, equationStream), 1);
                            equationSolutions.children[0].removeChild(equationStream);
                            if (equationSolutions.children[0].childElementCount === 0)
                                document.querySelector("#equations .add").dispatchEvent(new MouseEvent("click"));
                        }
                    });
                equationStream.appendChild(deleteX);
                var equationSpan = document.createElement("span");
                    equationSpan.classList.add("latex");
                    equationSpan.innerHTML = math.latex().match(/(.*?)(?:\\text{.*}|$)/)[1];
                equationStream.appendChild(equationSpan);
                var equationSpacer = document.createElement("div");
                    equationSpacer.classList.add("spacer");
                equationStream.appendChild(equationSpacer);
            equationSolutions.children[0].appendChild(equationStream);
            MQ.MathDisplay(equationSpan);
            equationSpacer.style.height = "calc(50% - 2.5px - (" + equationSpan.getBoundingClientRect().height + "px / 2)";
            equations.classList.remove("selecting");
            equations.classList.remove("forced");
        });
    });
});

document.querySelector("#equations .cancel").addEventListener("click", () => {
    equations.classList.remove("selecting");
})

document.querySelector("#problems .add").addEventListener("click", e => {
    e.preventDefault();
    equationSolutions.querySelector(".solutions").innerHTML = "";
    givens.querySelector(".list").innerHTML = "";
    problemSet.problems.push(new problem());
});

document.querySelector("#tutorialButton").addEventListener("click", e => {
    e.preventDefault();
    modal.classList.add("active");
    modal.classList.add("tutorial");
    var modalNavigation = modal.querySelector(".navigation");
    var modalTitle = modal.querySelector(".title");
    var modalContent = modal.querySelector(".content");
    
    modalNavigation.innerHTML = "";
    
    var index = 0, slides = [
        [
            "Creating Givens",
            "Givens",
            "<ol><li>Start by clicking the plus button at the bottom of the left pane.<li>Then input the name and value of the given<ul><li>The first box is for the name, the second is for the value, and the third is for the number</ul><li>All inputs are verified before you're allowed to create a given<li>Once you are done with your variable, click the checkmark to make it a given<li>If you made a mistake, hover over a given to edit or delete it.</ol>"
        ],
        [
            "Superscripts and Subscripts",
            "SupSub",
            "<ul><li>Superscripts can be entered by typing a caret (^)<li>Subscripts can be entered by typing an underscore(_)<li>Greek letters can be entered by typing a backslash (\\) followed by the name of the letter, such as \\pi; the first letter indicates the case<li>Other commands can also be entered by typing a backslash followed by the name of the command, such as \\sqrt</ul>"
        ],
        [
            "Equation Selection",
            "Equations",
            "<ul><li>The pre-programmed equations are sorted by category because of their volume</ul><ol><li>The equation menu will be displayed by default when no equations are on the screen, but the plus button in the center pane can be used to add another one<li>Click on the triangle to the right of the category to expand or retract the category<li>Click on an equation to add it to your workspace<li>Accidental or unwanted equations can be removed with the X above the equation</ol>"
        ],
        [
            "Algebraic Manipulation",
            "Algebra",
            "<ol><li>After an equation is selected, drag your cursor over part of the equation to select it<li>Then click one of the operations to manipulate the equation; hover over the operation for more detail<li>Some operations will bring up a popup for more information; others will execute immediately.</ol>"
        ],
        [
            "Preparing to Solve",
            "Solving",
            "<ul><li>Once you have solved for a variable, you can substitute in the values for the numbers and have the calculator solve it out<li>To solve, there must be one variable on the left side of the equation and only known variables on the right side<li>Solving is preformed as an operation once the other criteria are met; just select the whole equation or the second half to substitute<li>To help you understand, solving is a two-part operation<ol><li>First, all the numbers and units are substituted in<li>Then, the equation is evaluated to show a final answer</ol></ul>"
        ]
    ];

    var next = document.createElement("div");
        next.classList.add("primary");
        next.innerHTML = "Next";
        next.addEventListener("click", () => {
            index ++;
            index %= slides.length;
            
            modalTitle.innerHTML = slides[index][0];
            modalContent.innerHTML = "<span><img src='images/tutorials/" + slides[index][1] + ".png'></span>" + slides[index][2];
        });
    modalNavigation.appendChild(next);
    var previous = document.createElement("div");
        previous.classList.add("primary")
        previous.innerHTML = "Previous";
        previous.addEventListener("click", () => {
            index += slides.length - 1;
            index %= slides.length;
            
            modalTitle.innerHTML = slides[index][0];
            modalContent.innerHTML = "<span><img src='images/tutorials/" + slides[index][1] + ".png'></span>" + slides[index][2];
        });
    modalNavigation.appendChild(previous);
    var close = document.createElement("div");
        close.classList.add("secondary");
        close.innerHTML = "Close";
        close.addEventListener("click", () => {modal.classList.remove("active"); modal.classList.remove("tutorial")});
    modalNavigation.appendChild(close);
    
    modalTitle.innerHTML = slides[index][0];
    modalContent.innerHTML = "<span><img src='images/tutorials/" + slides[index][1] + ".png'></span>" + slides[index][2];
})

var problemSet = {
    customEquations: [],
    problems: []
}, currentProblem = 0;

problemSet.problems.push(new problem());
