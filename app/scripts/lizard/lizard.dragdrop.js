function dragdroppable ( drag, droptop, dropbottom){
    _.each(drag, function(onedrag){
        Hammer(onedrag, {drag: true}).on('dragend', function(e){
            whereto = whichClosest(e.gesture, droptop, dropbottom);
            var data_url = this.dataset.url;
            $(whereto).removeClass("empty");
            debugger
            $(whereto).find('.graph-drop').loadPlotData(data_url);
        });
    });

    function whichClosest(gesture, droptop, dropbottom){
        var target;
        yPosition = gesture.center.pageY + gesture.deltaY;
        if (yPosition < dropbottom.offset().top){
            target = droptop;
        } else {
            target = dropbottom;
        }
        // target = document.elementFromPoint(origin.pageX, origin.pageY)
        return target
    };
};