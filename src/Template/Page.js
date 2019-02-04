export default class Page {
    constructor(root, effectController) {
        this.root = root;
        this.effectController = effectController;
    }

    show() {
        this.root.hidden = false;
    }

    hide() {
        this.root.hidden = true;
    }
}

// Example:
// class TestPage extends Page {
//     constructor(root, effectController) {
//         super(root,effectController);
//     }
// }