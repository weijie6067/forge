///////////////////////////////////////////////////////////////////////////////
// TwoContextMenu viewer extension
// by KDJ,  2017.9
//
///////////////////////////////////////////////////////////////////////////////
AutodeskNamespace("Autodesk.ADN.Viewing.Extension");

Autodesk.ADN.Viewing.Extension.TwoContextMenu = function (viewer, options) {

    Autodesk.Viewing.Extension.call(this, viewer, options);

    var _self = this;

    _self.load = function () {
        var ContextMenu = Autodesk.Viewing.Private.ContextMenu;
        ContextMenu.prototype.showMenu = function (menu, x, y) {
            var container = document.createElement('div'),
                menuItem,
                submenus = [];

            container.className = 'menu';
            this.viewer.container.appendChild(container);
            this.menus.push(container);

            for (var i = 0; i < menu.length; ++i) {
                var defn = menu[i],
                    title = defn.title,
                    target = defn.target,
                    hasLevel = defn.hasLevel;
                 if(hasLevel == undefined){hasLevel=""}
                menuItem = this.createMenuItem(container, title, hasLevel);

                if (typeof target === 'function') {
                    this.addCallbackToMenuItem(menuItem, target);

                } else if (Array.isArray(target)) {
                    submenus.push({menuItem: menuItem, target: target});

                } else {
                    avp.logger.warn("Invalid context menu option:", title, target);
                }
            }

            var rect = container.getBoundingClientRect(),
                containerWidth = rect.width,
                containerHeight = rect.height,
                viewerRect = this.viewer.container.getBoundingClientRect(),
                viewerWidth = viewerRect.width,
                viewerHeight = viewerRect.height,
                shiftLeft = av.isTouchDevice() && !this.viewer.navigation.getUseLeftHandedInput();

            if (shiftLeft) {
                x -= containerWidth;
            }

            if (x < 0) {
                x = 0;
            }
            if (viewerWidth < x + containerWidth) {
                x = viewerWidth - containerWidth;
                if (x < 0) {
                    x = 0;
                }
            }

            if (y < 0) {
                y = 0;
            }
            if (viewerHeight < y + containerHeight) {
                y = viewerHeight - containerHeight;
                if (y < 0) {
                    y = 0;
                }
            }

            container.style.top = Math.round(y) + "px";
            container.style.left = Math.round(x) + "px";

            for (i = 0; i < submenus.length; ++i) {
                var submenu = submenus[i];

                menuItem = submenu.menuItem;
                rect = menuItem.getBoundingClientRect();
                x = Math.round((shiftLeft ? rect.left : rect.right) - viewerRect.left);
                y = Math.round(rect.top - viewerRect.top);

                this.addSubmenuCallbackToMenuItem(menuItem, submenu.target, x, y);
            }
        };

        ContextMenu.prototype.createMenuItem = function(parentItem, text, hasLevel) {
            var menuItem = document.createElement("div");
            menuItem.className = "menuItem";
            menuItem.setAttribute("data-i18n", text);
            menuItem.setAttribute("hasLevel", hasLevel);
            menuItem.textContent = Autodesk.Viewing.i18n.translate( text );
            parentItem.appendChild(menuItem);
            return menuItem;
        };

        ContextMenu.prototype.addCallbackToMenuItem = function (menuItem, target) {
            var that = this;

            $(".menu:first .menuItem").on('mouseover',function(){
                $(".menu:gt(0)").remove();
            })
            menuItem.addEventListener('click', function (event) {
                that.hide();
                target();
                event.preventDefault();
                return false;
            }, false);
           
        };

        ContextMenu.prototype.addSubmenuCallbackToMenuItem = function (menuItem, menu, x, y) {
            var that = this;
            menuItem.addEventListener('mouseover', function () {
                $(".menu:gt(0)").remove();
                that.showMenu(menu, x, y);

            }, false);
            
        };

        ContextMenu.prototype.hide = function() {
            if (this.open) {
                // for (var index=0; index<this.menus.length; ++index) {
                //     if(this.menus[index]) {
                //         this.menus[index].parentNode.removeChild(this.menus[index]);
                //     }
                // }
                $(".menu").remove();
                this.menus = [];
                this.open = false;
                document.body.removeEventListener(this.isTouch ? "touchstart" : "mousedown", this.hideEventListener);
                this.isTouch = false;
                return true;
            }
            return false;
        };

       

        console.log('Autodesk.ADN.Viewing.Extension.TwoContextMenu loaded');

        return true;
    };

    _self.unload = function () {

        console.log('Autodesk.ADN.Viewing.Extension.TwoContextMenu unloaded');

        return true;
    };
};

Autodesk.ADN.Viewing.Extension.TwoContextMenu.prototype =
    Object.create(Autodesk.Viewing.Extension.prototype);

Autodesk.ADN.Viewing.Extension.TwoContextMenu.prototype.constructor =
    Autodesk.ADN.Viewing.Extension.TwoContextMenu;

Autodesk.Viewing.theExtensionManager.registerExtension(
    'Autodesk.ADN.Viewing.Extension.TwoContextMenu',
    Autodesk.ADN.Viewing.Extension.TwoContextMenu);

