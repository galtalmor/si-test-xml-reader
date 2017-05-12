si-test-xml-reader
=========

A package to parse different xml structure of each shop by the xml file url/path with prices and shop code.

## Installation

```shell
  npm install si-test-xml-reader --save
```

## Usage

```js
  var siTestXmlReader = require('si-test-xml-reader');

  var parsedPrices = si-test-xml-reader.parse(url);

  console.log('parsedPrices: ', parsedPrices);
```

## Tests

```shell
   npm test
```

## Release History

* 0.0.1 Initial release
