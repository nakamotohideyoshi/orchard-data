// Packages
var express = require('express');
var router = express.Router();

router.get('/api/test', function(req, res) {
  console.log("toba");
});

/*
router.get('/api/filestore/upload', function(req, res){
  var S3_BUCKET = 'test1506';
  const s3 = new AWS.S3({
    signatureVersion: 'v4'
  });
  const fileName = req.query['file-name'];
  const fileType = req.query['file-type'];
  const s3Params = {
    Bucket: S3_BUCKET,
    Key: fileName,
    Expires: 300,
    ContentType: fileType,
    ACL: 'public-read'
  };

  s3.getSignedUrl('putObject', s3Params, (err, data) => {
    if(err){
      res.json(err);
      console.log(err);
      return res.end();
    }
    const returnData = {
      signedRequest: data,
      url: `https://${S3_BUCKET}.s3.amazonaws.com/${fileName}`
    };
    res.json(returnData);
    res.end();
  });
});

router.get('/api/filestore/download', function(req, res){
  var S3_BUCKET = 'test1506';
  const s3 = new AWS.S3({
    signatureVersion: 'v4'
  });
  const fileName = req.query['file-name'];
  const s3Params = {
    Bucket: S3_BUCKET,
    Key: fileName,
  };

  s3.getSignedUrl('getObject', s3Params, (err, data) => {
    if(err){
      res.json(err);
      console.log(err);
      return res.end();
    }
    const returnData = {
      url: data,
    };
    res.json(returnData);
    res.end();
  });
});


router.get('/api/filestore/all', function(req, res){
  var S3_BUCKET = 'test1506';
  const s3 = new AWS.S3({
    signatureVersion: 'v4'
  });

  const s3Params = {
    Bucket: S3_BUCKET,
  };
  s3.listObjects(s3Params, function (err, data) {
    if(err){
      res.json(err);
      console.log(err);
      return res.end();
    }
    res.json(data);
    res.end();
  });
});

router.get('/api/visaoGeralLiderancasInfo', function(req, res) {
  return res.json(JSON.parse(fs.readFileSync(`${path}/visao-geral-liderancas-info.json`, 'utf8')));
});

router.get('/api/visaoGeralListInfo', function(req, res) {
  return res.json(JSON.parse(fs.readFileSync(`${path}/visao-geral-list-info.json`, 'utf8')));
});

router.get('/api/visaoGeralChartInfo', function(req, res) {
  if(`${req.query.dataIndex}` === '1') {
    return res.json(JSON.parse(fs.readFileSync(`${path}/visao-geral-chart-info-1.json`, 'utf8')));
  } else {
    return res.json(JSON.parse(fs.readFileSync(`${path}/visao-geral-chart-info-2.json`, 'utf8')));
  }
});

router.get('/api/newsMosaico', function(req, res) {
  var obj = JSON.parse(fs.readFileSync(`${path}/news-mosaico.json`, 'utf8'));
  return res.json(obj);
});

router.get('/api/news', function(req, res) {
  var obj = JSON.parse(fs.readFileSync(`${path}/news.json`, 'utf8'));
  if(['heineken','grupoPetropolis','cbbp'].indexOf(req.query.dataId) !== -1) { obj = obj.filter(d => d["env"] === req.query.dataId.toString()); }
  return res.json(obj);
});

router.get('/api/readNews', function(req, res) {
  return res.json(true);
});

router.get('/api/geoData', function(req, res) {
  var id = req.query.geolocalizacao != null && req.query.geolocalizacao.id != null ? req.query.geolocalizacao.id : 'brasil';
  var obj = JSON.parse(fs.readFileSync(`${path}/gViz/geography/${id}.json`, 'utf8'));
  return res.json(obj);
});

router.get('/api/chartInfo', function(req, res) {
  var obj = JSON.parse(fs.readFileSync(`${path}chart-info-${req.query.visualization}.json`, 'utf8'));
  return res.json(obj);
});

router.get('/api/visaoGeralChartVisualization', function(req, res) {
  var fileString = "{}";
  switch(req.query.visualization) {
    case "bar":
      fileString = fs.readFileSync(`${path}/gViz/visao-geral-bar-chart.json`, 'utf8');
      break;
  }

  // Change colors
  if(req.query.dataId === 'heineken') { fileString = fileString.replace(/267c56/g, "267c56"); }
  else if(req.query.dataId === 'grupoPetropolis') { fileString = fileString.replace(/267c56/g, "ff8b1e"); }
  else if(req.query.dataId === 'cbbp') { fileString = fileString.replace(/267c56/g, "ca5b57"); }

  // Parse json and select only valid locations
  var json = JSON.parse(fileString);

  return res.json(json);
});

router.get('/api/chartVisualization', function(req, res) {
  var fileString = "{}";
  switch(req.query.visualization) {
    case "bar":
      fileString = fs.readFileSync(`${path}/gViz/bar-chart.json`, 'utf8');
      break;
    case "time":
      fileString = fs.readFileSync(`${path}/gViz/line-area-chart.json`, 'utf8');
      break;
    case "words":
      if(req.query.isSecondary == null) { fileString = fs.readFileSync(`${path}/gViz/treemap-chart.json`, 'utf8'); }
      else { fileString = fs.readFileSync(`${path}/gViz/treemap-chart-2.json`, 'utf8'); }
      break;
    case "map":
      if(req.query.isSecondary == null) { fileString = fs.readFileSync(`${path}/gViz/map-chart.json`, 'utf8'); }
      else { fileString = fs.readFileSync(`${path}/gViz/map-chart-2.json`, 'utf8'); }
      break;
  }

  // Change colors
  if(req.query.dataId === 'heineken') { fileString = fileString.replace(/267c56/g, "267c56"); }
  else if(req.query.dataId === 'grupoPetropolis') { fileString = fileString.replace(/267c56/g, "ff8b1e"); }
  else if(req.query.dataId === 'cbbp') { fileString = fileString.replace(/267c56/g, "ca5b57"); }

  // Parse json and select only valid locations
  var json = JSON.parse(fileString);
  if(req.query.visualization === 'map' && req.query.geolocalizacao != null && req.query.geolocalizacao.id != null) {
    if(['norte','nordeste','sul','sudeste','centro-oeste'].indexOf(req.query.geolocalizacao.id) !== -1) {
      json.data.points = json.data.points.filter(d => d.regiao === req.query.geolocalizacao.id);
    } else if(['acre','alagoas','amazonas','amapa','bahia','ceara','distrito-federal','espirito-santo','goias','maranhao','minas-gerais','mato-grosso-do-sul','mato-grosso','para','paraiba','pernambuco','piaui','parana','rio-de-janeiro','rio-grande-do-norte','rondonia','roraima','rio-grande-do-sul','santa-catarina','sergipe','sao-paulo','tocantins'].indexOf(req.query.geolocalizacao.id) !== -1) {
      json.data.points = json.data.points.filter(d => d.uf === req.query.geolocalizacao.id);
    }
  }

  return res.json(json);
});


router.get('/api/contato', function(req, res) {
  console.log(req.query);
  return res.json(true);
});
*/

// Export modules
module.exports = router
