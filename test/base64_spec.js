"use strict";
/* global describe, it */
/* eslint no-var: 0 */

import WebpBase64 from "../lib/WebpBase64";
import base64stub from "./fixtures/base64";
import { expect } from "chai";
import Promise from "es6-promise";

Promise.polyfill();
describe("base64", ()=> {
  var base64 = new WebpBase64();

  it("test base64 data", ()=> {
    expect(new Buffer(base64stub.png_base64, "base64").toString()).to.eql(
      base64stub.png_bin.toString()
    );
  });

  it("extract png", ()=> {
    var png = "data:image/png;base64,iVBORw";
    var urlPng = "url(" + png + ")";
    var res = base64.extract(png);
    expect(res).to.be.instanceof(Array).and.have.lengthOf(1);
    expect([{ mimetype: "image/png", data: "iVBORw" }]).to.eql(res);

    res = base64.extract(urlPng, true);
    expect(res).to.be.instanceof(Array).and.have.lengthOf(1);
    expect([{ mimetype: "image/png", data: "iVBORw" }]).to.eql(res);

    res = base64.extract(base64stub.png_uri);
    expect(res).to.be.instanceof(Array).and.have.lengthOf(1);
    expect([{ mimetype: "image/png", data: base64stub.png_base64 }]).to.eql(res);

    res = base64.extract(base64stub.png_css, true);
    expect(res).to.be.instanceof(Array).and.have.lengthOf(1);
    expect([{ mimetype: "image/png", data: base64stub.png_base64 }]).to.eql(res);
  });

  it("extract multiple png", ()=> {
    var png = "data:image/png;base64,iVBORw";
    var urlPng2 = "url(" + png + "), url(" + png + ")";
    var res = base64.extract(urlPng2, true);
    expect(res).to.be.ok;
  });

  it("extract breaking data", ()=> {
    expect([{ mimetype: "_image/png", data: "iVBORw" }]).to.eql(
      base64.extract("data:_image/png;base64,iVBORw")
    );

    expect([{ mimetype: "url", data: "data_:image/png;base64,iVBORw" }]).to.eql(
      base64.extract("data_:image/png;base64,iVBORw")
    );

    expect([{ mimetype: "url", data: "data:image/pngbase64,iVBORw" }]).to.eql(
      base64.extract("data:image/pngbase64,iVBORw")
    );

    expect([{ mimetype: "url", data: "data:image/png;base64iVBORw" }]).to.eql(
      base64.extract("data:image/png;base64iVBORw")
    );
  });

  it("test convert data with node-webp png",
    ()=> base64.convert(base64stub.png_bin)
      .catch((err)=> expect(err).to.not.exist)
      .done((buffer)=> {
        expect(buffer).to.be.instanceof(Buffer);
        expect(buffer).to.be.eql(base64stub.webp);
      }));

  it("test convert data with node-webp jpg",
    ()=> base64.convert(base64stub.jpg_bin)
      .catch((err)=> expect(err).to.not.exist)
      .done((buffer)=> {
        expect(buffer).to.be.instanceof(Buffer);
        expect(buffer).to.be.eql(base64stub.webp_jpg_bin);
      }));
});
