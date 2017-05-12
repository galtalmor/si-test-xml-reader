/**
 * si-test-xml-reader
 * https://github.com/galtalmor/si-test-xml-reader
 *
 * Copyright (c) 2017 Gal Talmor
 * Licensed under the MIT license.
 */

var http = require('http');
var zlib = require('zlib');
var Promise = require('promise');
var xml2js = require('xml2js');

function Parser() {
    /**
     * parses the XML in the given URL/Path.
     *
     * @param  {String} reqUrl
     * @return {Promise<Object>}
     */
    function parse(reqUrl) {
        return new Promise(function (resolve, reject) {
            getFileAsBuffer(reqUrl)
                .then(unzipBuffer, reject)
                .then(parseXml, reject)
                .then(resolve, reject);
        });
    }

    function getFileAsBuffer(reqUrl) {
        return new Promise(function (resolve, reject) {
            http.get(reqUrl, function (res) {
                var data = [];

                res.on('data', function (chunk) {
                    data.push(chunk);
                }).on('end', function () {
                    var buffer = Buffer.concat(data);
                    resolve(buffer);
                }).on('error', function (e) {
                    reject(e);
                });
            });
        });
    }

    function unzipBuffer(data) {
        return new Promise(function (resolve, reject) {
            try {
                var extractBin = zlib.unzipSync(data);
                resolve(extractBin.toString());
            }
            catch (e) {
                reject(e);
            }
        });
    }

    function parseXml(xml) {
        return new Promise(function (resolve, reject) {
            xml2js.parseString(xml, function (err, res) {
                var resJson = {};

                if (err) {
                    reject(err);
                }
                else {
                    try {
                        if (res['root']) {
                            resJson['chainId'] = res['root']['ChainId'][0];
                            resJson['subChainId'] = res['root']['SubChainId'][0];
                            resJson['storeId'] = res['root']['StoreId'][0];
                            resJson['bikoretNo'] = res['root']['BikoretNo'][0];
                            resJson['items'] = parseShufersalItems(res['root']['Items'][0]);
                        }
                        else if (res['Prices']) {
                            resJson['chainId'] = res['Prices']['ChainID'][0];
                            resJson['subChainId'] = res['Prices']['SubChainID'][0];
                            resJson['storeId'] = res['Prices']['StoreID'][0];
                            resJson['bikoretNo'] = res['Prices']['BikoretNo'][0];
                            resJson['items'] = parseVictoryItems(res['Prices']['Products'][0]);
                        }
                        else {
                            reject(new Error('Unknown XML file format'));
                        }

                        resolve(resJson);
                    }
                    catch (e) {
                        reject(e);
                    }
                }
            });
        });
    }

    function parseShufersalItems(items) {
        var res = [],
            i;

        for (i = 0; i < items['Item'].length; i++) {
            res.push({
                priceUpdateDate: items['Item'][i]['PriceUpdateDate'][0],
                itemCode: items['Item'][i]['ItemCode'][0],
                itemType: items['Item'][i]['ItemType'][0],
                itemName: items['Item'][i]['ItemName'][0],
                manufacturerName: items['Item'][i]['ManufacturerName'][0],
                manufactureCountry: items['Item'][i]['ManufactureCountry'][0],
                manufacturerItemDescription: items['Item'][i]['ManufacturerItemDescription'][0],
                unitQty: items['Item'][i]['UnitQty'][0],
                quantity: items['Item'][i]['Quantity'][0],
                bisWeighted: items['Item'][i]['bIsWeighted'][0],
                unitOfMeasure: items['Item'][i]['UnitOfMeasure'][0],
                qtyInPackage: items['Item'][i]['QtyInPackage'][0],
                itemPrice: items['Item'][i]['ItemPrice'][0],
                unitOfMeasurePrice: items['Item'][i]['UnitOfMeasurePrice'][0],
                allowDiscount: items['Item'][i]['AllowDiscount'][0],
                itemStatus: items['Item'][i]['ItemStatus'][0]
            });
        }

        return res;
    }

    function parseVictoryItems(items) {
        var res = [],
            i;

        for (i = 0; i < items['Product'].length; i++) {
            res.push({
                priceUpdateDate: items['Product'][i]['PriceUpdateDate'][0],
                itemCode: items['Product'][i]['ItemCode'][0],
                itemType: items['Product'][i]['ItemType'][0],
                itemName: items['Product'][i]['ItemName'][0],
                manufacturerName: items['Product'][i]['ManufactureName'][0],
                manufactureCountry: items['Product'][i]['ManufactureCountry'][0],
                manufacturerItemDescription: items['Product'][i]['ManufactureItemDescription'][0],
                unitQty: items['Product'][i]['UnitQty'][0],
                quantity: items['Product'][i]['Quantity'][0],
                bisWeighted: items['Product'][i]['BisWeighted'][0],
                unitOfMeasure: items['Product'][i]['UnitMeasure'][0],
                qtyInPackage: items['Product'][i]['QtyInPackage'][0],
                itemPrice: items['Product'][i]['ItemPrice'][0],
                unitOfMeasurePrice: items['Product'][i]['UnitOfMeasurePrice'][0],
                allowDiscount: items['Product'][i]['AllowDiscount'][0],
                itemStatus: items['Product'][i]['itemStatus'][0]
            });
        }

        return res;
    }

    return {
        parse: parse
    };
}


exports.parse = new Parser().parse;
