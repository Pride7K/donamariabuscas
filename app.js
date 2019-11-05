
const express = require('express');
const bodyParser = require('body-parser');
const Sequelize = require("sequelize");
const http = require("http");
const path = require("path")
const session = require("express-session");
const flash = require("connect-flash");
const debug = require("debug")("donamariabuscas-master:app");
const app = express();
const handle = require("express-handlebars");
const passport = require("passport");
require("./config/auth")(passport);


global.EMAIL2 = null;
global.LATITU = 0;
global.LONGITU = 0;





app.use(session({
  //// chave pra gerar sessao
  secret: "sjdjsdsadsçaldksalç",
  resave: true,
  saveUninitialized: true
}))

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());



///////////////////// configurando middleware

app.use(function (req, resp, next) {
  //variaveis globais usando locals
  resp.locals.success_msg = req.flash("success_msg");
  resp.locals.error_msg = req.flash("error_msg");
  resp.locals.error = req.flash("error");
  resp.locals.user = req.user || null;
  next();
})




////////////Codigo QUE   O COMPILA CODIGO PARA JSON //////////////////

app.set(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// manipulção de arquivos estaticos 

app.use(express.static(path.join(__dirname, "public")));

//////////////////////////////////////////////////////////////////////////


////// middleware = tratamento da requisição //////////
/*
app.use(function(req,resp,next)
       {
    console.log("middleware")
    next();
})
*/
////////////////////////////////////////////////////////////////


const server = http.createServer(app);
const router = express.Router();

//https://github.com/expressjs/body-parser


app.engine("handlebars", handle({ defaultLayout: "main" }));
app.set("view engine", "handlebars");


//trazer as rotas e usa-las


const index = require("./src/rotas/index-rota");
const produtos = require("./src/rotas/produtos-rota");
const cadastro = require("./src/rotas/usuario/cadastro-rota");
const login = require("./src/rotas/usuario/login-rota");
const adminproduto = require("./src/rotas/admin/adminproduto-rota");
const tipo_cadastro = require("./src/rotas/tipo_cadastro-rota");
const ofertas = require("./src/rotas/ofertas-rota");
const adminusuario = require("./src/rotas/admin/adminusuario-rota");
const redefinir_senha = require("./src/rotas/usuario/redefinir_senha-rota");
const sobrenos = require("./src/rotas/sobrenos-rota");
const gerenciar_cadastro = require("./src/rotas/usuario/gerenciar_cadastro-rota");


app.use("/login", login);
app.use("/index", index);
app.use("/produtos", produtos);
app.use("/cadastrar", cadastro);
app.use("/adminproduto", adminproduto);
app.use("/tp_cadastro", tipo_cadastro);
app.use("/ofertas",ofertas);
app.use("/controleusuarios",adminusuario);
app.use("/redefinir_senha",redefinir_senha);
app.use("/gerenc_conta",gerenciar_cadastro);
app.use("/sobrenos",sobrenos);
// manipulação de arquivos estaticos 




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


const port = process.env.PORT || 3000;


/////////////////// start do server //////////////////

server.listen(port, () => console.log(`Rodando na porta ${port}`));
server.on("error", TratandoErro);
server.on("listening", onListening);


/////////////////////////////////////////////////////////////////



////////////// Tratamento de erros /////////////////////////////

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
