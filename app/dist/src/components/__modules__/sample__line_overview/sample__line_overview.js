"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var loader_1 = require("../../loader");
var machine_list_1 = require("./machine_list");
var safety_1 = require("./safety");
var variances_1 = require("./variances");
var waste_1 = require("./waste");
var Overview = function (_a) {
    var type = _a.type, parent = _a.parent, departmentDataStore = _a.departmentDataStore;
    if (!departmentDataStore) {
        return React.createElement(loader_1.default, null);
    }
    var machines = parent.machines;
    // all department data
    var safety = departmentDataStore.get('procOverview').get('safety');
    var variances = departmentDataStore.get('procOverview').get('variances');
    var efficiency = departmentDataStore.get('procEfficiency');
    var production = departmentDataStore.get('procProduction');
    var scrap = departmentDataStore.get('procScrap');
    var forgeUptime = departmentDataStore.get('procForgeUptime');
    var forgeUnits = departmentDataStore.get('procForgeUnit');
    return (React.createElement("div", { className: "line_overview__container" },
        React.createElement(machine_list_1.default, { machines: parent.machines }),
        React.createElement("div", { className: "overview__top overview__pair" },
            React.createElement(safety_1.default, { plotData: safety }),
            React.createElement(variances_1.default, { plotData: variances })),
        React.createElement("div", { className: "overview__middle" },
            React.createElement(waste_1.default, { production: production, scrap: scrap, machines: machines }))));
};
exports.default = Overview;
