define(["require", "exports"], function (require, exports) {
    var Commands = (function () {
        function Commands() {
        }
        Commands.namespace = 'seadragonExtension.';
        Commands.CLEAR_SEARCH = Commands.namespace + 'onClearSearch';
        Commands.CURRENT_VIEW_URI = Commands.namespace + 'onCurrentViewUri';
        Commands.FIRST = Commands.namespace + 'onFirst';
        Commands.GALLERY_DECREASE_SIZE = Commands.namespace + 'onGalleryDecreaseSize';
        Commands.GALLERY_INCREASE_SIZE = Commands.namespace + 'onGalleryIncreaseSize';
        Commands.GALLERY_THUMB_SELECTED = Commands.namespace + 'onGalleryThumbSelected';
        Commands.HIDE_MULTISELECT_DIALOGUE = Commands.namespace + 'onHideMultiSelectDialogue';
        Commands.IMAGE_SEARCH = Commands.namespace + 'onImageSearch';
        Commands.LAST = Commands.namespace + 'onLast';
        Commands.MODE_CHANGED = Commands.namespace + 'onModeChanged';
        Commands.MULTISELECT_CHANGE = Commands.namespace + 'onMultiSelectChange';
        Commands.MULTISELECTION_MADE = Commands.namespace + 'onMultiSelectionMade';
        Commands.NEXT_SEARCH_RESULT = Commands.namespace + 'onNextSearchResult';
        Commands.NEXT = Commands.namespace + 'onNext';
        Commands.NEXT_IMAGES_SEARCH_RESULT_UNAVAILABLE = Commands.namespace + 'onNextImagesSearchResultUnavailable';
        Commands.PREV_IMAGES_SEARCH_RESULT_UNAVAILABLE = Commands.namespace + 'onPrevImagesSearchResultUnavailable';
        Commands.OPEN_THUMBS_VIEW = Commands.namespace + 'onOpenThumbsView';
        Commands.OPEN_TREE_VIEW = Commands.namespace + 'onOpenTreeView';
        Commands.PAGE_SEARCH = Commands.namespace + 'onPageSearch';
        Commands.PAGING_TOGGLED = Commands.namespace + 'onPagingToggled';
        Commands.PREV_SEARCH_RESULT = Commands.namespace + 'onPrevSearchResult';
        Commands.PREV = Commands.namespace + 'onPrev';
        Commands.PRINT = Commands.namespace + 'onPrint';
        Commands.ROTATE = Commands.namespace + 'onRotate';
        Commands.SEADRAGON_ANIMATION_FINISH = Commands.namespace + 'onAnimationfinish';
        Commands.SEADRAGON_ANIMATION_START = Commands.namespace + 'onAnimationStart';
        Commands.SEADRAGON_ANIMATION = Commands.namespace + 'onAnimation';
        Commands.SEADRAGON_OPEN = Commands.namespace + 'onOpen';
        Commands.SEADRAGON_RESIZE = Commands.namespace + 'onResize';
        Commands.SEADRAGON_ROTATION = Commands.namespace + 'onRotation';
        Commands.SEARCH_PREVIEW_FINISH = Commands.namespace + 'onSearchPreviewFinish';
        Commands.SEARCH_PREVIEW_START = Commands.namespace + 'onSearchPreviewStart';
        Commands.SEARCH_RESULT_CANVAS_CHANGED = Commands.namespace + 'onSearchResultCanvasChanged';
        Commands.SEARCH_RESULT_RECT_CHANGED = Commands.namespace + 'onSearchResultRectChanged';
        Commands.SEARCH_RESULTS_EMPTY = Commands.namespace + 'onSearchResultsEmpty';
        Commands.SEARCH_RESULTS = Commands.namespace + 'onSearchResults';
        Commands.SEARCH_RESULTS_CLEARED = Commands.namespace + 'onSearchResultsCleared';
        Commands.SEARCH = Commands.namespace + 'onSearch';
        Commands.SHOW_MULTISELECT_DIALOGUE = Commands.namespace + 'onShowMultiSelectDialogue';
        Commands.THUMB_MULTISELECTED = Commands.namespace + 'onThumbMultiSelected';
        Commands.TREE_NODE_MULTISELECTED = Commands.namespace + 'onTreeNodeMultiSelected';
        Commands.TREE_NODE_SELECTED = Commands.namespace + 'onTreeNodeSelected';
        Commands.VIEW_PAGE = Commands.namespace + 'onViewPage';
        Commands.ZOOM_IN = Commands.namespace + 'onZoomIn';
        Commands.ZOOM_OUT = Commands.namespace + 'onZoomOut';
        return Commands;
    })();
    return Commands;
});
//# sourceMappingURL=Commands.js.map