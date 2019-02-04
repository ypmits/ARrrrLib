import Time from 'Time';
import Diagnostics from 'Diagnostics';
import CameraInfo from 'CameraInfo';

class EffectController {
    constructor() {
        //Different page names 
        this.pageNames = Object.freeze({
            // Enum of page names makes it easier to show/hide a page
            // mainMenu: "mainMenu",
            // textMenu: "textMenu"
        });

        //Get the size of the screen in pixels
        this.screenSize = {"width" : CameraInfo.previewSize.width,"height": CameraInfo.previewSize.height};
        var screenSizeSub = CameraInfo.previewSize.width.monitor({fireOnInitialValue:true}).subscribeWithSnapshot(this.screenSize,(e,screenSizeSnapshot)=>{
            screenSizeSub.unsubscribe();

            this.screenSize = screenSizeSnapshot;
            this.init();
        });
    }

    //Run the effect controller after 
    init() {
        // ObjectFinder Example
        // ObjectFinder.find("plane0").transform.scaleX = this.screenSize.width/1500;
        
        //CreatePages
        this.createPages();
    }

    //Create all the pages needed in the effect in here
    createPages() {
        // Example:
        // this.pages = {
        //     [this.pageNames.mainMenu]: new TestPage(ObjectFinder.find("plane0"),this),
        //     [this.pageNames.textMenu]: new TestPage(ObjectFinder.find("3dText0"),this)
        // };
    }

    
    showPage(id) {
        this.showHidePage(id,true);
    }

    
    hidePage(id) {
        this.showHidePage(id,false);
    }

    showHidePage(id, show) {
        if(Array.isArray(id)) {
            id.forEach(pageID => {
                try {
                    this.pages[pageID][(show)?"show":"hide"]();
                } catch(e) {
                    Diagnostics.log(`[warning] could not find page with id: "${pageID}" to ${(show)?"show":"hide"}`);
                }
            });
        } else {
            try {
                this.pages[id][(show)?"show":"hide"]();
            } catch(e) {
                Diagnostics.log(`[warning] could not find page with id: "${id}" to ${(show)?"show":"hide"}`);
            }
        }
    }
}