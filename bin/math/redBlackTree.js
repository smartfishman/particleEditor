/**
 * 红黑树
 */
class RedBlackTree {
    addNode(node) {
    }
    findInsertNodeByValue(value) {
        return;
    }
}
class RedBlackTreeNode {
    constructor() {
        this.value = 0;
        this.color = COLOR.RED;
    }
}
var COLOR;
(function (COLOR) {
    COLOR[COLOR["RED"] = 0] = "RED";
    COLOR[COLOR["BLACK"] = 1] = "BLACK";
})(COLOR || (COLOR = {}));
function createIntersection(first, second) {
    let result;
    for (let id in first) {
        result[id] = first[id];
    }
    for (let id in second) {
        result[id] = second[id];
    }
    return result;
}
function isTestA(a) {
    return a instanceof TestA;
}
class TestA {
    constructor() {
        this.attr1 = 1;
    }
}
class TestB {
    constructor() {
        this.attr2 = 2;
    }
}
class TestC {
    constructor() {
        this.attr3 = 2;
    }
}
let a = createIntersection(new TestA(), new TestB());
let aa;
if (isTestA(aa)) {
    let b = aa.attr1;
}
else {
    let c = aa;
}
export {};
//# sourceMappingURL=redBlackTree.js.map