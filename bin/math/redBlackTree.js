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
    let result = {};
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
let a = createIntersection(new TestA(), null);
let d = new TestA();
let aa;
if (isTestA(a)) {
    let b = a.attr1;
    console.log("111111111111111111");
}
else {
    let c = a;
    console.log("2222222222222222222222222");
}
let aaa = [];
let bbb = aaa.values();
let ccc = bbb.next();
export {};
//# sourceMappingURL=redBlackTree.js.map