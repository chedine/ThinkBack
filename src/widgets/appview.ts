import h from "snabbdom/h";
import * as R from "ramda";
import { mountComponent } from "./renderer";
import { OptionsBrowser } from "./opbrowser";
import {DataStore} from "../core/datastore";
const flyd = require("flyd");

export function configure() {
    const op_browser = new OptionsBrowser();
    mountComponent(document.querySelector("#optionschain"), op_browser);
    setupMock(op_browser);
}

const connect = function (source$: any, tgt$: any) {
    flyd.map(function (val: any) {
        tgt$(val);
    }, source$);
}

const setupMock = function (opb: OptionsBrowser) {
    const request = new XMLHttpRequest();
    const ds = DataStore.getInstance();
    console.log("Datastore setup begins !!");
    request.onreadystatechange = function () {
        if (request.readyState === 4) {
            if (request.status === 200) {
                const response = JSON.stringify(request.responseText);
                ds.add(JSON.parse(response));
                console.log("Datastore seeded !!");
                opb.init().tradeDate$(1475452800000);
            } else {
                console.log("Error setting up datastore");
            }
        }
    }
    request.open("GET", "data/20161031.json");
    request.send();
}