class AVLNode {
    constructor(value) {
        this.value = value;
        this.left = null;
        this.right = null;
        this.height = 1;
    }
}

class AVLTree {
    constructor() {
        this.root = null;
    }

    getHeight(node) {
        return node ? node.height : 0;
    }

    getBalanceFactor(node) {
        return node ? this.getHeight(node.left) - this.getHeight(node.right) : 0;
    }

    rotateRight(y) {
        let x = y.left;
        let T2 = x.right;
        x.right = y;
        y.left = T2;
        y.height = Math.max(this.getHeight(y.left), this.getHeight(y.right)) + 1;
        x.height = Math.max(this.getHeight(x.left), this.getHeight(x.right)) + 1;
        return x;
    }

    rotateLeft(x) {
        let y = x.right;
        let T2 = y.left;
        y.left = x;
        x.right = T2;
        x.height = Math.max(this.getHeight(x.left), this.getHeight(x.right)) + 1;
        y.height = Math.max(this.getHeight(y.left), this.getHeight(y.right)) + 1;
        return y;
    }

    insert(node, value) {
        if (!node) return new AVLNode(value);

        if (value < node.value) {
            node.left = this.insert(node.left, value);
        } else if (value > node.value) {
            node.right = this.insert(node.right, value);
        } else {
            return node; // No duplicates
        }

        node.height = Math.max(this.getHeight(node.left), this.getHeight(node.right)) + 1;
        let balance = this.getBalanceFactor(node);

        if (balance > 1 && value < node.left.value) return this.rotateRight(node);
        if (balance < -1 && value > node.right.value) return this.rotateLeft(node);
        if (balance > 1 && value > node.left.value) {
            node.left = this.rotateLeft(node.left);
            return this.rotateRight(node);
        }
        if (balance < -1 && value < node.right.value) {
            node.right = this.rotateRight(node.right);
            return this.rotateLeft(node);
        }

        return node;
    }

    getMinValueNode(node) {
        while (node.left) {
            node = node.left;
        }
        return node;
    }

    delete(node, value) {
        if (!node) return node;

        if (value < node.value) {
            node.left = this.delete(node.left, value);
        } else if (value > node.value) {
            node.right = this.delete(node.right, value);
        } else {
            if (!node.left || !node.right) {
                node = node.left ? node.left : node.right;
            } else {
                let temp = this.getMinValueNode(node.right);
                node.value = temp.value;
                node.right = this.delete(node.right, temp.value);
            }
        }

        if (!node) return node;

        node.height = Math.max(this.getHeight(node.left), this.getHeight(node.right)) + 1;
        let balance = this.getBalanceFactor(node);

        if (balance > 1 && this.getBalanceFactor(node.left) >= 0) return this.rotateRight(node);
        if (balance > 1 && this.getBalanceFactor(node.left) < 0) {
            node.left = this.rotateLeft(node.left);
            return this.rotateRight(node);
        }
        if (balance < -1 && this.getBalanceFactor(node.right) <= 0) return this.rotateLeft(node);
        if (balance < -1 && this.getBalanceFactor(node.right) > 0) {
            node.right = this.rotateRight(node.right);
            return this.rotateLeft(node);
        }

        return node;
    }

    insertValue(value) {
        this.root = this.insert(this.root, value);
        drawTree();
    }

    deleteValue(value) {
        this.root = this.delete(this.root, value);
        drawTree();
    }

    getTreeHeight() {
        document.getElementById("treeHeightDisplay").innerText = `Tree Height: ${this.getHeight(this.root)}`;
    }

    searchValue(value) {
        let node = this.search(this.root, value);
        document.getElementById("searchResultDisplay").innerText = node ? `Value ${value} found!` : `Value ${value} not found.`;
        drawTree(node);
    }

    search(node, value) {
        if (!node) return null;
        if (node.value === value) return node;
        return value < node.value ? this.search(node.left, value) : this.search(node.right, value);
    }

    reset() {
        this.root = null;
        drawTree();
        document.getElementById("treeHeightDisplay").innerText = "";
        document.getElementById("searchResultDisplay").innerText = "";
    }
}

let avlTree = new AVLTree();
let svg = d3.select("#treeSVG");

function insertNode() {
    let value = parseInt(document.getElementById("valueInput").value);
    if (!isNaN(value)) {
        avlTree.insertValue(value);
        document.getElementById("valueInput").value = "";
    }
}

function deleteNode() {
    let value = parseInt(document.getElementById("valueInput").value);
    if (!isNaN(value)) {
        avlTree.deleteValue(value);
        document.getElementById("valueInput").value = "";
    }
}

function getTreeHeight() {
    avlTree.getTreeHeight();
}

function searchNode() {
    let value = parseInt(document.getElementById("valueInput").value);
    if (!isNaN(value)) {
        avlTree.searchValue(value);
    }
}

function resetTree() {
    avlTree.reset();
}

function drawTree(highlightNode = null) {
    svg.selectAll("*").remove();
    let root = avlTree.root;
    if (root) drawNode(root, window.innerWidth / 2, 50, window.innerWidth / 8, highlightNode);
}

function drawNode(node, x, y, offset, highlightNode) {
    if (!node) return;

    let verticalSpacing = 50;

    if (node.left) {
        svg.append("line")
            .attr("x1", x).attr("y1", y)
            .attr("x2", x - offset).attr("y2", y + verticalSpacing)
            .attr("stroke", "black");

        drawNode(node.left, x - offset, y + verticalSpacing, offset / 1.8, highlightNode);
    }

    if (node.right) {
        svg.append("line")
            .attr("x1", x).attr("y1", y)
            .attr("x2", x + offset).attr("y2", y + verticalSpacing)
            .attr("stroke", "black");

        drawNode(node.right, x + offset, y + verticalSpacing, offset / 1.8, highlightNode);
    }

    svg.append("circle")
        .attr("cx", x)
        .attr("cy", y)
        .attr("r", 25)
        .attr("fill", highlightNode && highlightNode.value === node.value ? "red" : "lightgreen")
        .attr("stroke", "black");

    svg.append("text")
        .attr("x", x)
        .attr("y", y + 5)
        .attr("text-anchor", "middle")
        .attr("font-size", "20px")
        .text(node.value);
}
