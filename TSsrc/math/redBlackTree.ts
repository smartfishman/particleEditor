import { createShader } from "../core/render/webglUtils";

/**
 * 红黑树
 */
class RedBlackTree {
    private _root: RedBlackTreeNode;



    public addNode(node: RedBlackTreeNode): void {

    }

    private findInsertNodeByValue(value: number): RedBlackTreeNode {
        return
    }
}

class RedBlackTreeNode {
    public value: number = 0;
    public color: COLOR = COLOR.RED;
    public parent: RedBlackTreeNode;
    public lChild: RedBlackTreeNode;
    public rChild: RedBlackTreeNode;
}

enum COLOR {
    RED,
    BLACK,
}



function createIntersection<T, U>(first: T, second: U): T | U {
    let result;
    for (let id in first) {
        result[id] = first[id];
    }
    for (let id in second) {
        result[id] = second[id];
    }
    return result;
}

function isTestA(a: any): a is TestA {
    return a instanceof TestA;
}

class TestA {
    public attr1: number = 1;
}
class TestB {
    public attr2: number = 2;
}
class TestC {
    public attr3: number = 2;
}

let a = createIntersection(new TestA(), new TestB());
let aa: TestA | TestB | TestC;
if (isTestA(aa)) {
    let b = aa.attr1;
} else {
    let c = aa
}