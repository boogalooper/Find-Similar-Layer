///////////////////////////////////////////////////////////////////////////////
// Find similar layer
// jazz-y@ya.ru
///////////////////////////////////////////////////////////////////////////////

#target photoshop

 /*
// BEGIN__HARVEST_EXCEPTION_ZSTRING
<javascriptresource>
<name>Find similar layer</name>
<category>jazzy</category>
<enableinfo>true</enableinfo>
<eventid>4e0635ce-d0d4-44c0-89d5-625346af9d3f</eventid>
<terminology><![CDATA[<< /Version 1
                        /Events <<
                        /4e0635ce-d0d4-44c0-89d5-625346af9d3f [(Find similar layer) <<
                        /sourceVisible [(Source visiblity) /number]
                        /sourceDeselect [(Source selection) /number]
                        /targetVisible [(Target visiblity) /number]
                        /targetSelect [(Target selection) /number]
                        /matchWholeWord [(Match whole name) /boolean]
                        /matchType [(Match type) /boolean]
                        >>]
                         >>
                      >> ]]></terminology>
</javascriptresource>
// END__HARVEST_EXCEPTION_ZSTRING
*/

$.localize = true 
//$.locale = "ru"

// bin here
var rev = "0.11",
    GUID = "4e0635ce-d0d4-44c0-89d5-625346af9d3f",
    strMessage = "Find Similar Layer",
    strCancel={ru: "Отмена", en: "Cancel"},
    strOk={ru: "Найти слой", en: "Find layer"},
    strSource={ru: "Слой-источник", en: "Source layer"},
    strVis = {ru: "видимость:", en: "visiblity:"},
    strVis0 = {ru: "не изменять", en: "do not change"},
    strVis1 = {ru: "сделать видимым", en: "make visible"},
    strVis2 = {ru: "сделать невидимым", en: "make invisible"},
    strSelection = {ru: "выделение:", en: "selection:"},
    strSel0 = {ru: "оставить выделение", en: "select"},
    strSel1 = {ru: "убрать выделение", en: "deselect"},
    strComp = {ru: "Сравнение с источником", en: "Comparsion with source"},
    strMatchWW = {ru: "полное совпадение имени", en: "full name match"},
    strMatchPW = {ru: "частичное совпадение имени", en: "partial name match"},
    strCons = {ru: "учитывать тип слоя", en: "match layer kind"},
    strSave = {ru: "Сохранить настройки", en: "Save settings"},
    strTarget = {ru: "Целевой слой", en: "Target layer"};

var AM = new OrdinalDocument,
    cfg = new initCfg,
    source = [],
    target = [],
    isCancelled = false;
   
main ()

function main ()
{
    if (!app.playbackParameters.count) {
        // normal run
        getScriptSettings (cfg)

        var w = buildWindow(); var result = w.show()

        if (result == 2) { isCancelled = true; return } else  // if cancelled
        {
            putScriptSettings (cfg)
            putScriptSettings (cfg, true)
            if (getAllLayers(source, target)) findSimilar(source, target)
        }
        // exit script  
    }
    else {

        getScriptSettings (cfg, true)

        if (app.playbackDisplayDialogs == DialogModes.ALL) {
            //double click from action
            var w = buildWindow(true); var result = w.show()

            if (result == 2) { isCancelled = true; return } else // if cancelled
            {
                putScriptSettings (cfg, true)
            }
        }

        if (app.playbackDisplayDialogs != DialogModes.ALL) {
            if (getAllLayers(source, target)) findSimilar(source, target)
        } //run by button "play" with saved in palette settings
        // next code  
    }
}


isCancelled ? 'cancel' : undefined
//

function buildWindow(saveMode) {
    // W
    // =
    var w = new Window("dialog");
    w.text = "FindSimilarLayer " + rev ;
    w.orientation = "column";
    w.alignChildren = ["fill", "top"];
    w.spacing = 10;
    w.margins = 16;
    w.preferredSize.width = 250
    // PNSOURCE
    // ========
    var pnSource = w.add("panel");
    pnSource.text = strSource;
    pnSource.orientation = "column";
    pnSource.alignChildren = ["fill", "top"];
    pnSource.spacing = 10;
    pnSource.margins = [10,15,10,10]

    var stVisSource = pnSource.add("statictext");
    stVisSource.text = strVis;

    var dlVisSource_array = [strVis0, strVis1, strVis2];
    var dlVisSource = pnSource.add("dropdownlist", undefined, undefined, {items: dlVisSource_array });

    var stSelSource = pnSource.add("statictext");
    stSelSource.text = strSelection;

    var dlSelSource_array = [strSel0, strSel1];
    var dlSelSource = pnSource.add("dropdownlist", undefined, undefined, {items: dlSelSource_array });

    // PNOPTIONS
    // =========
    var pnOptions = w.add("panel");
    pnOptions.text = strComp
    pnOptions.orientation = "column";
    pnOptions.alignChildren = ["left", "top"];
    pnOptions.spacing = 10;
    pnOptions.margins = [10,15,10,10];

    var chFull = pnOptions.add("radiobutton");
    chFull.text = strMatchWW

    var chPartial = pnOptions.add("radiobutton");
    chPartial.text = strMatchPW

    var chType = pnOptions.add("checkbox");
    chType.text = strCons

    // PANEL1
    // ======
    var panel1 = w.add("panel");
    panel1.text = strTarget
    panel1.orientation = "column";
    panel1.alignChildren = ["fill", "top"];
    panel1.spacing = 10;
    panel1.margins = [10,15,10,10];

    var stVisTarget = panel1.add("statictext");
    stVisTarget.text = strVis

    var dlVisTarget_array = [strVis0, strVis1, strVis2];
    var dlVisTarget = panel1.add("dropdownlist", undefined, undefined, { items: dlVisTarget_array });

    var stSelTarget = panel1.add("statictext");
    stSelTarget.text = strSelection;

    var dlSelTarget_array = [strSel0,strSel1];
    var dlSelTarget = panel1.add("dropdownlist", undefined, undefined, {items: dlSelTarget_array });

    // GROUP1
    // ======
    var group1 = w.add("group");
    group1.orientation = "row";
    group1.alignChildren = ["center", "center"];
    group1.spacing = 10;
    group1.margins = 0;

    var ok = group1.add("button", undefined, undefined, { name: "ok" });
    ok.text = saveMode ? strSave : strOk;

    var cancel = group1.add("button", undefined, undefined, { name: "cancel" });
    cancel.text = strCancel;

    
    dlVisSource.onChange = function () {cfg.sourceVisible = this.selection.index}
    dlSelSource.onChange = function () {cfg.sourceDeselect = this.selection.index}
    chFull.onClick = function () {cfg.matchWholeWord = this.value}
    chPartial.onClick = function () {cfg.matchWholeWord = !this.value}
    chType.onClick = function () {cfg.matchType = this.value}
    dlVisTarget.onChange = function () {cfg.targetVisible = this.selection.index}
    dlSelTarget.onChange = function () {cfg.targetSelect = this.selection.index}
    
    w.onShow = function ()
    {
        dlVisSource.selection = cfg.sourceVisible
        dlSelSource.selection = cfg.sourceDeselect
        chFull.value = cfg.matchWholeWord
        chPartial.value = !cfg.matchWholeWord
        chType.value = cfg.matchType
        dlVisTarget.selection = cfg.targetVisible
        dlSelTarget.selection = cfg.targetSelect
    }

    return w;
}

function getAllLayers(source, target) {

    var hasBackgroundLayer = s2t('hasBackgroundLayer'),
        numberOfLayers = s2t('numberOfLayers'),
        layerID = s2t('layerID'),
        name = s2t('name'),
        layerKind = s2t('layerKind');

    from = AM.getDocProperty(hasBackgroundLayer) ? 0 : 1,
        len = AM.getDocProperty(numberOfLayers);

    if (len == 0) return false

    for (var i = from; i <= len; i++) {
        var id = AM.getLayerProperty(layerID, i),
            title = AM.getLayerProperty(name, i),
            type = AM.getLayerProperty(layerKind, i);

        title = title.replace(/\s+/ig, " ")
        title = title.replace(/^\s/ig, "")
        title = title.replace(/\s$/ig, "")

        target.push({ id: id, name: title, type: type, result: 0 })
    }

    sel = AM.getDocProperty(s2t('targetLayersIndexes')),
        len = sel instanceof Object ? sel.count : 0;

    if (len == 0) return false

    for (var i = 0; i < len; i++) {
        source.push(target[sel.getReference(i).getIndex()])
    }

    return true
}

function findSimilar(source, target) {
    var len = source.length

    for (var i = 0; i < len; i++) {
        var cur = cfg.matchWholeWord ? source[i].name : source[i].name.split(' ')
        checkName(cur, source[i], target)
    }

    target.sort(sortLayers)

    if (target[0].result != 0) {

        // видимость источника
        if (cfg.sourceVisible != 0) {
            for (var i = 0; i < len; i++) {
                AM.layerVisibilityById(source[i].id, cfg.sourceVisible)
            }
        }

        // выделение источника
        if (cfg.sourceDeselect == 1) AM.deselectLayers()

        var result = target[0].result,
            len = target.length;

        for (var i = 0; i < len; i++)
            if (target[i].result == result) {
                // видимость цели
                if (cfg.targetVisible != 0) AM.layerVisibilityById(target[i].id, cfg.targetVisible)
                // выделение цели
                if (cfg.targetSelect == 0) AM.selectLayerById (target[i].id)
            } else { break; }
    }

    function checkName(word, src, target) {
    var len = cfg.matchWholeWord ? 1 : word.length

    for (var i = 0; i < len; i++) {
        cur = cfg.matchWholeWord ? word : word[i]

        for (var n = 0; n < target.length; n++) {
            if (target[n].type == 13) continue;
            if (target[n].id == src.id) continue;
            if (checkSourceId(target[n].id)) continue;
            if (target[n].type != src.type && cfg.matchType) continue;

            if (target[n].name.match(new RegExp(cur, "i")) != null) target[n].result++           
        }
    }

    function checkSourceId (id)
    {
        var len = source.length
        for (var i = 0; i < len; i++) {
            if (id == source[i].id) return true
        } 
        return false
    }
}

function sortLayers(a, b) { return a.result <= b.result ? 1 : -1 }
}

function OrdinalDocument() {

    var gProperty = s2t("property"),
        gOrdinal = s2t("ordinal"),
        gTargetEnum = s2t("targetEnum"),
        gDocument = s2t("document"),
        gLayer = s2t("layer"),
        gNull = s2t("null"),
        gSelectNoLayers = s2t("selectNoLayers"),
        gSelectionModifier = s2t("selectionModifier"),
        gSelectionModifierType = s2t("addToSelectionContinuous"),
        gAddToSelectionContinuous = s2t("addToSelection"),
        gSelect = s2t("select");

    this.getDocProperty = function (property) {
        try {
            var ref = new ActionReference()
            ref.putProperty(gProperty, property)
            ref.putEnumerated(gDocument, gOrdinal, gTargetEnum)
            return getDescValue(executeActionGet(ref), property)
        } catch (e) { return 0 }
    }

    this.getLayerProperty = function (property, index) {
        var ref = new ActionReference()
        ref.putProperty(gProperty, property)
        ref.putIndex(gLayer, index)
        return getDescValue(executeActionGet(ref), property)
    }

    this.deselectLayers = function () {
        var desc = new ActionDescriptor();
        var ref = new ActionReference();
        ref.putEnumerated(gLayer, gOrdinal, gTargetEnum);
        desc.putReference(gNull, ref);
        executeAction(gSelectNoLayers, desc, DialogModes.NO);
    }

    this.layerVisibilityById = function (id, makeVisible) {
        makeVisible = makeVisible == 1 ? "show" : "hide"
        var desc = new ActionDescriptor()
        var ref = new ActionReference()
        ref.putIdentifier(gLayer, id)
        desc.putReference(gNull, ref)
        executeAction(s2t(makeVisible), desc, DialogModes.NO);
    }

    this.selectLayerById = function (id) {
        var desc = new ActionDescriptor()
        var ref = new ActionReference()
        ref.putIdentifier(gLayer, id)
        desc.putReference(gNull, ref);
        desc.putEnumerated(gSelectionModifier, gSelectionModifierType, gAddToSelectionContinuous);
        executeAction(gSelect, desc, DialogModes.NO);
    }

    function getDescValue(desc, property) {

        switch (desc.getType(property)) {
            case DescValueType.OBJECTTYPE:
                return (desc.getObjectValue(property));
                break;
            case DescValueType.LISTTYPE:
                return desc.getList(property);
                break;
            case DescValueType.REFERENCETYPE:
                return desc.getReference(property);
                break;
            case DescValueType.BOOLEANTYPE:
                return desc.getBoolean(property);
                break;
            case DescValueType.STRINGTYPE:
                return desc.getString(property);
                break;
            case DescValueType.INTEGERTYPE:
                return desc.getInteger(property);
                break;
            case DescValueType.LARGEINTEGERTYPE:
                return desc.getLargeInteger(property);
                break;
            case DescValueType.DOUBLETYPE:
                return desc.getDouble(property);
                break;
            case DescValueType.ALIASTYPE:
                return desc.getPath(property);
                break;
            case DescValueType.CLASSTYPE:
                return desc.getClass(property);
                break;
            case DescValueType.UNITDOUBLE:
                return (desc.getUnitDoubleValue(property));
                break;
            case DescValueType.ENUMERATEDTYPE:
                return (t2s(desc.getEnumerationValue(property)));
                break;
            case DescValueType.RAWTYPE:
                var tempStr = desc.getData(property);
                var rawData = new Array();
                for (var tempi = 0; tempi < tempStr.length; tempi++) {
                    rawData[tempi] = tempStr.charCodeAt(tempi);
                }
                return rawData;
                break;
            default:
                break;
        };
    }
}

function initCfg() {
    this.sourceVisible = 0 // 0 - не изменять, 1 - сделать видимым, 2 - сделать невидимым
    this.sourceDeselect = 0 // 0 - оставить выделение, 1 - убрать выделение 
    this.targetVisible = 0 // 0 - не изменять, 1 - сделать видимым, 2 - сделать невидимым
    this.targetSelect = 0 // 0 - выделить, 1 - убрать выделение 
    this.matchWholeWord = false
    this.matchType = true
}

function getScriptSettings (settingsObj, fromAction)
{
    if (fromAction) {
        var d = app.playbackParameters
    } else {
    try {var d = app.getCustomOptions(GUID)} catch (e) {}
    }

    if (d!=undefined) descriptorToObject(settingsObj, d, strMessage)

    function descriptorToObject (o, d, s) 
    {
        var l = d.count;
        if (l) {
            if ( d.hasKey(s2t("message")) && ( s != d.getString(s2t("message")) )) return;
        }
        for (var i = 0; i < l; i++ ) {
            var k = d.getKey(i); 
            var t = d.getType(k);
            strk = app.typeIDToStringID(k);
            switch (t) {
                case DescValueType.BOOLEANTYPE:
                    o[strk] = d.getBoolean(k);
                    break;
                case DescValueType.STRINGTYPE:
                    o[strk] = d.getString(k);
                    break;
                case DescValueType.INTEGERTYPE:
                    o[strk] = d.getDouble(k);
                    break;
            }
        }
    }

}

function putScriptSettings (settingsObj, toAction)
{
    var d = objectToDescriptor(settingsObj, strMessage)
           
    if (toAction) { app.playbackParameters = d } 
    else {app.putCustomOptions(GUID, d)}

    function objectToDescriptor (o, s) 
    {
        var d = new ActionDescriptor;
        var l = o.reflect.properties.length;
        d.putString(s2t("message"), s);
        for (var i = 0; i < l; i++ ) {
            var k = o.reflect.properties[i].toString();
            if (k == "__proto__" || k == "__count__" || k == "__class__" || k == "reflect") continue;
            var v = o[ k ];
            k = app.stringIDToTypeID(k);
            switch ( typeof(v) ) {
                case "boolean": d.putBoolean(k, v); break;
                case "string": d.putString(k, v); break;
                case "number": d.putInteger(k, v); break;
            }
        }
        return d;
    }    
}

function s2t(s) { return stringIDToTypeID(s) }
function t2s(t) { return typeIDToStringID(t) }  