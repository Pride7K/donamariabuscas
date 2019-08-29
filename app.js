
const express = require('express');
const bodyParser = require('body-parser');
const Sequelize = require("sequelize");
const http = require("http");
const debug = require("debug")("TCC:app");
const app = express();
const handle = require("express-handlebars");

app.engine("handlebars",handle({defaultLayout: "main"}));
app.set("view engine","handlebars");


const server = http.createServer(app);
const router = express.Router();

////////////Codigo QUE   O COMPILA CODIGO PARA JSON //////////////////


app.use(bodyParser.json());
app.set(bodyParser.urlencoded( {extended: false} ));
app.use(express.static('./public'));


////////////////////////////////////////////////////////

//conexao com o chatbot
const AssistantV2 = require('ibm-watson/assistant/v1');

const assistant = new AssistantV2({
  version: '2018-09-20',
  iam_apikey: 'XSm7MgmAE18iXX4gHf7MiKhGxel4ldBxtNkPiDP3d-dZ',
  url: "https://gateway-syd.watsonplatform.net/assistant/api"
});

//rota do bot
app.post('/conversation/', (req, res) => {
  const { text, context = {} } = req.body;

  const params = {
    input: { text },
    workspace_id: 'f865dd60-880e-4cbd-abd7-72644ae74001',
    context,
  };

  assistant.message(params, (err, response) => {
    if (err) {
      console.error(err);
      res.status(500).json(err);
    } else {
      res.json(response);
    }
  });
});
//////////////////////////////////////////////////////////////////


const port = NormalizarPorta(process.env.PORT || "3000");

//trazer as rotas 

const index = require("./src/rotas/index-rota");
const produtos = require("./src/rotas/produtos-rota");


app.use("/sla", index)
app.use("/produtos", produtos)















server.listen(port, () => console.log(`Rodando na porta ${port}`));
server.on("error", TratandoErro);
server.on("listening", onListening);

function NormalizarPorta(val) {
  const port = parseInt(val, 10)

  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
}

function TratandoErro(error) {
  if (error.syscall !== "listen") {
    throw error;
  }
  const bind = typeof port === "string" ?
    "Pipe " + port :
    "Port " + port;

  switch (error.code) {
    case "EACCES":
      console.error(bind + " necessita de mais privilégios");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " porta ja esta em uso");
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening() {
  const addr = server.address();
  const bind = typeof addr === "string"
    ? "pipe" + addr
    : "port" + addr.port;
  debug("Listening on " + bind)
}
